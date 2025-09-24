import { SecurityFramework, security, SecurityEvent, UserProfileSchema, WorkoutSchema } from '../security.framework';

describe('SecurityFramework - Enterprise Security Testing Suite', () => {
  let securityFramework: SecurityFramework;

  beforeEach(() => {
    securityFramework = SecurityFramework.getInstance();
    
    // Mock window.crypto for tests
    Object.defineProperty(window, 'crypto', {
      value: {
        getRandomValues: jest.fn((arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        })
      }
    });

    // Clear rate limit store
    (securityFramework as any).rateLimitStore.clear();
  });

  describe('🛡️ A03:2021 - Injection Prevention', () => {
    it('should sanitize XSS attempts', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello World';
      const sanitized = securityFramework.sanitizeInput(maliciousInput);
      
      expect(sanitized).toBe('Hello World');
      expect(sanitized).not.toContain('<script>');
    });

    it('should preserve safe HTML when allowed', () => {
      const safeInput = '<b>Bold</b> and <i>italic</i> text';
      const sanitized = securityFramework.sanitizeInput(safeInput, {
        allowHtml: true,
        allowedTags: ['b', 'i']
      });
      
      expect(sanitized).toBe('<b>Bold</b> and <i>italic</i> text');
    });

    it('should enforce length limits', () => {
      const longInput = 'a'.repeat(2000);
      
      expect(() => {
        securityFramework.sanitizeInput(longInput, { maxLength: 100 });
      }).toThrow('Input exceeds maximum length');
    });

    it('should handle SQL injection patterns', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const sanitized = securityFramework.sanitizeInput(sqlInjection);
      
      expect(sanitized).not.toContain('DROP TABLE');
      expect(sanitized).not.toContain('--');
    });

    it('should sanitize JavaScript event handlers', () => {
      const maliciousInput = '<img src="x" onerror="alert(1)">';
      const sanitized = securityFramework.sanitizeInput(maliciousInput, { allowHtml: true });
      
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });
  });

  describe('🔒 A02:2021 - Cryptographic Failures Prevention', () => {
    it('should encrypt and decrypt sensitive data', () => {
      const sensitiveData = 'user-ssn-123-45-6789';
      
      const encrypted = securityFramework.encryptSensitiveData(sensitiveData);
      expect(encrypted).not.toBe(sensitiveData);
      expect(encrypted.length).toBeGreaterThan(0);
      
      const decrypted = securityFramework.decryptSensitiveData(encrypted);
      expect(decrypted).toBe(sensitiveData);
    });

    it('should handle encryption errors gracefully', () => {
      expect(() => {
        securityFramework.decryptSensitiveData('invalid-encrypted-data');
      }).toThrow('Failed to decrypt data');
    });

    it('should generate cryptographically secure tokens', () => {
      const token1 = securityFramework.generateSecureToken(32);
      const token2 = securityFramework.generateSecureToken(32);
      
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2); // Should be unique
      expect(token1).toMatch(/^[a-f0-9]+$/); // Should be hex
    });
  });

  describe('🔑 A07:2021 - Authentication Security', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'MyStr0ng!P@ssw0rd123';
      const result = securityFramework.validatePassword(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(5);
      expect(result.feedback).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123456',
        'password',
        'abc123',
        'qwerty',
        'short'
      ];
      
      weakPasswords.forEach(password => {
        const result = securityFramework.validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.feedback.length).toBeGreaterThan(0);
      });
    });

    it('should detect common password patterns', () => {
      const patterns = [
        'aaaaaaaa', // Repeated characters
        'password123', // Common password
        '12345678' // Sequential numbers
      ];
      
      patterns.forEach(password => {
        const result = securityFramework.validatePassword(password);
        expect(result.isValid).toBe(false);
      });
    });

    it('should require minimum complexity', () => {
      const result = securityFramework.validatePassword('onlylowercase');
      expect(result.isValid).toBe(false);
      expect(result.score).toBeLessThan(5);
    });
  });

  describe('🛡️ A05:2021 - Security Configuration', () => {
    it('should generate proper security headers', () => {
      const headers = securityFramework.getSecurityHeaders();
      
      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers).toHaveProperty('X-Content-Type-Options', 'nosniff');
      expect(headers).toHaveProperty('X-Frame-Options', 'DENY');
      expect(headers).toHaveProperty('X-XSS-Protection', '1; mode=block');
    });

    it('should include proper CSP directives', () => {
      const headers = securityFramework.getSecurityHeaders();
      const csp = headers['Content-Security-Policy'];
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain('upgrade-insecure-requests');
    });
  });

  describe('🔍 A08:2021 - Data Integrity Validation', () => {
    it('should validate user profile data', () => {
      const validProfile = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        full_name: 'John Doe',
        preferences: {
          units: 'metric',
          language: 'en',
          notifications: true
        }
      };
      
      const result = securityFramework.validateDataIntegrity(validProfile, UserProfileSchema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid data structures', () => {
      const invalidProfile = {
        id: 'not-a-uuid',
        email: 'invalid-email',
        full_name: '',
      };
      
      const result = securityFramework.validateDataIntegrity(invalidProfile, UserProfileSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate workout data integrity', () => {
      const validWorkout = {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Morning Workout',
        type: 'strength',
        duration: 45,
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: 15
          }
        ]
      };
      
      const result = securityFramework.validateDataIntegrity(validWorkout, WorkoutSchema);
      expect(result.isValid).toBe(true);
    });
  });

  describe('🚨 A09:2021 - Security Logging', () => {
    it('should log security events properly', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const securityEvent: SecurityEvent = {
        type: 'authentication_failure',
        severity: 'high',
        userId: 'user123',
        details: { reason: 'Invalid password', attempts: 3 }
      };
      
      securityFramework.logSecurityEvent(securityEvent);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Security Event:',
        expect.objectContaining({
          eventType: 'authentication_failure',
          severity: 'high',
          userId: 'user123',
          details: { reason: 'Invalid password', attempts: 3 }
        })
      );
      
      consoleSpy.mockRestore();
    });

    it('should store critical events in audit log', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]');
      
      const criticalEvent: SecurityEvent = {
        type: 'data_breach_attempt',
        severity: 'critical',
        userId: 'user123',
        details: { suspiciousActivity: true }
      };
      
      securityFramework.logSecurityEvent(criticalEvent);
      
      expect(setItemSpy).toHaveBeenCalledWith('auditLogs', expect.any(String));
      
      setItemSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('🔐 Rate Limiting', () => {
    it('should allow requests within rate limit', () => {
      const identifier = 'user123';
      
      const result = securityFramework.checkRateLimit(identifier, 5, 60000);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding rate limit', () => {
      const identifier = 'user123';
      
      // Exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        securityFramework.checkRateLimit(identifier, 5, 60000);
      }
      
      // This should be blocked
      const result = securityFramework.checkRateLimit(identifier, 5, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset rate limit after window expires', () => {
      const identifier = 'user123';
      
      // Mock time progression
      jest.useFakeTimers();
      const now = Date.now();
      
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        securityFramework.checkRateLimit(identifier, 5, 60000);
      }
      
      // Advance time past window
      jest.setSystemTime(now + 61000);
      
      // Should be allowed again
      const result = securityFramework.checkRateLimit(identifier, 5, 60000);
      expect(result.allowed).toBe(true);
      
      jest.useRealTimers();
    });
  });

  describe('🔍 A01:2021 - Access Control', () => {
    it('should validate user permissions correctly', () => {
      // Mock user roles
      const getUserRoles = jest.spyOn(securityFramework as any, 'getUserRoles');
      const getRolePermissions = jest.spyOn(securityFramework as any, 'getRolePermissions');
      
      getUserRoles.mockReturnValue(['user']);
      getRolePermissions.mockReturnValue(['workouts:read', 'workouts:create']);
      
      expect(securityFramework.validatePermissions('user123', 'workouts', 'read')).toBe(true);
      expect(securityFramework.validatePermissions('user123', 'workouts', 'create')).toBe(true);
      expect(securityFramework.validatePermissions('user123', 'admin', 'delete')).toBe(false);
      
      getUserRoles.mockRestore();
      getRolePermissions.mockRestore();
    });

    it('should handle admin permissions', () => {
      const getUserRoles = jest.spyOn(securityFramework as any, 'getUserRoles');
      const getRolePermissions = jest.spyOn(securityFramework as any, 'getRolePermissions');
      
      getUserRoles.mockReturnValue(['admin']);
      getRolePermissions.mockReturnValue(['*:*']);
      
      expect(securityFramework.validatePermissions('admin123', 'users', 'delete')).toBe(true);
      expect(securityFramework.validatePermissions('admin123', 'system', 'configure')).toBe(true);
      
      getUserRoles.mockRestore();
      getRolePermissions.mockRestore();
    });
  });

  describe('🔄 Performance & Memory Security', () => {
    it('should handle large data without memory leaks', () => {
      const largeData = 'x'.repeat(1000000); // 1MB string
      
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        const sanitized = securityFramework.sanitizeInput(largeData.slice(0, 1000));
        expect(sanitized.length).toBeLessThanOrEqual(1000);
      }
      
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = endMemory - startMemory;
      
      // Should not leak significant memory (allowing for some overhead)
      expect(memoryIncrease).toBeLessThan(5000000); // 5MB threshold
    });

    it('should perform security operations efficiently', async () => {
      const startTime = performance.now();
      
      // Perform multiple security operations
      const operations = Array.from({ length: 100 }, (_, i) => {
        const data = `test-data-${i}`;
        const sanitized = securityFramework.sanitizeInput(data);
        const token = securityFramework.generateSecureToken(16);
        const rateLimit = securityFramework.checkRateLimit(`user${i}`, 10, 60000);
        
        return { sanitized, token, rateLimit };
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 100 operations in reasonable time
      expect(duration).toBeLessThan(1000); // 1 second
      expect(operations).toHaveLength(100);
    });
  });

  describe('🚨 Edge Cases & Error Handling', () => {
    it('should handle null and undefined inputs safely', () => {
      expect(() => securityFramework.sanitizeInput(null as any)).not.toThrow();
      expect(() => securityFramework.sanitizeInput(undefined as any)).not.toThrow();
      
      const result = securityFramework.validateDataIntegrity(null, UserProfileSchema);
      expect(result.isValid).toBe(false);
    });

    it('should handle malformed encryption attempts', () => {
      expect(() => {
        securityFramework.decryptSensitiveData('not-valid-base64!@#');
      }).toThrow();
    });

    it('should recover from storage errors', () => {
      // Mock localStorage to throw error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => { throw new Error('Storage full'); });
      
      const criticalEvent: SecurityEvent = {
        type: 'suspicious_activity',
        severity: 'critical',
        details: {}
      };
      
      // Should not crash when storage fails
      expect(() => {
        securityFramework.logSecurityEvent(criticalEvent);
      }).not.toThrow();
      
      setItemSpy.mockRestore();
    });
  });
});