#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')
const gzipSize = require('gzip-size')
const brotliSize = require('brotli-size')

class BuildOptimizer {
  constructor(options = {}) {
    this.options = {
      bundler: 'vite', // 'vite' or 'webpack'
      analyze: false,
      profile: false,
      legacy: false,
      federation: false,
      compression: true,
      sourceMaps: true,
      ...options,
    }
    
    this.distPath = path.resolve(process.cwd(), 'dist')
    this.statsPath = path.resolve(this.distPath, 'build-stats.json')
  }

  async build() {
    console.log(chalk.blue('🚀 Starting optimized build process...\n'))
    
    const startTime = Date.now()
    
    try {
      // Pre-build cleanup
      await this.cleanup()
      
      // Run type checking
      await this.typeCheck()
      
      // Run the build
      await this.runBuild()
      
      // Analyze bundle
      await this.analyzeBuild()
      
      // Generate compression artifacts
      if (this.options.compression) {
        await this.generateCompression()
      }
      
      // Generate build report
      await this.generateReport()
      
      const duration = Date.now() - startTime
      console.log(chalk.green(`✅ Build completed successfully in ${duration}ms\n`))
      
    } catch (error) {
      console.error(chalk.red('❌ Build failed:'), error.message)
      process.exit(1)
    }
  }

  async cleanup() {
    console.log(chalk.yellow('🧹 Cleaning up previous build...'))
    
    if (fs.existsSync(this.distPath)) {
      fs.rmSync(this.distPath, { recursive: true, force: true })
    }
    
    console.log(chalk.green('✅ Cleanup completed\n'))
  }

