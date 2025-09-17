import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Analyse de la taille des bundles
export class BundleAnalyzer {
  constructor() {
    this.distPath = path.join(__dirname, '../dist');
  }

  // Analyser les tailles des fichiers de build
  analyzeBuildSizes() {
    if (!fs.existsSync(this.distPath)) {
      console.log('❌ Dossier dist non trouvé. Exécutez npm run build d\'abord.');
      return;
    }

    console.log('📊 ANALYSE DES BUNDLES - MyFitHero\n');

    const files = this.getDistFiles();
    const analysis = this.calculateSizes(files);

    this.printAnalysis(analysis);
    this.checkPerformanceTargets(analysis);
  }

  getDistFiles() {
    const getAllFiles = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir);

      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      });

      return files;
    };

    return getAllFiles(this.distPath);
  }

  calculateSizes(files) {
    const analysis = {
      totalSize: 0,
      totalGzipSize: 0,
      jsFiles: [],
      cssFiles: [],
      assetFiles: [],
      htmlFiles: []
    };

    files.forEach(file => {
      const stat = fs.statSync(file);
      const relativePath = path.relative(this.distPath, file);
      const ext = path.extname(file);
      
      const fileInfo = {
        path: relativePath,
        size: stat.size,
        gzipSize: this.estimateGzipSize(stat.size)
      };

      analysis.totalSize += stat.size;
      analysis.totalGzipSize += fileInfo.gzipSize;

      if (ext === '.js') {
        analysis.jsFiles.push(fileInfo);
      } else if (ext === '.css') {
        analysis.cssFiles.push(fileInfo);
      } else if (ext === '.html') {
        analysis.htmlFiles.push(fileInfo);
      } else {
        analysis.assetFiles.push(fileInfo);
      }
    });

    return analysis;
  }

  estimateGzipSize(size) {
    return Math.round(size * 0.3);
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  printAnalysis(analysis) {
    console.log('📈 RÉSUMÉ DES TAILLES:');
    console.log(`   Total: ${this.formatSize(analysis.totalSize)} (gzip: ${this.formatSize(analysis.totalGzipSize)})\n`);

    if (analysis.jsFiles.length > 0) {
      console.log('🟨 FICHIERS JAVASCRIPT:');
      const sortedJs = analysis.jsFiles.sort((a, b) => b.size - a.size);
      sortedJs.forEach(file => {
        console.log(`   ${file.path}: ${this.formatSize(file.size)} (gzip: ${this.formatSize(file.gzipSize)})`);
      });
      console.log();
    }

    if (analysis.cssFiles.length > 0) {
      console.log('🟦 FICHIERS CSS:');
      analysis.cssFiles.forEach(file => {
        console.log(`   ${file.path}: ${this.formatSize(file.size)} (gzip: ${this.formatSize(file.gzipSize)})`);
      });
      console.log();
    }

    if (analysis.assetFiles.length > 0) {
      console.log('🟪 ASSETS:');
      const largeAssets = analysis.assetFiles.filter(file => file.size > 10240);
      if (largeAssets.length > 0) {
        largeAssets.forEach(file => {
          console.log(`   ${file.path}: ${this.formatSize(file.size)}`);
        });
      } else {
        console.log(`   ${analysis.assetFiles.length} petits fichiers assets`);
      }
      console.log();
    }
  }

  checkPerformanceTargets(analysis) {
    console.log('🎯 OBJECTIFS DE PERFORMANCE:');
    
    const totalMB = analysis.totalGzipSize / (1024 * 1024);
    const bundleStatus = totalMB < 1 ? '✅' : '❌';
    console.log(`   ${bundleStatus} Bundle size: ${totalMB.toFixed(2)}MB / 1.00MB (gzip)`);

    const mainJsFile = analysis.jsFiles.find(f => f.path.includes('index') && !f.path.includes('chunk'));
    if (mainJsFile) {
      const mainJsKB = mainJsFile.gzipSize / 1024;
      const mainJsStatus = mainJsKB < 500 ? '✅' : '❌';
      console.log(`   ${mainJsStatus} Main JS: ${mainJsKB.toFixed(2)}KB / 500KB (gzip)`);
    }

    console.log('\n💡 RECOMMANDATIONS:');
    
    if (totalMB >= 1) {
      console.log('   • Implémenter plus de code splitting');
      console.log('   • Lazy loading des features non-critiques');
      console.log('   • Tree shaking plus agressif');
    }

    if (analysis.jsFiles.length < 3) {
      console.log('   • Diviser les vendors en chunks séparés');
      console.log('   • Séparer les features en chunks distincts');
    }

    const largeAssets = analysis.assetFiles.filter(f => f.size > 100000);
    if (largeAssets.length > 0) {
      console.log('   • Optimiser les images > 100KB');
      console.log('   • Utiliser WebP et lazy loading');
    }

    console.log('\n🚀 Pour améliorer les performances:');
    console.log('   • npm run analyze - Analyse détaillée');
    console.log('   • npm run lighthouse - Test Lighthouse');
    console.log('   • npm run preview - Test local de production');
  }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyzeBuildSizes();
}

export default BundleAnalyzer;