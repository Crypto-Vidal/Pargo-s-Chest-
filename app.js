// Pargo's Chest - Main Application
// Mobile-optimized clipboard manager PWA

class PargosChest {
  constructor() {
    this.clips = [];
    this.filteredClips = [];
    this.deferredPrompt = null;
    this.db = null;

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.isSwiping = false;

    // Initialize app
    this.init();
  }

  async init() {
    console.log('🏴‍☠️ Initializing Pargo\'s Chest...');

    // Initialize IndexedDB
    await this.initDB();

    // Load clips from storage
    await this.loadClips();

    // Setup event listeners
    this.setupEventListeners();

    // Register service worker
    this.registerServiceWorker();

    // Setup PWA install prompt
    this.setupInstallPrompt();

    // Check online status
    this.updateOnlineStatus();

    // Setup touch gestures
    this.setupTouchGestures();

    // Render initial state
    this.render();

    console.log('✓ App initialized');
  }

  // IndexedDB for robust offline storage
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PargosChestDB', 1);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        // Fallback to localStorage
        this.db = null;
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✓ IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create clips object store
        if (!db.objectStoreNames.contains('clips')) {
          const clipsStore = db.createObjectStore('clips', { keyPath: 'id', autoIncrement: true });
          clipsStore.createIndex('timestamp', 'timestamp', { unique: false });
          clipsStore.createIndex('content', 'content', { unique: false });
        }
      };
    });
  }

  // Service Worker Registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✓ Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showToast('New version available! Refresh to update.', 'info', 5000);
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // PWA Install Prompt
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;

      // Show install prompt after a delay
      setTimeout(() => {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt && !this.isInstalled()) {
          installPrompt.style.display = 'flex';
        }
      }, 3000);
    });

    // Detect if already installed
    window.addEventListener('appinstalled', () => {
      console.log('✓ PWA installed');
      this.deferredPrompt = null;
      document.getElementById('installPrompt').style.display = 'none';
      document.getElementById('pwaBadge').style.display = 'block';
      this.showToast('App installed successfully! 🎉', 'success');
    });

    // Check if running as PWA
    if (this.isInstalled()) {
      document.getElementById('pwaBadge').style.display = 'block';
    }
  }

  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // Event Listeners
  setupEventListeners() {
    // Add clip
    document.getElementById('addBtn').addEventListener('click', () => this.addClip());
    document.getElementById('clipInput').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.addClip();
      }
    });

    // Paste button
    document.getElementById('pasteBtn').addEventListener('click', () => this.pasteFromClipboard());

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filterClips(e.target.value);
    });

    // Menu/Panel
    document.getElementById('menuBtn').addEventListener('click', () => this.openPanel());
    document.getElementById('closePanelBtn').addEventListener('click', () => this.closePanel());
    document.getElementById('overlay').addEventListener('click', () => this.closePanel());

    // Settings
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
      this.toggleDarkMode(e.target.checked);
    });

    document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllClips());
    document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

    // Install PWA
    document.getElementById('installBtn').addEventListener('click', () => this.installPWA());
    document.getElementById('dismissInstallBtn').addEventListener('click', () => {
      document.getElementById('installPrompt').style.display = 'none';
    });

    // Online/Offline status
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());

    // Prevent zoom on double-tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }

  // Touch Gestures for Panel
  setupTouchGestures() {
    const panel = document.getElementById('sidePanel');
    const app = document.getElementById('app');

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startFromEdge = false;

    app.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;

      // Check if swipe started from right edge (for opening panel)
      if (startX > window.innerWidth - 50) {
        startFromEdge = true;
      }

      // If panel is open, allow dragging
      if (panel.classList.contains('open')) {
        isDragging = true;
      } else if (startFromEdge) {
        isDragging = true;
      }
    }, { passive: true });

    app.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;

      // Open gesture (swipe left from right edge)
      if (startFromEdge && diffX < 0) {
        const translateX = Math.max(diffX, -300);
        panel.style.transform = `translateX(${Math.abs(translateX)}px)`;
        panel.style.transition = 'none';
      }

      // Close gesture (swipe right when panel is open)
      if (panel.classList.contains('open') && diffX > 0) {
        const translateX = Math.min(diffX, 300);
        panel.style.transform = `translateX(${translateX}px)`;
        panel.style.transition = 'none';
      }
    }, { passive: true });

    app.addEventListener('touchend', (e) => {
      if (!isDragging) return;

      const diffX = currentX - startX;
      const threshold = 100;

      panel.style.transition = 'transform 0.3s ease';

      // Open panel if swiped enough from right edge
      if (startFromEdge && diffX < -threshold) {
        this.openPanel();
      } else if (panel.classList.contains('open') && diffX > threshold) {
        // Close panel if swiped right enough
        this.closePanel();
      } else {
        // Reset position
        panel.style.transform = '';
      }

      // Reset states
      isDragging = false;
      startFromEdge = false;
      startX = 0;
      currentX = 0;

      // Clean up transform after animation
      setTimeout(() => {
        if (!panel.classList.contains('open')) {
          panel.style.transform = '';
        }
      }, 300);
    }, { passive: true });
  }

  // Panel Controls
  openPanel() {
    const panel = document.getElementById('sidePanel');
    const overlay = document.getElementById('overlay');

    panel.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closePanel() {
    const panel = document.getElementById('sidePanel');
    const overlay = document.getElementById('overlay');

    panel.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Clipboard Operations
  async pasteFromClipboard() {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        this.showToast('Clipboard access not available. Please paste manually.', 'warning');
        document.getElementById('clipInput').focus();
        return;
      }

      const text = await navigator.clipboard.readText();
      if (text) {
        document.getElementById('clipInput').value = text;
        this.showToast('Pasted from clipboard', 'success');
      } else {
        this.showToast('Clipboard is empty', 'info');
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      this.showToast('Please paste manually (Ctrl+V)', 'warning');
      document.getElementById('clipInput').focus();
    }
  }

  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        this.showToast('Copied to clipboard! ✓', 'success');
      } else {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);

    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile

    try {
      document.execCommand('copy');
      this.showToast('Copied to clipboard! ✓', 'success');
    } catch (error) {
      this.showToast('Failed to copy. Please copy manually.', 'error');
    }

    document.body.removeChild(textArea);
  }

  // Clip Management
  async addClip() {
    const input = document.getElementById('clipInput');
    const content = input.value.trim();

    if (!content) {
      this.showToast('Please enter some content', 'warning');
      return;
    }

    const clip = {
      content,
      timestamp: Date.now(),
      favorite: false
    };

    // Add to array
    this.clips.unshift(clip);

    // Save to storage
    await this.saveClips();

    // Clear input
    input.value = '';

    // Re-render
    this.render();

    this.showToast('Added to chest! 🏴‍☠️', 'success');

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  async deleteClip(index) {
    if (confirm('Remove this treasure from your chest?')) {
      this.clips.splice(index, 1);
      await this.saveClips();
      this.render();
      this.showToast('Clip removed', 'info');
    }
  }

  async toggleFavorite(index) {
    this.clips[index].favorite = !this.clips[index].favorite;
    await this.saveClips();
    this.render();
  }

  filterClips(query) {
    if (!query) {
      this.filteredClips = [...this.clips];
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredClips = this.clips.filter(clip =>
        clip.content.toLowerCase().includes(lowerQuery)
      );
    }
    this.renderClips();
  }

  // Storage Operations
  async saveClips() {
    try {
      if (this.db) {
        // Use IndexedDB
        const tx = this.db.transaction(['clips'], 'readwrite');
        const store = tx.objectStore('clips');

        // Clear existing
        await store.clear();

        // Add all clips
        for (const clip of this.clips) {
          await store.add(clip);
        }

        console.log('✓ Clips saved to IndexedDB');
      } else {
        // Fallback to localStorage
        localStorage.setItem('pargos-clips', JSON.stringify(this.clips));
        console.log('✓ Clips saved to localStorage');
      }
    } catch (error) {
      console.error('Failed to save clips:', error);
      // Fallback to localStorage
      localStorage.setItem('pargos-clips', JSON.stringify(this.clips));
    }
  }

  async loadClips() {
    try {
      if (this.db) {
        // Load from IndexedDB
        const tx = this.db.transaction(['clips'], 'readonly');
        const store = tx.objectStore('clips');
        const request = store.getAll();

        this.clips = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Sort by timestamp (newest first)
        this.clips.sort((a, b) => b.timestamp - a.timestamp);

        console.log('✓ Loaded clips from IndexedDB:', this.clips.length);
      } else {
        // Load from localStorage
        const stored = localStorage.getItem('pargos-clips');
        this.clips = stored ? JSON.parse(stored) : [];
        console.log('✓ Loaded clips from localStorage:', this.clips.length);
      }

      this.filteredClips = [...this.clips];
    } catch (error) {
      console.error('Failed to load clips:', error);
      this.clips = [];
      this.filteredClips = [];
    }
  }

  async clearAllClips() {
    if (!confirm('Are you sure you want to clear all clips? This cannot be undone.')) {
      return;
    }

    this.clips = [];
    this.filteredClips = [];
    await this.saveClips();
    this.render();
    this.showToast('All clips cleared', 'info');
  }

  // Export/Import
  exportData() {
    const data = {
      clips: this.clips,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pargos-chest-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Data exported successfully', 'success');
  }

  // UI Rendering
  render() {
    this.renderClips();
    this.updateEmptyState();
  }

  renderClips() {
    const clipsList = document.getElementById('clipsList');
    const clipsToRender = this.filteredClips.length > 0 ? this.filteredClips : this.clips;

    if (clipsToRender.length === 0) {
      clipsList.innerHTML = '';
      this.updateEmptyState();
      return;
    }

    clipsList.innerHTML = clipsToRender.map((clip, index) => {
      const date = new Date(clip.timestamp);
      const timeStr = this.formatTime(date);

      return `
        <div class="clip-card" data-index="${index}">
          <div class="clip-header">
            <span class="clip-time">${timeStr}</span>
            <div class="clip-actions">
              <button class="icon-btn favorite-btn ${clip.favorite ? 'active' : ''}"
                      onclick="app.toggleFavorite(${index})"
                      aria-label="Favorite">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${clip.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button class="icon-btn delete-btn"
                      onclick="app.deleteClip(${index})"
                      aria-label="Delete">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="clip-content" onclick="app.copyToClipboard(\`${this.escapeHtml(clip.content)}\`)">
            <p>${this.escapeHtml(clip.content)}</p>
          </div>
          <div class="clip-footer">
            <button class="btn btn-sm btn-secondary" onclick="app.copyToClipboard(\`${this.escapeHtml(clip.content)}\`)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.updateEmptyState();
  }

  updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const clipsList = document.getElementById('clipsList');

    if (this.clips.length === 0) {
      emptyState.style.display = 'flex';
      clipsList.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      clipsList.style.display = 'block';
    }
  }

  // Utilities
  formatTime(date) {
    const now = new Date();
    const diff = now - date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return 'Just now';
    } else if (diff < hour) {
      const mins = Math.floor(diff / minute);
      return `${mins} min${mins > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 7 * day) {
      const days = Math.floor(diff / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/`/g, '\\`');
  }

  toggleDarkMode(enabled) {
    if (enabled) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', enabled);
  }

  updateOnlineStatus() {
    const statusIndicator = document.getElementById('onlineStatus');
    const statusText = document.getElementById('statusText');

    if (navigator.onLine) {
      statusIndicator.className = 'status-indicator online';
      statusText.textContent = 'Online';
    } else {
      statusIndicator.className = 'status-indicator offline';
      statusText.textContent = 'Offline';
      this.showToast('You\'re offline. App will continue to work!', 'info', 3000);
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) {
      this.showToast('App is already installed or cannot be installed', 'info');
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✓ PWA install accepted');
    } else {
      console.log('PWA install dismissed');
    }

    this.deferredPrompt = null;
    document.getElementById('installPrompt').style.display = 'none';
  }

  // Toast Notifications
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => container.removeChild(toast), 300);
    }, duration);
  }
}

// Initialize app when DOM is ready
let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new PargosChest();
  });
} else {
  app = new PargosChest();
}
