# Video Vault - UI/UX Design System

## 🎨 Visual Identity

### Design Philosophy
- **Zero Friction**: Every interaction should be instant and intuitive
- **Depth & Dimension**: Circuit board aesthetic with glowing elements
- **Smooth Motion**: All transitions use easing for premium feel
- **Information Dense**: Maximum utility without clutter

---

## 🌈 Color Palette

### Primary Colors (Electric Blue)
```
primary-50:  #f0f9ff  (Lightest - hover backgrounds)
primary-100: #e0f2fe  (Very light)
primary-200: #bae6fd  (Light)
primary-300: #7dd3fc  (Medium light)
primary-400: #38bdf8  (Medium - hover states)
primary-500: #0ea5e9  (Base - primary actions)
primary-600: #0284c7  (Medium dark - active states)
primary-700: #0369a1  (Dark)
primary-800: #075985  (Darker)
primary-900: #0c4a6e  (Darkest)
```

### Dark Theme (Slate)
```
dark-800: #1e293b  (Secondary backgrounds)
dark-900: #0f172a  (Primary backgrounds)
dark-950: #020617  (Deepest backgrounds)
```

### Circuit Board Palette
```
circuit-bg:   #0a0e1a  (Main canvas background)
circuit-line: #1a2332  (Circuit trace lines)
circuit-node: #2563eb  (Connection nodes - blue)
circuit-glow: #60a5fa  (Lightning glow effect)
```

### Semantic Colors
```
Success:  #10b981  (Green - completed states)
Warning:  #f59e0b  (Amber - in-progress)
Error:    #ef4444  (Red - errors/delete)
Info:     #3b82f6  (Blue - informational)
```

---

## 📝 Typography

### Font Families
```
Sans-serif: 'Inter', system-ui, sans-serif
  - Used for: UI text, headings, body copy
  - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

Monospace: 'JetBrains Mono', monospace
  - Used for: URLs, timestamps, code snippets
  - Weights: 400 (regular), 500 (medium)
```

### Type Scale
```
text-xs:   12px / 16px  (Tags, captions)
text-sm:   14px / 20px  (Secondary text, metadata)
text-base: 16px / 24px  (Body text, inputs)
text-lg:   18px / 28px  (Card titles)
text-xl:   20px / 28px  (Section headers)
text-2xl:  24px / 32px  (Page titles)
text-3xl:  30px / 36px  (Hero text)
text-4xl:  36px / 40px  (Onboarding headers)
```

### Font Weights
```
font-normal:   400  (Body text)
font-medium:   500  (Emphasized text)
font-semibold: 600  (Buttons, labels)
font-bold:     700  (Headers)
```

---

## 📏 Spacing System

### Base Unit: 4px

```
spacing-0:   0px
spacing-1:   4px    (Micro spacing)
spacing-2:   8px    (Tight spacing)
spacing-3:   12px   (Compact spacing)
spacing-4:   16px   (Default spacing)
spacing-5:   20px
spacing-6:   24px   (Section spacing)
spacing-8:   32px   (Large spacing)
spacing-10:  40px
spacing-12:  48px   (Extra large)
spacing-16:  64px   (Huge spacing)
spacing-20:  80px
spacing-24:  96px   (Massive spacing)
```

### Component-Specific Spacing
```
Card Padding:     20px (spacing-5)
Button Padding:   12px 24px (spacing-3 spacing-6)
Input Padding:    12px 16px (spacing-3 spacing-4)
Modal Padding:    32px (spacing-8)
Section Margins:  48px (spacing-12)
```

---

## 🔲 Layout Grid

### Desktop (1280px+)
```
Left Rail:     280px fixed
Main Content:  flex-1 (fluid)
Right Drawer:  400px fixed (slides in)
Top Nav:       64px height
```

### Tablet (768px - 1279px)
```
Left Rail:     240px fixed (collapsible)
Main Content:  flex-1 (fluid)
Right Drawer:  320px fixed (overlay)
Top Nav:       56px height
```