  async typeCheck() {
    console.log(chalk.yellow('🔍 Running TypeScript type checking...'))
    
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' })
      console.log(chalk.green('✅ Type checking passed\n'))
    } catch (error) {
      throw new Error('TypeScript type checking failed')
    }
  }

  async runBuild() {
    console.log(chalk.yellow(`📦 Building with ${this.options.bundler}...`))
    
    const env = {
      NODE_ENV: 'production',
      ANALYZE: this.options.analyze ? 'true' : 'false',
      MODULE_FEDERATION: this.options.federation ? 'true' : 'false',
      LEGACY_BUILD: this.options.legacy ? 'true' : 'false',
    }
    
    const envString = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ')
    
    try {
      if (this.options.bundler === 'vite') {
        execSync(`${envString} npx vite build --config vite.config.ts`, { 
          stdio: 'inherit',
          env: { ...process.env, ...env }
        })
      } else {
        execSync(`${envString} npx webpack --mode production --config webpack.config.ts`, { 
          stdio: 'inherit',
          env: { ...process.env, ...env }
        })
      }
      
      console.log(chalk.green('✅ Build completed\n'))
    } catch (error) {
      throw new Error('Build process failed')
    }
  }

  async analyzeBuild() {
    console.log(chalk.yellow('📊 Analyzing build output...'))
    
    const stats = {
      timestamp: new Date().toISOString(),
      bundler: this.options.bundler,
      files: [],
      totalSize: 0,
      totalGzipSize: 0,
      totalBrotliSize: 0,
    }
    
    if (!fs.existsSync(this.distPath)) {
      throw new Error('Build output directory not found')
    }
    
    // Analyze all files in dist
    const files = this.getFileList(this.distPath)
    
    for (const file of files) {
      const filePath = path.join(this.distPath, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isFile()) {
        const content = fs.readFileSync(filePath)
        const size = stat.size
        const gzip = gzipSize.sync(content)
        const brotli = brotliSize.sync(content)
        
        stats.files.push({
          name: file,
          size,
          gzipSize: gzip,
          brotliSize: brotli,
          type: this.getFileType(file),
        })
        
        stats.totalSize += size
        stats.totalGzipSize += gzip
        stats.totalBrotliSize += brotli
      }
    }
    
    // Save stats
    fs.writeFileSync(this.statsPath, JSON.stringify(stats, null, 2))
    
    // Display summary
    this.displayBuildSummary(stats)
    
    console.log(chalk.green('✅ Build analysis completed\n'))
  }

  async generateCompression() {
    console.log(chalk.yellow('🗜️  Generating compression artifacts...'))
    
    const files = this.getFileList(this.distPath, ['.js', '.css', '.html', '.svg'])
    
    for (const file of files) {
      const filePath = path.join(this.distPath, file)
      const content = fs.readFileSync(filePath)
      
      // Generate gzip
      const gzipContent = require('zlib').gzipSync(content, { level: 9 })
      fs.writeFileSync(`${filePath}.gz`, gzipContent)
      
      // Generate brotli
      const brotliContent = require('zlib').brotliCompressSync(content, {
        params: {
          [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
        },
      })
      fs.writeFileSync(`${filePath}.br`, brotliContent)
    }
    
    console.log(chalk.green('✅ Compression artifacts generated\n'))
  }

  async generateReport() {
    console.log(chalk.yellow('📋 Generating build report...'))
    
    const stats = JSON.parse(fs.readFileSync(this.statsPath, 'utf8'))
    
    const report = this.generateHtmlReport(stats)
    const reportPath = path.join(this.distPath, 'build-report.html')
    
    fs.writeFileSync(reportPath, report)
    
    // Generate JSON report for CI
    const jsonReport = {
      success: true,
      timestamp: stats.timestamp,
      bundler: stats.bundler,
      summary: {
        totalFiles: stats.files.length,
        totalSize: this.formatBytes(stats.totalSize),
        totalGzipSize: this.formatBytes(stats.totalGzipSize),
        totalBrotliSize: this.formatBytes(stats.totalBrotliSize),
        compressionRatio: {
          gzip: ((1 - stats.totalGzipSize / stats.totalSize) * 100).toFixed(1),
          brotli: ((1 - stats.totalBrotliSize / stats.totalSize) * 100).toFixed(1),
        },
      },
      files: stats.files.map(file => ({
        name: file.name,
        type: file.type,
        size: this.formatBytes(file.size),
        gzipSize: this.formatBytes(file.gzipSize),
        brotliSize: this.formatBytes(file.brotliSize),
      })),
    }
    
    fs.writeFileSync(
      path.join(this.distPath, 'build-report.json'),
      JSON.stringify(jsonReport, null, 2)
    )
    
    console.log(chalk.green('✅ Build report generated\n'))
    console.log(chalk.blue(`📄 Report available at: ${reportPath}`))
  }

  getFileList(dir, extensions = null, prefix = '') {
    const files = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const itemPath = path.join(dir, item)
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getFileList(itemPath, extensions, path.join(prefix, item)))
      } else {
        const fileName = path.join(prefix, item)
        if (!extensions || extensions.some(ext => fileName.endsWith(ext))) {
          files.push(fileName)
        }
      }
    }
    
    return files
  }

  getFileType(fileName) {
    const ext = path.extname(fileName).toLowerCase()
    
    if (['.js', '.mjs', '.jsx', '.ts', '.tsx'].includes(ext)) return 'javascript'
    if (['.css', '.scss', '.sass', '.less'].includes(ext)) return 'stylesheet'
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(ext)) return 'image'
    if (['.woff', '.woff2', '.ttf', '.eot', '.otf'].includes(ext)) return 'font'
    if (['.html', '.htm'].includes(ext)) return 'html'
    if (['.json'].includes(ext)) return 'data'
    if (['.md', '.txt'].includes(ext)) return 'text'
    
    return 'other'
  }

  displayBuildSummary(stats) {
    console.log(chalk.blue('\n📊 Build Summary:'))
    console.log(chalk.blue('================'))
    
    console.log(`Total files: ${chalk.yellow(stats.files.length)}`)
    console.log(`Total size: ${chalk.yellow(this.formatBytes(stats.totalSize))}`)
    console.log(`Gzipped: ${chalk.green(this.formatBytes(stats.totalGzipSize))} (${chalk.green(((1 - stats.totalGzipSize / stats.totalSize) * 100).toFixed(1) + '%')} reduction)`)
    console.log(`Brotli: ${chalk.green(this.formatBytes(stats.totalBrotliSize))} (${chalk.green(((1 - stats.totalBrotliSize / stats.totalSize) * 100).toFixed(1) + '%')} reduction)`)
    
    // Group by file type
    const byType = {}
    stats.files.forEach(file => {
      if (!byType[file.type]) {
        byType[file.type] = { count: 0, size: 0, gzipSize: 0 }
      }
      byType[file.type].count++
      byType[file.type].size += file.size
      byType[file.type].gzipSize += file.gzipSize
    })
    
    console.log('\n📁 By file type:')
    Object.entries(byType).forEach(([type, data]) => {
      console.log(`  ${type}: ${data.count} files, ${this.formatBytes(data.size)} (${this.formatBytes(data.gzipSize)} gzipped)`)
    })
    
    // Show largest files
    const largestFiles = stats.files
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
    
    console.log('\n📦 Largest files:')
    largestFiles.forEach(file => {
      console.log(`  ${file.name}: ${this.formatBytes(file.size)} (${this.formatBytes(file.gzipSize)} gzipped)`)
    })
  }

  generateHtmlReport(stats) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCQ Platform Build Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0ea5e9; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8fafc; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #0ea5e9; }
        .metric-label { color: #64748b; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; }
        .chart-container { width: 100%; height: 400px; margin: 30px 0; }
        .file-type { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .javascript { background: #fef3c7; color: #92400e; }
        .stylesheet { background: #dbeafe; color: #1e40af; }
        .image { background: #dcfce7; color: #166534; }
        .font { background: #fce7f3; color: #be185d; }
        .html { background: #fed7d7; color: #c53030; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 NCQ Platform Build Report</h1>
        <p><strong>Build Date:</strong> ${new Date(stats.timestamp).toLocaleString()}</p>
        <p><strong>Bundler:</strong> ${stats.bundler}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${stats.files.length}</div>
                <div class="metric-label">Total Files</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.formatBytes(stats.totalSize)}</div>
                <div class="metric-label">Total Size</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.formatBytes(stats.totalGzipSize)}</div>
                <div class="metric-label">Gzipped Size</div>
            </div>
            <div class="metric">
                <div class="metric-value">${((1 - stats.totalGzipSize / stats.totalSize) * 100).toFixed(1)}%</div>
                <div class="metric-label">Compression Ratio</div>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="sizeChart"></canvas>
        </div>
        
        <h2>📁 File Details</h2>
        <table>
            <thead>
                <tr>
                    <th>File</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Gzipped</th>
                    <th>Brotli</th>
                    <th>Compression</th>
                </tr>
            </thead>
            <tbody>
                ${stats.files.map(file => `
                    <tr>
                        <td>${file.name}</td>
                        <td><span class="file-type ${file.type}">${file.type}</span></td>
                        <td>${this.formatBytes(file.size)}</td>
                        <td>${this.formatBytes(file.gzipSize)}</td>
                        <td>${this.formatBytes(file.brotliSize)}</td>
                        <td>${((1 - file.gzipSize / file.size) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <script>
        const ctx = document.getElementById('sizeChart').getContext('2d');
        const byType = ${JSON.stringify(this.groupByType(stats.files))};
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(byType),
                datasets: [{
                    data: Object.values(byType).map(t => t.size),
                    backgroundColor: [
                        '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#fed7d7', '#e0e7ff'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bundle Size by File Type'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    </script>
</body>
</html>
    `
  }

  groupByType(files) {
    const byType = {}
    files.forEach(file => {
      if (!byType[file.type]) {
        byType[file.type] = { count: 0, size: 0 }
      }
      byType[file.type].count++
      byType[file.type].size += file.size
    })
    return byType
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2)
  const options = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--bundler' && args[i + 1]) {
      options.bundler = args[++i]
    } else if (arg === '--analyze') {
      options.analyze = true
    } else if (arg === '--profile') {
      options.profile = true
    } else if (arg === '--legacy') {
      options.legacy = true
    } else if (arg === '--federation') {
      options.federation = true
    } else if (arg === '--no-compression') {
      options.compression = false
    }
  }
  
  const optimizer = new BuildOptimizer(options)
  optimizer.build().catch(console.error)
}

module.exports = BuildOptimizer