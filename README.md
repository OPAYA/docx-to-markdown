# DOCX to Markdown Converter - Free Online Tool

🚀 **Live Demo:** [docx-to-markdown.vercel.app](https://docx-md-convertor-2wat4isdm-juntaes-projects-1e3504c3.vercel.app)

A powerful, privacy-focused web application that converts Microsoft Word (.docx) files to clean, Git-friendly Markdown format entirely in your browser. **No file uploads required** - all processing happens locally for maximum security and privacy.

## ✨ Key Features

- 🔒 **100% Client-Side Processing** - Your files never leave your browser
- 📄 **Support for Complex Documents** - Tables, images, headings, lists, and formatting
- 🖼️ **Automatic Image Extraction** - Extracts and organizes embedded images
- ⚙️ **Advanced Customization** - Image paths, heading levels, inline options
- 🎯 **Real-time Preview** - See your Markdown rendered instantly
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark/Light Theme** - Comfortable viewing in any environment
- 💾 **Multiple Export Options** - Copy, download MD, or get ZIP with images
- 🚀 **PWA Support** - Install and use offline

## Features

- **100% Client-Side**: No server uploads, complete privacy
- **Drag & Drop Interface**: Simple file handling
- **Image Extraction**: Automatically extracts and handles embedded images
- **Advanced Options**: Customizable image paths, heading depth, and more
- **Download Options**: Get Markdown file or ZIP with images
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Support**: Installable as a progressive web app

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. Open the application in your browser
2. Drag and drop a .docx file or click to select one
3. Configure advanced options if needed (image paths, heading depth)
4. Preview the converted Markdown
5. Download as .md file or .zip with images

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Conversion**: Mammoth.js (DOCX → HTML) + Turndown (HTML → Markdown)
- **File Handling**: JSZip + FileSaver.js
- **PWA**: Service Worker + Web App Manifest

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Privacy

This application processes all files locally in your browser. No data is sent to any servers, ensuring complete privacy for your documents.