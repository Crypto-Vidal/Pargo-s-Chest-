# ⚡ Lightning Circuit Animation

A high-performance, customizable animated background featuring circuit-board patterns with electric-blue traveling light effects. Built with vanilla JavaScript and Canvas API for optimal performance.

![Lightning Animation Preview](preview.gif)

## Features

- **Circuit Board Pattern**: Procedurally generated circuit paths with realistic breakpoints and nodes
- **Animated Particles**: Electric-blue light particles that travel seamlessly along circuit paths
- **High Performance**: Optimized Canvas rendering with requestAnimationFrame
- **Mobile Optimized**: Automatic performance adjustments for mobile devices
- **Accessibility**: Respects `prefers-reduced-motion` with static fallback
- **Low-Power Fallback**: Automatic detection and reduced rendering for battery conservation
- **Seamless Looping**: Particles loop infinitely without stuttering
- **Customizable**: Extensive configuration options for colors, density, speed, and more
- **Zero Dependencies**: Pure vanilla JavaScript, no external libraries required

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; overflow: hidden; }
        #lightning-canvas { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <canvas id="lightning-canvas"></canvas>
    <script type="module">
        import LightningAnimation from './lightning-animation.js';

        const canvas = document.getElementById('lightning-canvas');
        const animation = new LightningAnimation(canvas);
        animation.start();
    </script>
</body>
</html>
```

### Advanced Configuration

```javascript
import LightningAnimation from './lightning-animation.js';

const canvas = document.getElementById('lightning-canvas');
const animation = new LightningAnimation(canvas, {
    // Circuit density: 'low', 'medium', 'high'
    circuitDensity: 'medium',

    // Number of particles (or 'auto' for automatic)
    particleCount: 30,

    // Primary color (circuit lines and particles)
    color: '#00c8ff',

    // Background color
    backgroundColor: '#0a0e27',

    // Glow intensity (0-1)
    glowIntensity: 0.8,

    // Animation speed multiplier
    speed: 1.0,

    // Performance mode: 'auto', 'high', 'low', 'static'
    performanceMode: 'auto'
});

animation.start();
```

## API Reference

### Constructor

```javascript
new LightningAnimation(canvas, options)
```

**Parameters:**
- `canvas` (HTMLCanvasElement): The canvas element to render on
- `options` (Object): Configuration options (see Configuration section)

### Methods

#### `start()`
Starts the animation. Automatically uses static fallback if reduced motion is preferred.

```javascript
animation.start();
```

#### `pause()`
Pauses the animation without destroying it.

```javascript
animation.pause();
```

#### `resume()`
Resumes a paused animation.

```javascript
animation.resume();
```

#### `stop()`
Stops the animation and cancels animation frames.

```javascript
animation.stop();
```

#### `setPerformanceMode(mode)`
Changes the performance mode dynamically.

**Parameters:**
- `mode` (string): One of 'auto', 'high', 'low', 'static'

```javascript
animation.setPerformanceMode('low');
```

#### `destroy()`
Stops the animation and cleans up event listeners.

```javascript
animation.destroy();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `circuitDensity` | string | `'medium'` | Density of circuit paths: `'low'`, `'medium'`, `'high'` |
| `particleCount` | number\|string | `'auto'` | Number of animated particles or `'auto'` for automatic |
| `color` | string | `'#00c8ff'` | Primary color for circuits and particles (hex/rgb) |
| `backgroundColor` | string | `'#0a0e27'` | Canvas background color |
| `glowIntensity` | number | `0.8` | Glow effect intensity (0-1) |
| `speed` | number | `1.0` | Animation speed multiplier |
| `performanceMode` | string | `'auto'` | Performance mode: `'auto'`, `'high'`, `'low'`, `'static'` |

## Performance Modes

### Auto Mode (Default)
Automatically adjusts based on device capabilities:
- **Desktop**: Medium density, 30 particles, 60 FPS
- **Mobile**: Low density, 15 particles, 30 FPS, reduced glow

### High Performance
Maximum quality for powerful devices:
- High circuit density
- More particles
- Full glow effects
- 60 FPS target

### Low Performance
Optimized for battery conservation:
- Low circuit density
- Fewer particles (10)
- Reduced glow effects
- 30 FPS target

### Static Mode
Non-animated fallback:
- Static circuit pattern
- No animation loops
- Perfect for `prefers-reduced-motion`
- Minimal CPU usage

## Mobile Optimization

The animation automatically detects mobile devices and applies optimizations:

- Reduced particle count (15 instead of 30)
- Lower frame rate (30 FPS instead of 60)
- Reduced glow intensity
- Lower pixel density ratio
- Simplified circuit patterns

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+