### Mobile (< 768px)
```
Left Rail:     Full-width drawer (overlay)
Main Content:  Full-width
Right Drawer:  Full-width drawer (overlay)
Top Nav:       56px height
```

### Grid System
```
Video Grid:
  - Desktop:  4 columns (gap: 24px)
  - Tablet:   3 columns (gap: 20px)
  - Mobile:   1-2 columns (gap: 16px)

Container Max-Width: 1920px
Container Padding:   24px (desktop), 16px (mobile)
```

---

## 🎭 Circuit Board Background

### Base Structure
```css
background: radial-gradient(
  circle at 20% 30%,
  rgba(37, 99, 235, 0.03) 0%,
  transparent 50%
),
radial-gradient(
  circle at 80% 70%,
  rgba(37, 99, 235, 0.03) 0%,
  transparent 50%
),
#0a0e1a;
```

### Circuit Lines (SVG Pattern)
```
Pattern Type:    SVG path network
Line Color:      #1a2332 (circuit-line)
Line Width:      1px
Opacity:         0.6
Pattern Repeat:  200px x 200px
```

### Connection Nodes
```
Size:        6px circles
Color:       #2563eb (circuit-node)
Glow:        0 0 8px rgba(37, 99, 235, 0.6)
Distribution: Every 100px along lines
Opacity:     0.8
```

### Lightning Animation
```
Duration:     3s
Easing:       ease-in-out
Loop:         Infinite
Effect:       Glowing path that travels along circuit lines
Color:        #60a5fa (circuit-glow)
Glow Radius:  20px
Opacity:      0.3 → 1 → 0.3
Blur:         0px → 2px → 0px
Path:         Random circuit line segments
Delay:        Stagger by 0.5s for multiple bolts
```

#### Lightning Path Segments
```
Segment 1: Top-left to center (0s delay)
Segment 2: Center to bottom-right (0.5s delay)
Segment 3: Top-right to bottom-left (1s delay)
Segment 4: Random horizontal (1.5s delay)
```

---

## 🧩 Component Specifications

### 1. Top Navigation (64px height)
```
Background:     rgba(15, 23, 42, 0.8) (dark-900 + opacity)
Backdrop Blur:  blur(12px)
Border Bottom:  1px solid rgba(255, 255, 255, 0.05)
Shadow:         0 1px 3px rgba(0, 0, 0, 0.3)
Position:       Fixed top
Z-index:        50

Elements:
  - Logo/Title (left): text-xl font-bold
  - Search Bar (center): 400px width, glass morphism
  - View Toggle (right): Grid/List icons
  - Add Video Button (right): Primary button
```

### 2. Left Rail (280px width)
```
Background:     rgba(15, 23, 42, 0.6)
Backdrop Blur:  blur(8px)
Border Right:   1px solid rgba(255, 255, 255, 0.05)
Padding:        24px 16px

Sections:
  1. All Videos (count badge)
  2. Watch Status (Unwatched, Watching, Completed)
  3. Categories (scrollable list, add new)
  4. Tags (pill layout)

Each Item:
  - Height: 40px
  - Padding: 8px 12px
  - Hover: bg-white/5
  - Active: bg-primary-500/20 + left border (2px primary-500)
  - Transition: all 0.15s ease
```

### 3. Video Card (Grid View)
```
Dimensions:
  - Desktop: 320px width (auto height)
  - Aspect:  16:9 thumbnail

Structure:
  ┌─────────────────────────┐
  │   Thumbnail (16:9)      │ ← Hover: scale(1.02)
  │   + Play Overlay        │
  ├─────────────────────────┤
  │ Title (2 lines max)     │
  │ Category Badge          │
  │ Duration • Date         │
  │ Watch Status Icon       │
  └─────────────────────────┘

Background:     rgba(30, 41, 59, 0.4)
Border:         1px solid rgba(255, 255, 255, 0.05)
Border Radius:  12px
Padding:        0 (thumbnail), 16px (content)
Hover:
  - Border: 1px solid primary-500/50
  - Shadow: glow-md
  - Transform: translateY(-2px)
Transition:     all 0.2s ease-out
```

