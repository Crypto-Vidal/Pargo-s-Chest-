/**
 * Application Entry Point
 * Initializes the Lightning Animation and sets up controls
 */

import LightningAnimation from './lightning-animation.js';

// Initialize animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lightning-canvas');
    const toggleAnimationBtn = document.getElementById('toggle-animation');
    const togglePerformanceBtn = document.getElementById('toggle-performance');

    // Create animation instance
    const animation = new LightningAnimation(canvas, {
        circuitDensity: 'medium',
        particleCount: 'auto',
        color: '#00c8ff',
        backgroundColor: '#0a0e27',
        glowIntensity: 0.8,
        speed: 1.0,
        performanceMode: 'auto'
    });

    // Start animation
    animation.start();

    // Toggle animation play/pause
    let isPlaying = true;
    toggleAnimationBtn.addEventListener('click', () => {
        if (isPlaying) {
            animation.pause();
            toggleAnimationBtn.textContent = 'Resume Animation';
        } else {
            animation.resume();
            toggleAnimationBtn.textContent = 'Pause Animation';
        }
        isPlaying = !isPlaying;
    });

    // Toggle performance mode
    let performanceMode = animation.config.performanceMode;
    const performanceModes = ['auto', 'high', 'low', 'static'];
    let currentModeIndex = performanceModes.indexOf(performanceMode);

    const updatePerformanceButton = () => {
        const modeLabels = {
            'auto': 'Auto Performance',
            'high': 'High Performance',
            'low': 'Low Performance',
            'static': 'Static Mode'
        };
        togglePerformanceBtn.textContent = modeLabels[performanceModes[currentModeIndex]];
    };

    updatePerformanceButton();

    togglePerformanceBtn.addEventListener('click', () => {
        currentModeIndex = (currentModeIndex + 1) % performanceModes.length;
        const newMode = performanceModes[currentModeIndex];

        animation.setPerformanceMode(newMode);
        updatePerformanceButton();

        console.log(`Performance mode set to: ${newMode}`);
    });

    // Handle visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isPlaying) {
                animation.pause();
            }
        } else {
            if (isPlaying) {
                animation.resume();
            }
        }
    });

    // Expose animation instance for debugging
    window.lightningAnimation = animation;

    console.log('⚡ Lightning Animation initialized');
    console.log('Performance mode:', animation.config.performanceMode);
    console.log('Particle count:', animation.particles.length);
    console.log('Circuit count:', animation.circuits.length);
    console.log('Mobile device:', animation.isMobile);
    console.log('Reduced motion:', animation.prefersReducedMotion);
});
