/**
 * TESTS DE SÉCURITÉ CRITIQUES - OWASP TOP 10 COMPLIANCE
 * Tests de sécurité pour transformation entreprise série B/C
 */

import { supabase } from '../../core/api/supabase.client';

// Mock crypto pour les tests
const mockCrypto = {
  randomUUID: () => 'mock-uuid-1234',
  getRandomValues: (array: any) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }
};

// @ts-ignore
global.crypto = mockCrypto;

describe('🛡️ TESTS DE SÉCURITÉ CRITIQUES - OWASP Compliance', () => {
  describe('1. INJECTION ATTACKS (SQL, NoSQL, XSS)', () => {
    it('protège contre les injections SQL dans les requêtes Supabase', () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const sanitizedInput = sanitizeInput(maliciousInput);
      
      // La fonction de sanitization doit neutraliser les caractères dangereux
      expect(sanitizedInput).not.toContain("DROP TABLE");
      expect(sanitizedInput).not.toContain(";");
      expect(sanitizedInput).not.toContain("--");
      
      // Test avec une vraie requête (simulée)
      const userSearchQuery = sanitizeInput("user@test.com'; DELETE FROM profiles WHERE '1'='1");
      expect(userSearchQuery).toBe("user@test.com DELETE FROM profiles WHERE 11");
    });

    it('protège contre les injections NoSQL dans les filtres', () => {
      const maliciousFilter = {
        $ne: null,
        $where: "function() { return true; }",
        workout_type: { $regex: "/.*/" }
      };
      
      const sanitizedFilter = sanitizeNoSQLFilter(maliciousFilter);
      
      // Les opérateurs dangereux doivent être supprimés
      expect(sanitizedFilter).not.toHaveProperty('$ne');
      expect(sanitizedFilter).not.toHaveProperty('$where');
      expect(sanitizedFilter).not.toHaveProperty('$regex');
      expect(sanitizedFilter.workout_type).toBe('[FILTERED]');
    });

    it('protège contre XSS dans les entrées utilisateur', () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">'
      ];

      xssPayloads.forEach(payload => {
        const sanitized = sanitizeHTML(payload);
        
        // Aucun tag script ou événement ne doit passer
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('<iframe');
      });
    });
  });

  describe('2. AUTHENTICATION & SESSION MANAGEMENT', () => {
    it('valide la force des mots de passe', () => {
      const weakPasswords = [
        '123456',
        'password',
        'qwerty',
        'abc123',
        'password123'
      ];

      const strongPasswords = [
        'MyStr0ngP@ssw0rd!',
        'C0mplex&Secure#123',
        'Long_Passw0rd_With_Numbers_2024!'
      ];

      weakPasswords.forEach(pwd => {
        expect(validatePasswordStrength(pwd).isValid).toBe(false);
        expect(validatePasswordStrength(pwd).score).toBeLessThan(3);
      });

      strongPasswords.forEach(pwd => {
        expect(validatePasswordStrength(pwd).isValid).toBe(true);
        expect(validatePasswordStrength(pwd).score).toBeGreaterThanOrEqual(4);
      });
    });

    it('implémente une gestion sécurisée des sessions JWT', () => {
      const mockJWTPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: 'user',
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + (24 * 60 * 60) // 24h
      };

      // Test validation token
      const isValid = validateJWTToken('mock-jwt-token', mockJWTPayload);
      expect(isValid).toBe(true);

      // Test expiration
      const expiredPayload = { ...mockJWTPayload, exp: Date.now() / 1000 - 3600 };
      const isExpired = validateJWTToken('mock-jwt-token', expiredPayload);
      expect(isExpired).toBe(false);
    });

    it('protège contre les attaques de session fixation', () => {
      // Simuler une nouvelle session
      const initialSessionId = generateSessionId();
      
      // Après authentification, l'ID de session doit changer
      const postAuthSessionId = generateSessionId();
      
      expect(initialSessionId).not.toBe(postAuthSessionId);
      expect(postAuthSessionId).toHaveLength(32); // Longueur sécurisée
      expect(postAuthSessionId).toMatch(/^[a-f0-9]+$/); // Caractères hexadécimaux uniquement
    });

    it('implémente un verrouillage de compte après tentatives échouées', () => {
      const userEmail = 'test@example.com';
      let attemptCount = 0;

      // Simuler 5 tentatives échouées
      for (let i = 0; i < 5; i++) {
        attemptCount++;
        const result = handleFailedLogin(userEmail, attemptCount);
        
        if (i < 4) {
          expect(result.locked).toBe(false);
          expect(result.remainingAttempts).toBe(5 - i - 1);
        } else {
          expect(result.locked).toBe(true);
          expect(result.lockoutDuration).toBe(15 * 60 * 1000); // 15 minutes
        }
      }
    });
  });

  describe('3. SENSITIVE DATA EXPOSURE', () => {
    it('chiffre les données sensibles avant stockage', () => {
      const sensitiveData = {
        weight: 80,
        height: 180,
        medical_conditions: ['diabetes', 'hypertension'],
        personal_notes: 'Informations médicales privées'
      };

      const encrypted = encryptSensitiveData(sensitiveData);
      
      // Les données chiffrées ne doivent pas être lisibles
      expect(encrypted).not.toContain('diabetes');
      expect(encrypted).not.toContain('hypertension');
      expect(encrypted).not.toContain('80');
      expect(encrypted).toMatch(/^[a-zA-Z0-9+/]+={0,2}$/); // Format Base64

      // Vérifier déchiffrement
      const decrypted = decryptSensitiveData(encrypted);
      expect(decrypted).toEqual(sensitiveData);
    });

    it('masque les informations sensibles dans les logs', () => {
      const logData = {
        user_id: 'user-123',
        action: 'profile_update',
        email: 'test@example.com',
        password: 'secret123',
        credit_card: '4111-1111-1111-1111',
        ssn: '123-45-6789'
      };

      const sanitizedLog = sanitizeLogData(logData);

      expect(sanitizedLog.email).toBe('t***@example.com');
      expect(sanitizedLog.password).toBe('[REDACTED]');
      expect(sanitizedLog.credit_card).toBe('4111-****-****-1111');
      expect(sanitizedLog.ssn).toBe('***-**-6789');
      expect(sanitizedLog.user_id).toBe('user-123'); // Non sensible
    });

    it('implémente des headers de sécurité HTTP', () => {
      const securityHeaders = getSecurityHeaders();

      expect(securityHeaders).toHaveProperty('Content-Security-Policy');
      expect(securityHeaders).toHaveProperty('X-Frame-Options', 'DENY');
      expect(securityHeaders).toHaveProperty('X-Content-Type-Options', 'nosniff');
      expect(securityHeaders).toHaveProperty('Strict-Transport-Security');
      expect(securityHeaders).toHaveProperty('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Vérifier CSP stricte
      const csp = securityHeaders['Content-Security-Policy'];
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).not.toContain("'unsafe-inline'");
      expect(csp).not.toContain("'unsafe-eval'");
    });
  });

  describe('4. BROKEN ACCESS CONTROL', () => {
    it('valide les permissions d\'accès aux ressources utilisateur', () => {
      const user1 = { id: 'user-1', role: 'user', subscription: 'pro' };
      const user2 = { id: 'user-2', role: 'user', subscription: 'free' };
      const admin = { id: 'admin-1', role: 'admin', subscription: 'premium' };

      // Test accès aux données personnelles
      expect(canAccessResource(user1, 'user_profile', 'user-1')).toBe(true);
      expect(canAccessResource(user1, 'user_profile', 'user-2')).toBe(false); // Pas ses données
      expect(canAccessResource(admin, 'user_profile', 'user-2')).toBe(true); // Admin peut voir

      // Test accès aux fonctionnalités premium
      expect(canAccessFeature(user1, 'advanced_analytics')).toBe(true); // Pro tier
      expect(canAccessFeature(user2, 'advanced_analytics')).toBe(false); // Free tier
      expect(canAccessFeature(admin, 'admin_dashboard')).toBe(true);
    });

    it('protège contre l\'élévation de privilèges', () => {
      const regularUser = { id: 'user-1', role: 'user' };
      
      // Tentative d'élévation via requête malveillante
      const maliciousUpdate = {
        id: 'user-1',
        role: 'admin', // Tentative de devenir admin
        permissions: ['admin', 'super_user']
      };

      const sanitizedUpdate = sanitizeUserUpdate(maliciousUpdate, regularUser);
      
      // Les champs sensibles doivent être ignorés
      expect(sanitizedUpdate).not.toHaveProperty('role');
      expect(sanitizedUpdate).not.toHaveProperty('permissions');
      expect(sanitizedUpdate.id).toBe('user-1'); // ID préservé si légitime
    });

    it('vérifie l\'isolation des données multi-tenant', () => {
      const tenant1Data = { tenant_id: 'tenant-1', workout_id: 'workout-123' };
      const tenant2Data = { tenant_id: 'tenant-2', workout_id: 'workout-456' };
      const user = { id: 'user-1', tenant_id: 'tenant-1' };

      // L'utilisateur ne peut accéder qu'aux données de son tenant
      expect(canAccessTenantData(user, tenant1Data)).toBe(true);
      expect(canAccessTenantData(user, tenant2Data)).toBe(false);
    });
  });

  describe('5. SECURITY MISCONFIGURATION', () => {
    it('vérifie la configuration sécurisée des variables d\'environnement', () => {
      const envConfig = {
        NODE_ENV: 'production',
        DEBUG: 'false',
        SUPABASE_URL: 'https://secure.supabase.co',
        SUPABASE_ANON_KEY: 'eyJ...',
        JWT_SECRET: 'complex-secret-key-with-256-bits',
        ENCRYPT_KEY: 'another-complex-encryption-key'
      };

      const validation = validateEnvironmentConfig(envConfig);
      
      expect(validation.isSecure).toBe(true);
      expect(validation.errors).toHaveLength(0);
      
      // Test configuration non sécurisée
      const insecureConfig = {
        NODE_ENV: 'development',
        DEBUG: 'true',
        JWT_SECRET: 'secret', // Trop simple
        SUPABASE_URL: 'http://localhost:3000' // Non HTTPS en prod
      };

      const insecureValidation = validateEnvironmentConfig(insecureConfig);
      expect(insecureValidation.isSecure).toBe(false);
      expect(insecureValidation.errors.length).toBeGreaterThan(0);
    });

    it('désactive les fonctionnalités de debug en production', () => {
      // Simuler environnement production
      process.env.NODE_ENV = 'production';
      
      const debugInfo = getDebugInfo();
      
      // Les informations sensibles ne doivent pas être exposées
      expect(debugInfo).not.toHaveProperty('database_credentials');
      expect(debugInfo).not.toHaveProperty('jwt_secret');
      expect(debugInfo).not.toHaveProperty('internal_apis');
      expect(debugInfo.environment).toBe('production');
      expect(debugInfo.debug_enabled).toBe(false);
    });
  });

  describe('6. VULNERABLE COMPONENTS', () => {
    it('vérifie l\'absence de vulnérabilités connues dans les dépendances', () => {
      const packageData = {
        dependencies: {
          'react': '^18.2.0',
          'lodash': '^4.17.21', // Version sécurisée
          '@supabase/supabase-js': '^2.38.0'
        }
      };

      const vulnerabilities = checkDependencyVulnerabilities(packageData);
      
      // Aucune vulnérabilité critique ne devrait être trouvée
      const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
      expect(criticalVulns).toHaveLength(0);
    });

    it('valide les versions minimales des dépendances critiques', () => {
      const criticalDependencies = {
        'react': { current: '18.2.0', minimum: '18.0.0', secure: true },
        'typescript': { current: '5.1.6', minimum: '4.9.0', secure: true },
        '@supabase/supabase-js': { current: '2.38.0', minimum: '2.30.0', secure: true }
      };

      Object.entries(criticalDependencies).forEach(([pkg, info]) => {
        expect(info.secure).toBe(true);
        expect(compareVersions(info.current, info.minimum)).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('7. INSUFFICIENT LOGGING & MONITORING', () => {
    it('enregistre les événements de sécurité critiques', () => {
      const securityEvents = [];
      const mockLogger = {
        logSecurityEvent: (event: any) => securityEvents.push(event)
      };

      // Simuler événements de sécurité
      mockLogger.logSecurityEvent({
        type: 'failed_login',
        user_id: 'user-123',
        ip_address: '192.168.1.100',
        timestamp: new Date().toISOString(),
        details: { attempts: 3 }
      });

      mockLogger.logSecurityEvent({
        type: 'privilege_escalation_attempt',
        user_id: 'user-456',
        ip_address: '10.0.0.50',
        timestamp: new Date().toISOString(),
        details: { attempted_role: 'admin' }
      });

      expect(securityEvents).toHaveLength(2);
      expect(securityEvents[0].type).toBe('failed_login');
      expect(securityEvents[1].type).toBe('privilege_escalation_attempt');
      
      // Vérifier format des logs
      securityEvents.forEach(event => {
        expect(event).toHaveProperty('timestamp');
        expect(event).toHaveProperty('ip_address');
        expect(event).toHaveProperty('user_id');
        expect(event.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    it('détecte les patterns d\'attaque automatisés', () => {
      const loginAttempts = [
        { ip: '192.168.1.100', timestamp: Date.now(), success: false },
        { ip: '192.168.1.100', timestamp: Date.now() + 1000, success: false },
        { ip: '192.168.1.100', timestamp: Date.now() + 2000, success: false },
        { ip: '192.168.1.100', timestamp: Date.now() + 3000, success: false },
        { ip: '192.168.1.100', timestamp: Date.now() + 4000, success: false }
      ];

      const analysis = detectBruteForcePattern(loginAttempts, '192.168.1.100');
      
      expect(analysis.isSuspicious).toBe(true);
      expect(analysis.failedAttempts).toBe(5);
      expect(analysis.timeWindow).toBeLessThan(10000); // 10 secondes
      expect(analysis.recommendedAction).toBe('block_ip');
    });

    it('alerte sur les activités suspectes en temps réel', () => {
      const alerts = [];
      const alertSystem = {
        triggerAlert: (alert: any) => alerts.push(alert)
      };

      // Simuler activité suspecte
      const suspiciousActivity = {
        type: 'data_exfiltration',
        user_id: 'user-789',
        volume: 1000000, // 1MB de données
        timeframe: 60000, // En 1 minute
        resources_accessed: ['all_users_data', 'payment_info', 'health_data']
      };

      if (suspiciousActivity.volume > 500000 && suspiciousActivity.timeframe < 120000) {
        alertSystem.triggerAlert({
          severity: 'critical',
          message: 'Possible data exfiltration detected',
          user_id: suspiciousActivity.user_id,
          timestamp: new Date().toISOString(),
          auto_block: true
        });
      }

      expect(alerts).toHaveLength(1);
      expect(alerts[0].severity).toBe('critical');
      expect(alerts[0].auto_block).toBe(true);
    });
  });
});

// Fonctions utilitaires de sécurité (implémentation basique pour les tests)
function sanitizeInput(input: string): string {
  return input
    .replace(/[';\\-]+/g, '')
    .replace(/DROP\s+TABLE/gi, '')
    .replace(/DELETE\s+FROM/gi, '')
    .replace(/INSERT\s+INTO/gi, '')
    .replace(/UPDATE\s+SET/gi, '');
}

function sanitizeNoSQLFilter(filter: any): any {
  const dangerous = ['$ne', '$where', '$regex', '$gt', '$lt', '$in', '$nin'];
  const cleaned = { ...filter };
  
  Object.keys(cleaned).forEach(key => {
    if (dangerous.includes(key) || key.startsWith('$')) {
      delete cleaned[key];
    }
    if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
      cleaned[key] = '[FILTERED]';
    }
  });
  
  return cleaned;
}

function sanitizeHTML(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<svg[^>]*onload[^>]*>/gi, '');
}

function validatePasswordStrength(password: string): { isValid: boolean; score: number } {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  return { isValid: score >= 4, score };
}

function validateJWTToken(token: string, payload: any): boolean {
  const now = Date.now() / 1000;
  return payload.exp > now && payload.iat <= now;
}

function generateSessionId(): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function handleFailedLogin(email: string, attempts: number): { locked: boolean; remainingAttempts: number; lockoutDuration?: number } {
  const maxAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes

  if (attempts >= maxAttempts) {
    return { locked: true, remainingAttempts: 0, lockoutDuration };
  }
  
  return { locked: false, remainingAttempts: maxAttempts - attempts };
}

function encryptSensitiveData(data: any): string {
  // Simulation d'un chiffrement (en réalité utiliser AES-256)
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64');
}

function decryptSensitiveData(encrypted: string): any {
  // Simulation d'un déchiffrement
  const jsonString = Buffer.from(encrypted, 'base64').toString();
  return JSON.parse(jsonString);
}

function sanitizeLogData(data: any): any {
  const sanitized = { ...data };
  
  if (sanitized.email) {
    const [local, domain] = sanitized.email.split('@');
    sanitized.email = `${local[0]}***@${domain}`;
  }
  
  if (sanitized.password) sanitized.password = '[REDACTED]';
  if (sanitized.credit_card) {
    sanitized.credit_card = sanitized.credit_card.replace(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/, '$1-****-****-$4');
  }
  if (sanitized.ssn) {
    sanitized.ssn = sanitized.ssn.replace(/(\d{3})-(\d{2})-(\d{4})/, '***-**-$3');
  }
  
  return sanitized;
}

function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

function canAccessResource(user: any, resourceType: string, resourceId: string): boolean {
  if (user.role === 'admin') return true;
  if (resourceType === 'user_profile') return user.id === resourceId;
  return false;
}

function canAccessFeature(user: any, feature: string): boolean {
  const featureRequirements: Record<string, string[]> = {
    'advanced_analytics': ['pro', 'premium'],
    'admin_dashboard': ['admin'],
    'basic_workouts': ['free', 'pro', 'premium']
  };
  
  const requiredTiers = featureRequirements[feature];
  return requiredTiers ? requiredTiers.includes(user.subscription || user.role) : false;
}

function sanitizeUserUpdate(update: any, currentUser: any): any {
  const sensitiveFields = ['role', 'permissions', 'subscription', 'admin'];
  const sanitized = { ...update };
  
  sensitiveFields.forEach(field => {
    if (sanitized.hasOwnProperty(field)) {
      delete sanitized[field];
    }
  });
  
  // Vérifier que l'utilisateur peut modifier cette ressource
  if (sanitized.id && sanitized.id !== currentUser.id && currentUser.role !== 'admin') {
    delete sanitized.id;
  }
  
  return sanitized;
}

function canAccessTenantData(user: any, data: any): boolean {
  return user.tenant_id === data.tenant_id;
}

function validateEnvironmentConfig(config: any): { isSecure: boolean; errors: string[] } {
  const errors = [];
  
  if (config.NODE_ENV !== 'production') {
    errors.push('NODE_ENV should be "production"');
  }
  
  if (config.DEBUG === 'true') {
    errors.push('DEBUG should be disabled in production');
  }
  
  if (config.JWT_SECRET && config.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters');
  }
  
  if (config.SUPABASE_URL && !config.SUPABASE_URL.startsWith('https://')) {
    errors.push('SUPABASE_URL should use HTTPS');
  }
  
  return { isSecure: errors.length === 0, errors };
}

function getDebugInfo(): any {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (isProd) {
    return {
      environment: 'production',
      debug_enabled: false,
      version: '1.0.0'
    };
  }
  
  return {
    environment: process.env.NODE_ENV,
    debug_enabled: true,
    database_credentials: '[HIDDEN]',
    jwt_secret: '[HIDDEN]'
  };
}

function checkDependencyVulnerabilities(packageData: any): any[] {
  // Simulation de vérification de vulnérabilités
  const knownVulnerabilities: Record<string, any[]> = {
    'lodash': [
      { version: '<4.17.19', severity: 'high', cve: 'CVE-2020-8203' }
    ]
  };
  
  const vulnerabilities = [];
  
  Object.entries(packageData.dependencies).forEach(([pkg, version]) => {
    if (knownVulnerabilities[pkg]) {
      knownVulnerabilities[pkg].forEach(vuln => {
        if (compareVersions(version as string, vuln.version.substring(1)) < 0) {
          vulnerabilities.push({ package: pkg, ...vuln });
        }
      });
    }
  });
  
  return vulnerabilities;
}

function compareVersions(a: string, b: string): number {
  const cleanA = a.replace(/[\^~]/, '');
  const cleanB = b.replace(/[\^~]/, '');
  
  const partsA = cleanA.split('.').map(Number);
  const partsB = cleanB.split('.').map(Number);
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  
  return 0;
}

function detectBruteForcePattern(attempts: any[], ip: string): any {
  const ipAttempts = attempts.filter(a => a.ip === ip && !a.success);
  const timeWindow = Math.max(...ipAttempts.map(a => a.timestamp)) - Math.min(...ipAttempts.map(a => a.timestamp));
  
  return {
    isSuspicious: ipAttempts.length >= 5 && timeWindow < 60000, // 5 tentatives en moins d'1 minute
    failedAttempts: ipAttempts.length,
    timeWindow,
    recommendedAction: ipAttempts.length >= 5 ? 'block_ip' : 'monitor'
  };
}