### 4. Video List Item
```
Height:         80px
Background:     rgba(30, 41, 59, 0.3)
Border:         1px solid rgba(255, 255, 255, 0.05)
Border Radius:  8px
Padding:        12px 16px
Margin:         8px 0

Layout: [Thumbnail 120x68] [Title + Meta] [Status] [Actions]

Hover:          bg-white/5
Active:         border-primary-500/50
```

### 5. Right Notes Drawer (400px width)
```
Background:     rgba(15, 23, 42, 0.95)
Backdrop Blur:  blur(16px)
Border Left:    1px solid rgba(255, 255, 255, 0.1)
Shadow:         -4px 0 24px rgba(0, 0, 0, 0.3)
Position:       Fixed right
Animation:      slide-in (0.3s ease-out)

Header:
  - Title + Close button
  - Height: 64px
  - Border bottom: 1px solid white/10

Content:
  - Video title
  - Thumbnail (small)
  - Notes editor (rich text)
  - Tags input
  - Category dropdown
  - Watch status toggle
  - Save button (auto-save after 2s)
```

### 6. Search Bar
```
Width:          400px (desktop), 100% (mobile)
Height:         40px
Background:     rgba(255, 255, 255, 0.05)
Border:         1px solid rgba(255, 255, 255, 0.1)
Border Radius:  20px
Padding:        0 16px 0 44px (space for icon)
Backdrop Blur:  blur(8px)

Icon:           Search (lucide) - 20px, left-positioned
Placeholder:    "Search videos, notes, categories..."
Text Color:     white
Font Size:      14px

Focus State:
  - Border: 1px solid primary-500
  - Background: rgba(255, 255, 255, 0.08)
  - Shadow: glow-sm
  - Transition: all 0.2s ease

Dropdown Results:
  - Position: absolute, top: 48px
  - Max height: 400px
  - Scroll: auto
  - Background: dark-900
  - Border: 1px solid primary-500/30
  - Shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
```

### 7. Buttons

#### Primary Button
```
Background:     primary-500 (gradient: primary-500 → primary-600)
Color:          white
Padding:        12px 24px
Border Radius:  8px
Font:           14px, font-semibold
Shadow:         0 2px 8px rgba(14, 165, 233, 0.3)

Hover:
  - Background: primary-600
  - Shadow: glow-md
  - Transform: translateY(-1px)

Active:
  - Background: primary-700
  - Transform: translateY(0)

Disabled:
  - Opacity: 0.5
  - Cursor: not-allowed
```

#### Secondary Button
```
Background:     rgba(255, 255, 255, 0.05)
Border:         1px solid rgba(255, 255, 255, 0.1)
Color:          white
Padding:        12px 24px
Border Radius:  8px

Hover:          bg-white/10
```

#### Icon Button
```
Size:           40px x 40px
Border Radius:  8px
Background:     transparent
Icon Size:      20px
Color:          white/70

Hover:
  - Background: white/5
  - Color: white
```

### 8. Input Fields
```
Height:         44px
Background:     rgba(255, 255, 255, 0.05)
Border:         1px solid rgba(255, 255, 255, 0.1)
Border Radius:  8px
Padding:        0 16px
Font:           14px
Color:          white

Focus:
  - Border: primary-500
  - Background: rgba(255, 255, 255, 0.08)
  - Shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)

Label:
  - Font: 12px, font-medium
  - Color: white/70
  - Margin bottom: 8px
```

