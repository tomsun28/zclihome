// macOS Desktop Environment - Interactive Features

class MacDesktop {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.zIndexCounter = 100;
    this.minimizedWindows = [];
    
    this.init();
  }

  init() {
    this.setupMenuBar();
    this.setupDesktopIcons();
    this.setupDock();
    this.setupWindowControls();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  setupMenuBar() {
    // Menu bar is mostly static, but we can add interactivity later
  }

  setupDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const windowId = icon.dataset.window;
        this.openWindow(windowId);
      });
    });
  }

  setupDock() {
    const dockItems = document.querySelectorAll('.dock-item[data-launch]');
    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        const windowId = item.dataset.launch;
        this.toggleWindow(windowId);
      });
      
      // Add running indicator when window is open
      item.addEventListener('mouseenter', () => {
        if (this.windows.has(windowId)) {
          item.classList.add('running');
        }
      });
    });
  }

  setupWindowControls() {
    // Window control buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const windowEl = btn.closest('.window');
        const windowId = windowEl.id.replace('window-', '');
        
        switch(action) {
          case 'close':
            this.closeWindow(windowId);
            break;
          case 'minimize':
            this.minimizeWindow(windowId);
            break;
          case 'maximize':
            this.maximizeWindow(windowId);
            break;
        }
      });
    });

    // Window drag functionality
    document.querySelectorAll('.window-titlebar').forEach(titlebar => {
      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.control-btn')) return;
        
        const windowEl = titlebar.closest('.window');
        this.makeDraggable(windowEl, e);
        this.focusWindow(windowEl.id.replace('window-', ''));
      });
    });

    // Click on window to focus
    document.querySelectorAll('.window').forEach(windowEl => {
      windowEl.addEventListener('mousedown', () => {
        this.focusWindow(windowEl.id.replace('window-', ''));
      });
    });
  }

  makeDraggable(windowEl, e) {
    const rect = windowEl.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    const onMouseMove = (moveEvent) => {
      windowEl.style.left = `${moveEvent.clientX - offsetX}px`;
      windowEl.style.top = `${moveEvent.clientY - offsetY}px`;
      windowEl.style.right = 'auto';
      windowEl.style.bottom = 'auto';
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  openWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;
    
    windowEl.style.display = 'flex';
    
    // Remove from minimized if it was there
    const minimizedIndex = this.minimizedWindows.findIndex(w => w.id === windowId);
    if (minimizedIndex !== -1) {
      const minimizedWin = this.minimizedWindows[minimizedIndex];
      minimizedWin.element.remove();
      this.minimizedWindows.splice(minimizedIndex, 1);
      this.updateDockIndicators();
    }
    
    // Reset position if needed
    if (!windowEl.style.top) {
      const offset = this.windows.size * 30;
      windowEl.style.top = `${60 + offset}px`;
      windowEl.style.left = `${60 + offset}px`;
    }
    
    this.focusWindow(windowId);
    this.updateDockIndicators();
  }

  closeWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;
    
    windowEl.classList.add('window-closing');
    
    setTimeout(() => {
      windowEl.style.display = 'none';
      windowEl.classList.remove('window-closing');
      this.updateDockIndicators();
    }, 200);
  }

  minimizeWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;
    
    windowEl.style.display = 'none';
    
    // Create minimized representation
    const minimizedWin = document.createElement('div');
    minimizedWin.className = 'minimized-window';
    minimizedWin.id = `minimized-${windowId}`;
    minimizedWin.innerHTML = windowEl.querySelector('.window-title').textContent.charAt(0);
    
    minimizedWin.addEventListener('click', () => {
      this.openWindow(windowId);
    });
    
    document.getElementById('minimizedWindows').appendChild(minimizedWin);
    this.minimizedWindows.push({ id: windowId, element: minimizedWin });
    
    // Update dock indicator
    const dockItem = document.querySelector(`.dock-item[data-launch="${windowId}"]`);
    if (dockItem) {
      dockItem.classList.add('running-dark');
    }
  }

  maximizeWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;
    
    if (windowEl.dataset.maximized === 'true') {
      // Restore
      windowEl.style.width = windowEl.dataset.prevWidth || '';
      windowEl.style.height = windowEl.dataset.prevHeight || '';
      windowEl.style.top = windowEl.dataset.prevTop || '';
      windowEl.style.left = windowEl.dataset.prevLeft || '';
      windowEl.style.maxWidth = '';
      windowEl.style.maxHeight = '';
      windowEl.dataset.maximized = 'false';
    } else {
      // Maximize
      windowEl.dataset.prevWidth = windowEl.style.width;
      windowEl.dataset.prevHeight = windowEl.style.height;
      windowEl.dataset.prevTop = windowEl.style.top;
      windowEl.dataset.prevLeft = windowEl.style.left;
      
      windowEl.style.width = 'calc(100% - 40px)';
      windowEl.style.height = 'calc(100vh - 28px - 80px)';
      windowEl.style.top = '28px';
      windowEl.style.left = '20px';
      windowEl.style.maxWidth = 'none';
      windowEl.style.maxHeight = 'none';
      windowEl.dataset.maximized = 'true';
    }
  }

  toggleWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    const isVisible = windowEl && windowEl.style.display !== 'none';
    
    if (isVisible && this.activeWindow === windowId) {
      this.minimizeWindow(windowId);
    } else {
      this.openWindow(windowId);
    }
  }

  focusWindow(windowId) {
    const windowEl = document.getElementById(`window-${windowId}`);
    if (!windowEl) return;
    
    // Remove active class from all windows
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    
    // Add active class to focused window
    windowEl.classList.add('active');
    
    // Update z-index
    this.zIndexCounter++;
    windowEl.style.zIndex = this.zIndexCounter;
    
    this.activeWindow = windowId;
  }

  updateDockIndicators() {
    // Check which windows are currently visible
    const visibleWindows = Array.from(document.querySelectorAll('.window')).filter(
      w => w.style.display !== 'none'
    ).map(w => w.id.replace('window-', ''));
    
    const dockItems = document.querySelectorAll('.dock-item[data-launch]');
    
    dockItems.forEach(item => {
      const windowId = item.dataset.launch || item.dataset.window;
      if (visibleWindows.includes(windowId)) {
        item.classList.add('running');
      } else {
        item.classList.remove('running');
      }
    });
  }

  updateDateTime() {
    const dateTimeEl = document.getElementById('dateTime');
    if (!dateTimeEl) return;
    
    const now = new Date();
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Format date in Chinese
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const months = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    dateTimeEl.textContent = `${dayName} ${monthName} ${now.getDate()}日 ${hour}:${minute}`;
  }
}

