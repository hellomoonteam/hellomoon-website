# Hellomoon Website

A modern, responsive website built with Jekyll and Gulp.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (use `nvm use 20` if you have nvm)
- Ruby (for Jekyll)
- Bundler

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   bundle install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Netlify (Recommended)

1. **Connect your repository:**
   - Push your code to GitHub/GitLab
   - Connect your repository to Netlify
   - Netlify will automatically detect the build settings

2. **Build settings (auto-detected):**
   - Build command: `npm run build`
   - Publish directory: `_site`
   - Node version: 20

3. **Environment variables:**
   - No additional environment variables needed

### Manual Deployment
1. Run `npm run build`
2. Upload the `_site` folder contents to your hosting provider

## 🛠 Build Process

The build system processes:
- **LESS → CSS** with autoprefixing and minification
- **JavaScript** bundling and minification
- **SVG** optimization and sprite generation
- **Jekyll** static site generation

## 📁 Project Structure

```
├── css/_less/          # LESS source files
├── js/_custom/         # Custom JavaScript
├── js/_lib/           # Third-party libraries
├── _svg_sprites/      # SVG source files
├── portfolio/         # Portfolio pages
├── images/            # Image assets
└── _site/            # Build output (generated)
```

## 🔧 Configuration

- `netlify.toml` - Netlify deployment settings
- `_config.yml` - Jekyll configuration
- `gulpfile.js` - Build system configuration

## 📝 Notes

- The site uses Jekyll 4.2 for static generation
- Gulp 4 handles asset processing and optimization
- BrowserSync provides live reload during development
- SVG sprites are automatically generated from source files
