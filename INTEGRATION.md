# Integration Guide

Quick reference for integrating the Lightning Animation into your project.

## Installation

### Option 1: Direct Files
Copy these files to your project:
- `lightning-animation.js` (core animation)
- `styles.css` (optional demo styles)

### Option 2: NPM (if published)
```bash
npm install @pargos-chest/lightning-animation
```

## Basic Setup

### 1. HTML Structure
```html
<canvas id="lightning-canvas" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"></canvas>
```

### 2. Import and Initialize
```javascript
import LightningAnimation from './lightning-animation.js';

const canvas = document.getElementById('lightning-canvas');
const animation = new LightningAnimation(canvas);
animation.start();
```

## Framework-Specific Integration

### React

**Functional Component:**
```jsx
import { useEffect, useRef } from 'react';
import LightningAnimation from './lightning-animation';

export function AnimatedBackground() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        animationRef.current = new LightningAnimation(canvasRef.current, {
            color: '#00c8ff',
            performanceMode: 'auto'
        });
        animationRef.current.start();

        return () => animationRef.current?.destroy();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }}
        />
    );
}
```

**Class Component:**
```jsx
import React from 'react';
import LightningAnimation from './lightning-animation';

export class AnimatedBackground extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.animation = null;
    }

    componentDidMount() {
        this.animation = new LightningAnimation(this.canvasRef.current, {
            color: this.props.color || '#00c8ff',
            performanceMode: 'auto'
        });
        this.animation.start();
    }

    componentWillUnmount() {
        this.animation?.destroy();
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            />
        );
    }
}
```

### Vue 3 (Composition API)

```vue
<template>
    <canvas ref="canvasRef" class="lightning-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LightningAnimation from './lightning-animation';

const canvasRef = ref(null);
let animation = null;

onMounted(() => {
    animation = new LightningAnimation(canvasRef.value, {
        color: '#00c8ff',
        performanceMode: 'auto'
    });
    animation.start();
});

onUnmounted(() => {
    animation?.destroy();
});
</script>

<style scoped>
.lightning-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>
```

### Vue 2 (Options API)

```vue
<template>
    <canvas ref="canvas" class="lightning-bg"></canvas>
</template>

<script>
import LightningAnimation from './lightning-animation';

export default {
    name: 'LightningBackground',
    data() {
        return {
            animation: null
        };
    },
    mounted() {
        this.animation = new LightningAnimation(this.$refs.canvas, {
            color: '#00c8ff'
        });
        this.animation.start();
    },
    beforeDestroy() {
        if (this.animation) {
            this.animation.destroy();
        }
    }
};
</script>

<style scoped>
.lightning-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>
```

### Angular

```typescript
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import LightningAnimation from './lightning-animation';

@Component({
    selector: 'app-lightning-background',
    template: `<canvas #canvas class="lightning-bg"></canvas>`,
    styles: [`
        .lightning-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
    `]
})
export class LightningBackgroundComponent implements OnInit, OnDestroy {
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private animation: any;

    ngOnInit(): void {
        this.animation = new LightningAnimation(this.canvasRef.nativeElement, {
            color: '#00c8ff',
            performanceMode: 'auto'
        });
        this.animation.start();
    }

    ngOnDestroy(): void {
        this.animation?.destroy();
    }
}
```

### Svelte

```svelte
<script>
    import { onMount, onDestroy } from 'svelte';
    import LightningAnimation from './lightning-animation';

    let canvas;
    let animation;

    onMount(() => {
        animation = new LightningAnimation(canvas, {
            color: '#00c8ff',
            performanceMode: 'auto'
        });
        animation.start();
    });

    onDestroy(() => {
        animation?.destroy();
    });
</script>

<canvas bind:this={canvas} class="lightning-bg"></canvas>

<style>
    .lightning-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
</style>
```

## Common Patterns

### Pause on Tab Hidden

```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        animation.pause();
    } else {
        animation.resume();
    }
});
```

### Dynamic Theme Changes

```javascript
// Change to dark theme
function setDarkTheme() {
    animation.destroy();
    animation = new LightningAnimation(canvas, {
        color: '#00c8ff',
        backgroundColor: '#0a0e27'
    });
    animation.start();
}

// Change to light theme
function setLightTheme() {
    animation.destroy();
    animation = new LightningAnimation(canvas, {
        color: '#0066cc',
        backgroundColor: '#f0f4f8',
        glowIntensity: 0.3
    });
    animation.start();
}
```

### User Preference Toggle

```javascript
const performanceToggle = document.getElementById('performance-toggle');
const modes = ['auto', 'high', 'low', 'static'];
let currentMode = 0;

performanceToggle.addEventListener('click', () => {
    currentMode = (currentMode + 1) % modes.length;
    animation.setPerformanceMode(modes[currentMode]);
    performanceToggle.textContent = `Mode: ${modes[currentMode]}`;
});
```

### Responsive Canvas Sizing

```javascript
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

## Configuration Presets

### Subtle Background
```javascript
new LightningAnimation(canvas, {
    circuitDensity: 'low',
    particleCount: 10,
    glowIntensity: 0.3,
    speed: 0.5,
    color: '#00c8ff'
});
```

### Intense/Cyberpunk
```javascript
new LightningAnimation(canvas, {
    circuitDensity: 'high',
    particleCount: 50,
    glowIntensity: 1.0,
    speed: 1.5,
    color: '#ff00ff',
    backgroundColor: '#0a0014'
});
```

### Energy Efficient
```javascript
new LightningAnimation(canvas, {
    performanceMode: 'low',
    circuitDensity: 'low',
    particleCount: 8,
    glowIntensity: 0.2,
    speed: 0.8
});
```

### Maximum Quality
```javascript
new LightningAnimation(canvas, {
    performanceMode: 'high',
    circuitDensity: 'high',
    particleCount: 60,
    glowIntensity: 1.0,
    speed: 1.0
});
```

## CSS Tips

### Full-Screen Background
```css
.lightning-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
}
```

### Container Background
```css
.container {
    position: relative;
}

.lightning-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.content {
    position: relative;
    z-index: 1;
}
```

### Hero Section
```css
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero .lightning-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.hero-content {
    position: relative;
    z-index: 1;
    color: white;
}
```

## Testing

### Check Performance
```javascript
const animation = new LightningAnimation(canvas);
animation.start();

// Check in console after a few seconds
console.log('Particles:', animation.particles.length);
console.log('Circuits:', animation.circuits.length);
console.log('FPS target:', animation.fps);
console.log('Mobile:', animation.isMobile);
console.log('Performance mode:', animation.config.performanceMode);
```

### Verify Reduced Motion
```javascript
// Simulate reduced motion preference
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
console.log('Reduced motion:', mediaQuery.matches);

// The animation should automatically use static fallback
```

## Troubleshooting

### Canvas is blank
- Ensure canvas has width/height (either via CSS or attributes)
- Check that `start()` was called
- Verify module imports are working

### Performance issues
- Try `performanceMode: 'low'`
- Reduce `particleCount`
- Lower `circuitDensity`
- Set `glowIntensity: 0`

### Animation stutters
- Check other heavy processes on the page
- Reduce particle count for mobile
- Ensure proper cleanup in SPA frameworks

## Best Practices

1. **Always destroy** when unmounting components
2. **Pause when hidden** using Visibility API
3. **Use auto mode** for most cases (handles mobile automatically)
4. **Test on mobile** devices for performance
5. **Respect user preferences** (reduced motion, battery saver)
6. **Keep z-index low** for background usage
7. **Use pointer-events: none** if canvas is non-interactive

---

For more details, see [README.md](README.md)