// Terminal functionality
class TerminalEmulator {
  constructor() {
    this.input = document.querySelector('.terminal-input');
    this.output = document.querySelector('.terminal-output');
    
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeCommand(this.input.value.trim());
          this.input.value = '';
        }
      });
    }
  }

  executeCommand(cmd) {
    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="prompt">user@macbook ~ %</span> ${cmd}`;
    
    // Insert before the input line
    const inputLine = document.getElementById('terminal-input-line');
    inputLine.before(commandLine);
    
    // Process command
    let response = '';
    switch(cmd.toLowerCase()) {
      case 'help':
        response = '可用命令：help, clear, date, echo [text], whoami, ls, pwd';
        break;
      case 'clear':
        this.output.innerHTML = '';
        return;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = 'user';
        break;
      case 'pwd':
        response = '/Users/user';
        break;
      case 'ls':
        response = 'Desktop  Documents  Downloads  Music  Pictures  Public';
        break;
      default:
        if (cmd.startsWith('echo ')) {
          response = cmd.substring(5);
        } else if (cmd && !response) {
          response = `zsh: command not found: ${cmd}`;
        }
    }
    
    if (response) {
      const responseLine = document.createElement('div');
      responseLine.textContent = response;
      inputLine.before(responseLine);
    }
    
    // Scroll to bottom
    this.output.scrollTop = this.output.scrollHeight;
  }
}

// Initialize desktop when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.macDesktop = new MacDesktop();
  window.terminal = new TerminalEmulator();
  
  // Open Finder window by default
  setTimeout(() => {
    macDesktop.openWindow('finder');
  }, 500);
});