### 9. Modal (Onboarding)
```
Backdrop:       rgba(0, 0, 0, 0.8)
Backdrop Blur:  blur(4px)
Animation:      fade-in (0.2s)

Modal Container:
  - Width: 600px (desktop), 90% (mobile)
  - Background: dark-900
  - Border: 1px solid primary-500/30
  - Border Radius: 16px
  - Shadow: 0 20px 60px rgba(0, 0, 0, 0.5), glow-lg
  - Padding: 40px
  - Animation: scale-in (0.2s)

Header:
  - Title: text-3xl, font-bold
  - Subtitle: text-base, text-white/60
  - Margin bottom: 32px

Content:
  - Illustration/Icon: 120px (centered)
  - Description: text-base, line-height: 1.6
  - Step indicators: 3 dots (active = primary-500, inactive = white/20)

Footer:
  - Buttons: "Skip" (secondary) + "Next/Get Started" (primary)
  - Layout: space-between
  - Margin top: 32px
```

### 10. Tags/Pills
```
Height:         28px
Padding:        4px 12px
Background:     primary-500/20
Border:         1px solid primary-500/40
Border Radius:  14px (full rounded)
Font:           12px, font-medium
Color:          primary-300

Hover:
  - Background: primary-500/30
  - Border: primary-500/60

With Remove (×):
  - Add icon button on right
  - Icon size: 14px
  - Hover: color red-400
```

### 11. Badge (Count)
```
Size:           20px height
Padding:        2px 8px
Background:     primary-500
Border Radius:  10px
Font:           11px, font-semibold
Color:          white
Position:       inline or absolute top-right
```

### 12. Dropdown Menu
```
Background:     dark-800
Border:         1px solid white/10
Border Radius:  8px
Shadow:         0 4px 16px rgba(0, 0, 0, 0.3)
Padding:        4px
Min Width:      200px

Item:
  - Height: 36px
  - Padding: 8px 12px
  - Border Radius: 4px
  - Hover: bg-white/5
  - Active: bg-primary-500/20
  - Icon + Text layout
  - Font: 14px
```

### 13. Thumbnail Container
```
Aspect Ratio:   16:9
Border Radius:  8px (card), 6px (list)
Overflow:       hidden
Position:       relative
Background:     dark-800 (loading state)

Placeholder:
  - Gradient: dark-700 → dark-800
  - Icon: Video (lucide), centered, 48px
  - Opacity: 0.3

Image:
  - object-fit: cover
  - width: 100%
  - height: 100%

Overlay (hover):
  - Background: rgba(0, 0, 0, 0.6)
  - Play icon: 64px, white, centered
  - Opacity: 0 → 1
  - Transition: 0.2s ease
```

### 14. Watch Status Indicator
```
Unwatched:
  - Icon: Circle
  - Color: white/40
  - Size: 20px

Watching:
  - Icon: PlayCircle (half-filled)
  - Color: warning (amber)
  - Size: 20px
  - Optional: Progress ring (%)

Completed:
  - Icon: CheckCircle
  - Color: success (green)
  - Size: 20px
```

---

## ✨ Microinteractions

### Hover States
```
Cards:          scale(1.02), shadow glow, border color change (200ms ease-out)
Buttons:        brightness(1.1), translateY(-1px) (150ms ease)
Icons:          color change, scale(1.1) (150ms ease)
Thumbnails:     scale(1.05), overlay fade-in (200ms ease-out)
```

### Click/Active States
```
Buttons:        scale(0.98), shadow reduction (100ms ease)
Cards:          scale(0.99) (100ms ease)
Toggles:        slide animation (200ms ease-in-out)
```

### Loading States
```
Skeletons:      Shimmer gradient animation (1.5s infinite)
Spinners:       Rotate 360deg (1s linear infinite)
Progress:       Indeterminate bar animation (1.2s ease-in-out infinite)
```

### Transitions
```
Page changes:   fade-in (300ms ease-out)
Drawer open:    slide-in (300ms ease-out)
Drawer close:   slide-out (300ms ease-in)
Modal open:     scale-in + fade-in (200ms ease-out)
Modal close:    scale-out + fade-out (150ms ease-in)
List reorder:   position change (250ms ease-in-out)
```

