# Web macOS Desktop Environment

A web-based macOS desktop environment that mimics macOS Big Sur / Monterey experience in the browser.

## Features

### Core Desktop
- **Top Menu Bar**: Apple logo, app name, menu items (文件，编辑，显示，前往，窗口，帮助)
- **System Tray**: Battery status, WiFi icon, search, media controls
- **Date/Time Display**: Real-time clock with Chinese localization
- **Desktop Area**: Gradient wallpaper with draggable icons
- **Bottom Dock Bar**: Application icons with hover magnification effect

### Window System
- **Draggable Windows**: Click and drag from titlebar to move windows
- **Window Controls**: Close (red), Minimize (yellow), Maximize (green) buttons
- **Z-index Management**: Active window comes to front with visual feedback
- **Window Animations**: Smooth open/close animations
- **Minimize to Dock**: Windows minimize to floating representations

### Sample Applications
1. **Finder**: File browser with sidebar navigation
2. **Terminal**: Command emulator with basic commands (help, clear, date, ls, pwd, echo)
3. **Safari**: Browser mockup with address bar and navigation
4. **Notes**: Simple text editor with yellow background

## Usage

Access the demo at `/desktop/` from the main site.

### Interactions

- **Open App**: Click on desktop icon or dock icon
- **Close Window**: Click red button or use dock indicator
- **Minimize Window**: Click yellow button, click again to restore
- **Maximize Window**: Click green button to toggle fullscreen
- **Focus Window**: Click anywhere on window to bring to front
- **Drag Window**: Click and hold titlebar to move

### Terminal Commands

Supported commands in Terminal app:
- `help` - Show available commands
- `clear` - Clear terminal output
- `date` - Display current date/time
- `whoami` - Display current user
- `pwd` - Display current directory
- `ls` - List directory contents
- `echo [text]` - Print text to console

## Files

- `desktop/index.html` - Main HTML structure
- `assets/css/macos-desktop.css` - Styling and animations
- `assets/js/macos-desktop.js` - Interactive functionality

## Technologies

- Vanilla JavaScript (ES6+)
- CSS3 (Flexbox, Grid, Animations, Backdrop Filter)
- Font Awesome icons
- No external dependencies

## Browser Support

- Chrome/Edge (recommended)
- Safari
- Firefox

Requires modern browser support for:
- CSS backdrop-filter
- ES6+ JavaScript features