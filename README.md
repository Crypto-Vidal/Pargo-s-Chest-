# 🎬 Video Vault

A stunning, zero-friction video library application built with Next.js 14, React, TypeScript, and Tailwind CSS.

![Video Vault](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Circuit Board Background**: Animated lightning effects with glowing nodes
- **Glass Morphism**: Modern frosted glass design throughout
- **Smooth Animations**: Framer Motion-powered transitions
- **Dark Theme**: Premium dark mode optimized for long sessions
- **Responsive**: Seamless experience from mobile to desktop

### 📹 Video Management
- **Quick Add**: Paste any video URL - auto-detects YouTube, Vimeo, and more
- **Smart Thumbnails**: Automatically fetches thumbnails from popular platforms
- **Rich Metadata**: Store notes, tags, categories, and watch status
- **Watch Tracking**: Mark videos as unwatched, watching, or completed

### 🔍 Powerful Organization
- **Instant Search**: Filter by title, notes, tags, or categories
- **Category System**: Create and manage custom categories
- **Tag Management**: Flexible tagging for advanced organization
- **Multiple Views**: Switch between grid and list layouts
- **Smart Filtering**: Filter by category or watch status

### 📝 Notes & Details
- **Slide-out Drawer**: Quick access to video details without leaving context
- **Rich Notes**: Add detailed notes for each video
- **Auto-save**: Changes save automatically after 2 seconds
- **Quick Actions**: Open, edit, or delete with minimal clicks

### 🚀 Performance
- **Local Storage**: All data persists in browser (no backend needed)
- **Instant Load**: No network delays, everything is local
- **Optimized Animations**: GPU-accelerated for 60fps
- **Code Splitting**: Fast initial load with Next.js automatic optimization

## 📸 Screenshots

### Dashboard (Grid View)
Beautiful grid layout with hover effects and status indicators.

### List View
Compact list view for power users who need density.

### Notes Drawer
Slide-out panel for editing video details without losing context.

### Onboarding
3-step welcome flow introducing key features.

## 🛠️ Tech Stack

### Core
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

### State & Animation
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon set

### Utilities
- **[date-fns](https://date-fns.org/)** - Date formatting
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generation
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classNames

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
video-vault/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tag.tsx
│   │   │   └── IconButton.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── TopNav.tsx
│   │   │   ├── LeftRail.tsx
│   │   │   └── NotesDrawer.tsx
│   │   ├── video/             # Video components
│   │   │   ├── VideoCard.tsx
│   │   │   └── VideoListItem.tsx
│   │   ├── modals/            # Modal components
│   │   │   ├── AddVideoModal.tsx
│   │   │   └── OnboardingModal.tsx
│   │   └── CircuitBackground.tsx
│   ├── store/
│   │   └── useStore.ts        # Zustand store
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                     # Static assets
├── DESIGN_SYSTEM.md           # Complete design documentation
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## 🎨 Design System

For detailed design specifications, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

### Key Design Elements

**Colors**
- Primary: Electric Blue (`#0ea5e9`)
- Background: Deep Navy (`#0a0e1a`)
- Accents: Glowing blue animations

**Typography**
- Sans: Inter (body, UI)
- Mono: JetBrains Mono (URLs, code)

**Spacing**
- Base unit: 4px
- Component padding: 16-24px
- Section margins: 48px

## 🎯 Usage Guide

### Adding a Video

1. Click **"Add Video"** button in top navigation
2. Paste any video URL (YouTube, Vimeo, etc.)
3. Optionally add a custom title
4. Click **"Add Video"**
   - Thumbnail auto-fetches for supported platforms
   - Video appears instantly in your library

### Organizing Videos

**Categories**
- Click **"+"** next to "Categories" in left rail
- Create custom categories (Tutorials, Music, etc.)
- Assign in the notes drawer

**Tags**
- Open video details in notes drawer
- Add tags for flexible organization
- Search includes tag matching

**Watch Status**
- Click status icon on video card
- Options: Unwatched, Watching, Completed
- Filter by status in left rail

### Searching

- Use search bar in top navigation
- Searches: titles, notes, tags, categories
- Results filter instantly as you type

### Grid vs List View

- Toggle in top-right corner
- **Grid**: Visual browsing with large thumbnails
- **List**: Compact view for scanning many videos

## 🔧 Customization

### Adding Custom Categories

Categories are created on-the-fly in the left rail. To add default categories, edit `src/store/useStore.ts`:

```typescript
categories: [
  { id: '1', name: 'Your Category', count: 0 },
  // Add more...
],
```

### Changing Theme Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Your primary color
    // ...
  },
}
```

### Modifying Animations

Animation speeds are in `tailwind.config.ts` under `keyframes` and `animation`.

## 🧪 Development

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Adding New Features

1. **Types**: Define in `src/types/index.ts`
2. **State**: Add to `src/store/useStore.ts`
3. **UI**: Create components in appropriate folder
4. **Styling**: Follow design system in `DESIGN_SYSTEM.md`

## 📦 Data Storage

Video Vault uses **browser local storage** via Zustand's persist middleware:
- All data stays in your browser
- No server or database needed
- Data persists across sessions
- Clear browser data = reset app

To export/backup:
1. Open browser DevTools
2. Go to Application → Local Storage
3. Find `video-vault-storage`
4. Copy the JSON value

To import:
1. Paste JSON into local storage
2. Refresh page

## 🚧 Roadmap

Future enhancements:
- [ ] Export/import to JSON file
- [ ] Video playlists
- [ ] Watch time tracking
- [ ] Cloud sync (optional)
- [ ] Browser extension for quick saves
- [ ] Keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Custom thumbnail uploads
- [ ] Video preview on hover
- [ ] Advanced search filters

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Write descriptive commit messages
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Design inspired by modern SaaS applications
- Icons by [Lucide](https://lucide.dev/)
- Fonts by Google Fonts

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Built with ❤️ using Next.js, React, and TypeScript**

Enjoy your Video Vault! 🎬✨