### Focus States
```
Keyboard Nav:
  - Outline: 2px solid primary-500
  - Offset: 2px
  - Border radius: matches element
  - No outline on mouse click (use :focus-visible)
```

### Success Feedback
```
Video Added:    Toast notification (bottom-right, 3s duration)
                Green checkmark icon + "Video saved!"
                Slide-in animation

Video Deleted:  Fade-out item (200ms)
                Slide up remaining items (250ms)
                Toast: "Video removed" with Undo option (5s)

Save Action:    Button text: "Save" → "Saving..." → "Saved ✓"
                Icon pulse animation
                Auto-reset after 2s
```

---

## 📱 Responsive Breakpoints

```
Mobile:      < 640px
Tablet:      640px - 1024px
Desktop:     1024px - 1536px
Wide:        > 1536px
```

### Mobile Adaptations
```
- Hamburger menu for left rail
- Bottom sheet for notes drawer
- Single column grid
- Larger touch targets (min 44x44px)
- Simplified card layouts
- Sticky search bar
- Collapsible filters
```

---

## ♿ Accessibility

### ARIA Labels
```
All interactive elements must have aria-labels
Icon buttons: descriptive labels (e.g., "Add new video")
Modal: aria-modal="true", role="dialog"
Search: role="search", aria-label="Search videos"
```

### Keyboard Navigation
```
Tab order:      Logical flow (top-nav → left-rail → content → drawer)
Escape:         Close modals/drawers
Enter:          Activate buttons/links
Arrow keys:     Navigate lists/grids
/ (slash):      Focus search
```

### Color Contrast
```
Text on dark bg:    Minimum 4.5:1 ratio
Large text:         Minimum 3:1 ratio
Interactive elements: Clear visual focus indicators
```

---

## 🚀 Performance Guidelines

### Asset Optimization
```
Thumbnails:     WebP format, lazy loading, 640x360 max
Icons:          SVG (inline for < 2KB, external for larger)
Fonts:          Subset, preload critical fonts
Images:         Next.js Image component, blur placeholder
```

### Animation Performance
```
Use transform and opacity only (GPU-accelerated)
Avoid animating: width, height, top, left
Use will-change sparingly
Debounce search input (300ms)
Throttle scroll handlers (16ms)
```

### Code Splitting
```
Route-based splitting (automatic with Next.js)
Dynamic imports for modals
Lazy load video metadata extraction
Defer non-critical scripts
```

---

## 📐 Figma-Style Frame Sizes

### Desktop Artboard: 1440 x 900px
```
Top Nav:         1440 x 64
Left Rail:       280 x 836
Main Content:    1160 x 836 (fluid)
Right Drawer:    400 x 836 (slide-in)
Video Card:      320 x 280 (approx)
```

### Mobile Artboard: 375 x 812px
```
Top Nav:         375 x 56
Main Content:    375 x 756 (full-width)
Video Card:      343 x 260 (with 16px margins)
Bottom Drawer:   375 x 600 (slide-up)
```

---

## 🎬 Onboarding Flow (3 Steps)

### Step 1: Welcome
```
Icon:       Sparkles (120px, primary-500)
Title:      "Welcome to Video Vault"
Text:       "Your personal video library, organized beautifully."
Visual:     Animated circuit board background preview
Button:     "Let's Start" (primary)
```

### Step 2: Quick Add
```
Icon:       Plus in circle (120px, primary-500)
Title:      "Save Videos Instantly"
Text:       "Paste any video URL and we'll grab the details for you."
Visual:     Animated demo of URL input → Card creation
Button:     "Got It" (primary)
```

### Step 3: Organize
```
Icon:       Folders (120px, primary-500)
Title:      "Stay Organized"
Text:       "Use categories, tags, and notes to find anything in seconds."
Visual:     Animated filter interaction
Button:     "Start Using Video Vault" (primary)
```

---

This design system ensures every pixel and interaction is intentional, creating a premium, zero-friction experience for power users who live in their video vault.
