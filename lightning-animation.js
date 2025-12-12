/**
 * Lightning Circuit Animation
 * High-performance animated background with circuit-board patterns
 * and electric-blue traveling light effects
 */

export class LightningAnimation {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });

        // Configuration
        this.config = {
            circuitDensity: options.circuitDensity || 'medium', // low, medium, high
            particleCount: options.particleCount || 'auto',
            color: options.color || '#00c8ff',
            backgroundColor: options.backgroundColor || '#0a0e27',
            glowIntensity: options.glowIntensity || 0.8,
            speed: options.speed || 1.0,
            performanceMode: options.performanceMode || 'auto', // auto, high, low
        };

        // State
        this.isRunning = false;
        this.isPaused = false;
        this.animationFrameId = null;
        this.circuits = [];
        this.particles = [];
        this.lastFrameTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;

        // Performance monitoring
        this.frameCount = 0;
        this.performanceCheckInterval = 60; // Check every 60 frames
        this.lowPerformanceMode = false;

        // Device detection
        this.isMobile = this.detectMobile();
        this.prefersReducedMotion = this.detectReducedMotion();

        // Auto-adjust settings based on device
        this.autoAdjustSettings();

        // Initialize
        this.setupCanvas();
        this.generateCircuits();
        this.generateParticles();

        // Handle resize
        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }

    detectReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    autoAdjustSettings() {
        // If user prefers reduced motion, use static fallback
        if (this.prefersReducedMotion) {
            this.config.performanceMode = 'static';
            return;
        }

        // Auto-adjust based on device
        if (this.config.performanceMode === 'auto') {
            if (this.isMobile) {
                this.config.circuitDensity = 'low';
                this.config.particleCount = 15;
                this.fps = 30;
                this.config.glowIntensity = 0.5;
            } else {
                this.config.circuitDensity = 'medium';
                this.config.particleCount = 30;
            }
        } else if (this.config.performanceMode === 'low') {
            this.config.circuitDensity = 'low';
            this.config.particleCount = 10;
            this.fps = 30;
            this.config.glowIntensity = 0.3;
        }

        this.frameInterval = 1000 / this.fps;
    }

    setupCanvas() {
        const dpr = this.lowPerformanceMode ? 1 : Math.min(window.devicePixelRatio, 2);
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
    }

    generateCircuits() {
        this.circuits = [];

        const densityMap = {
            low: { horizontal: 8, vertical: 6 },
            medium: { horizontal: 12, vertical: 9 },
            high: { horizontal: 16, vertical: 12 }
        };

        const density = densityMap[this.config.circuitDensity];
        const cellWidth = this.width / density.horizontal;
        const cellHeight = this.height / density.vertical;

        // Generate horizontal circuits
        for (let i = 1; i < density.vertical; i++) {
            const y = i * cellHeight;
            const segments = this.generateCircuitSegments(0, y, this.width, y, cellWidth);
            this.circuits.push(...segments);
        }

        // Generate vertical circuits
        for (let i = 1; i < density.horizontal; i++) {
            const x = i * cellWidth;
            const segments = this.generateCircuitSegments(x, 0, x, this.height, cellHeight);
            this.circuits.push(...segments);
        }

        // Add some diagonal circuits for variety
        const diagonalCount = Math.floor(density.horizontal * 0.3);
        for (let i = 0; i < diagonalCount; i++) {
            const startX = Math.random() * this.width;
            const startY = Math.random() * this.height;
            const angle = (Math.random() * Math.PI / 4) + Math.PI / 4; // 45-90 degrees
            const length = Math.random() * 200 + 100;
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;

            if (endX >= 0 && endX <= this.width && endY >= 0 && endY <= this.height) {
                this.circuits.push({
                    x1: startX, y1: startY,
                    x2: endX, y2: endY,
                    opacity: Math.random() * 0.3 + 0.2
                });
            }
        }
    }

    generateCircuitSegments(x1, y1, x2, y2, segmentLength) {
        const segments = [];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const totalLength = Math.sqrt(dx * dx + dy * dy);
        const numSegments = Math.floor(totalLength / segmentLength);

        for (let i = 0; i < numSegments; i++) {
            // Randomly skip some segments for a broken circuit look
            if (Math.random() > 0.7) continue;

            const t1 = i / numSegments;
            const t2 = (i + 0.7) / numSegments; // Leave gaps

            segments.push({
                x1: x1 + dx * t1,
                y1: y1 + dy * t1,
                x2: x1 + dx * t2,
                y2: y1 + dy * t2,
                opacity: Math.random() * 0.3 + 0.2
            });
        }

        return segments;
    }

    generateParticles() {
        this.particles = [];
        const count = this.config.particleCount === 'auto' ? 30 : this.config.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        // Pick a random circuit to travel along
        const circuit = this.circuits[Math.floor(Math.random() * this.circuits.length)];

        return {
            circuit: circuit,
            progress: Math.random(), // 0 to 1
            speed: (Math.random() * 0.3 + 0.2) * this.config.speed,
            size: Math.random() * 3 + 2,
            brightness: Math.random() * 0.5 + 0.5,
            tailLength: Math.random() * 30 + 20
        };
    }

    drawBackground() {
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawCircuits() {
        this.ctx.strokeStyle = this.config.color;
        this.ctx.lineWidth = 1;

        for (const circuit of this.circuits) {
            this.ctx.globalAlpha = circuit.opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(circuit.x1, circuit.y1);
            this.ctx.lineTo(circuit.x2, circuit.y2);
            this.ctx.stroke();

            // Draw nodes at endpoints
            if (Math.random() > 0.8) {
                this.ctx.fillStyle = this.config.color;
                this.ctx.globalAlpha = circuit.opacity * 1.5;
                this.ctx.beginPath();
                this.ctx.arc(circuit.x1, circuit.y1, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        for (const particle of this.particles) {
            const { circuit, progress, size, brightness, tailLength } = particle;

            // Calculate current position
            const x = circuit.x1 + (circuit.x2 - circuit.x1) * progress;
            const y = circuit.y1 + (circuit.y2 - circuit.y1) * progress;

            // Draw glow
            if (this.config.glowIntensity > 0) {
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 4);
                gradient.addColorStop(0, `rgba(0, 200, 255, ${brightness * this.config.glowIntensity})`);
                gradient.addColorStop(0.5, `rgba(0, 200, 255, ${brightness * this.config.glowIntensity * 0.3})`);
                gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw particle core
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw tail
            const tailProgress = Math.max(0, progress - 0.05);
            const tailX = circuit.x1 + (circuit.x2 - circuit.x1) * tailProgress;
            const tailY = circuit.y1 + (circuit.y2 - circuit.y1) * tailProgress;

            const tailGradient = this.ctx.createLinearGradient(tailX, tailY, x, y);
            tailGradient.addColorStop(0, 'rgba(0, 200, 255, 0)');
            tailGradient.addColorStop(1, `rgba(0, 200, 255, ${brightness * 0.8})`);

            this.ctx.strokeStyle = tailGradient;
            this.ctx.lineWidth = size * 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    updateParticles(deltaTime) {
        for (const particle of this.particles) {
            particle.progress += particle.speed * deltaTime * 0.001;

            // Loop seamlessly
            if (particle.progress >= 1) {
                particle.progress = 0;
                particle.circuit = this.circuits[Math.floor(Math.random() * this.circuits.length)];
                particle.speed = (Math.random() * 0.3 + 0.2) * this.config.speed;
            }
        }
    }

    animate(currentTime) {
        if (!this.isRunning || this.isPaused) return;

        // Throttle frame rate
        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime < this.frameInterval) {
            this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
            return;
        }

        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);

        // Performance monitoring
        this.frameCount++;
        if (this.frameCount % this.performanceCheckInterval === 0) {
            this.checkPerformance();
        }

        // Render
        this.drawBackground();
        this.drawCircuits();
        this.updateParticles(deltaTime);
        this.drawParticles();

        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    checkPerformance() {
        // Simple performance check - could be enhanced with actual FPS measurement
        if (this.isMobile && this.particles.length > 15 && !this.lowPerformanceMode) {
            this.lowPerformanceMode = true;
            this.particles = this.particles.slice(0, 10);
            console.log('LightningAnimation: Reduced particle count for better performance');
        }
    }

    start() {
        if (this.isRunning) return;

        // Use static fallback for reduced motion
        if (this.config.performanceMode === 'static' || this.prefersReducedMotion) {
            this.showStaticFallback();
            return;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.animate(this.lastFrameTime);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        if (!this.isRunning) {
            this.start();
            return;
        }
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.animate(this.lastFrameTime);
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    showStaticFallback() {
        this.canvas.classList.add('static-fallback');
        this.drawBackground();
        this.drawCircuits();

        // Draw particles at random positions (static)
        for (const particle of this.particles) {
            particle.progress = Math.random();
            const { circuit, progress, size, brightness } = particle;
            const x = circuit.x1 + (circuit.x2 - circuit.x1) * progress;
            const y = circuit.y1 + (circuit.y2 - circuit.y1) * progress;

            this.ctx.fillStyle = `rgba(0, 200, 255, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    handleResize() {
        this.setupCanvas();
        this.generateCircuits();

        // Redraw if paused or static
        if (this.isPaused || this.config.performanceMode === 'static') {
            this.drawBackground();
            this.drawCircuits();
            this.drawParticles();
        }
    }

    setPerformanceMode(mode) {
        this.config.performanceMode = mode;
        const wasRunning = this.isRunning;

        this.stop();
        this.autoAdjustSettings();
        this.generateCircuits();
        this.generateParticles();

        if (wasRunning) {
            this.start();
        }
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeHandler);
        this.canvas.classList.remove('static-fallback');
    }
}

export default LightningAnimation;
