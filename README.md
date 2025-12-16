# 🏴‍☠️ Pargo's Chest

A Progressive Web App (PWA) clipboard manager - your personal treasure chest for managing clipboard content across devices.

## ✨ Features

- 📱 **Mobile-First PWA** - Installable on any device
- 🔌 **Offline Support** - Works without internet connection
- 💾 **Local Storage** - All data stored securely in IndexedDB
- 👆 **Touch Gestures** - Swipe to open/close panels
- 🎨 **Dark/Light Themes** - Easy on the eyes
- 📋 **Clipboard API** - One-tap copy/paste
- 🔍 **Search & Filter** - Find your clips instantly
- ⭐ **Favorites** - Mark important clips
- 💾 **Export Data** - Backup your clips as JSON
- 📱 **Responsive** - Optimized for phones, tablets, and desktop

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Crypto-Vidal/Pargo-s-Chest-.git
cd Pargo-s-Chest-
```

2. Serve locally (any HTTP server):
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

3. Open in browser: `http://localhost:8000`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Crypto-Vidal/Pargo-s-Chest-)

Or manually:
```bash
npm install -g vercel
vercel
```

## 📱 Mobile Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## 🎯 Usage

### Adding Clips
- Type or paste content in the text area
- Click "Paste" to paste from clipboard (requires permission)
- Click "Add to Chest" to save

### Managing Clips
- **Copy**: Tap any clip card or click the Copy button
- **Search**: Use the search bar to filter clips
- **Favorite**: Click the heart icon to mark favorites
- **Delete**: Click the trash icon to remove clips

### Settings
- Swipe from the right edge or tap the menu icon
- Toggle dark/light mode
- Clear all clips
- Export data as JSON

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Storage**: IndexedDB with localStorage fallback
- **Styling**: CSS3 with CSS Variables
- **PWA**: Service Worker with offline-first caching
- **APIs**: Clipboard API, IndexedDB API

## 📂 Project Structure

```
pargos-chest/
├── index.html          # Main HTML file
├── app.js              # Application logic
├── styles.css          # Responsive styles
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
├── icons/              # PWA icons directory
│   └── README.md       # Icon requirements
└── README.md           # This file
```

## 🎨 Customization

### Adding Icons

Generate PWA icons and place them in the `icons/` directory:
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)

Use tools like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) for easy icon generation.

### Theming

Edit CSS variables in `styles.css`:
```css
:root {
  --accent-primary: #f39c12;  /* Primary color */
  --accent-secondary: #e67e22; /* Secondary color */
  /* ... more variables */
}
```

## 🔒 Privacy

- All data is stored locally on your device
- No analytics or tracking
- No data is sent to external servers
- Works completely offline

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

If you encounter any issues, please open an issue on GitHub.

---

Made with 🏴‍☠️ by the Pargo's Chest team