**Required Features:**
- Canvas API
- ES6 Modules
- requestAnimationFrame
- CSS Grid (for demo layout)

## Integration Examples

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import LightningAnimation from './lightning-animation.js';

function LightningBackground() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            animationRef.current = new LightningAnimation(canvasRef.current, {
                performanceMode: 'auto'
            });
            animationRef.current.start();
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy();
            }
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
```

### Vue Integration

```vue
<template>
    <canvas ref="canvas" class="lightning-background"></canvas>
</template>

<script>
import LightningAnimation from './lightning-animation.js';

export default {
    name: 'LightningBackground',
    data() {
        return {
            animation: null
        };
    },
    mounted() {
        this.animation = new LightningAnimation(this.$refs.canvas);
        this.animation.start();
    },
    beforeUnmount() {
        if (this.animation) {
            this.animation.destroy();
        }
    }
};
</script>
```

### Vanilla JS Integration

```html
<div id="app">
    <canvas id="bg-animation"></canvas>
    <div class="content">
        <!-- Your content here -->
    </div>
</div>

<script type="module">
    import LightningAnimation from './lightning-animation.js';

    const canvas = document.getElementById('bg-animation');
    const animation = new LightningAnimation(canvas, {
        color: '#00c8ff',
        speed: 0.8
    });
    animation.start();
</script>
```

## Customization Examples

### Change Color Scheme

```javascript
// Neon green theme
const animation = new LightningAnimation(canvas, {
    color: '#00ff41',
    backgroundColor: '#0d1b0d',
    glowIntensity: 1.0
});

// Purple/magenta theme
const animation = new LightningAnimation(canvas, {
    color: '#ff00ff',
    backgroundColor: '#1a0d1a',
    glowIntensity: 0.9
});

// Orange/amber theme
const animation = new LightningAnimation(canvas, {
    color: '#ff8800',
    backgroundColor: '#1a0f00',
    glowIntensity: 0.7
});
```

### Adjust Animation Speed

```javascript
// Slow, calm animation
const animation = new LightningAnimation(canvas, {
    speed: 0.5,
    particleCount: 20
});

// Fast, energetic animation
const animation = new LightningAnimation(canvas, {
    speed: 2.0,
    particleCount: 40
});
```

### Dense Circuit Network

```javascript
const animation = new LightningAnimation(canvas, {
    circuitDensity: 'high',
    particleCount: 50,
    performanceMode: 'high'
});
```

## Performance Tips

1. **Use appropriate performance mode**: Set `performanceMode: 'low'` for battery-powered devices
2. **Reduce particle count**: Lower `particleCount` if experiencing frame drops
3. **Disable glow on low-end devices**: Set `glowIntensity: 0` to save GPU resources
4. **Pause when hidden**: Use Visibility API to pause animation when tab is not visible
5. **Destroy when unmounted**: Always call `destroy()` when removing the canvas

## Troubleshooting

### Animation is choppy
- Reduce `particleCount`
- Set `performanceMode: 'low'`
- Reduce `glowIntensity`

### Too many/few circuits
- Adjust `circuitDensity` ('low', 'medium', or 'high')

### Animation not starting
- Check browser console for errors
- Ensure canvas element exists before initialization
- Verify ES6 module support in your environment

### High CPU usage
- Enable `performanceMode: 'low'`
- Reduce `particleCount`
- Consider using `performanceMode: 'static'` for background tabs

## File Structure

```
lightning-animation/
├── index.html              # Demo page
├── styles.css              # Demo styles
├── lightning-animation.js  # Core animation class
├── app.js                  # Demo initialization
└── README.md              # Documentation
```

## Technical Details

### Rendering Pipeline

1. **Setup Phase**: Canvas initialization, circuit generation, particle creation
2. **Animation Loop**:
   - Frame throttling based on target FPS
   - Background rendering
   - Circuit path drawing
   - Particle position updates
   - Particle rendering with glow effects
3. **Performance Monitoring**: Automatic adjustment based on frame rate

### Circuit Generation Algorithm

- Grid-based layout with configurable density
- Horizontal and vertical primary paths
- Random diagonal paths for variety
- Segmented lines with gaps for authentic circuit-board look
- Randomized opacity for depth effect

### Particle System

- Each particle follows a specific circuit path
- Progress-based movement (0-1 along path)
- Seamless looping when reaching path end
- Individual speed variation
- Glow effect using radial gradients
- Tail effect using linear gradients

## License

MIT License - feel free to use in commercial and personal projects.

## Credits

Created for Pargo's Chest by the Lightning Animation Agent.

## Support

For issues, questions, or contributions, please visit the project repository.

---

**Built with ⚡ and Canvas API**
