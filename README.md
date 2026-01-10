# Browser Tab Tycoon

> "Start Chrome. Wait for it to respond. Repeat."

**Browser Tab Tycoon** is an idle management game that satirizes the life of a web developer. Manage your browser resources, open tabs to generate income, and upgrade your rig to withstand the sheer weight of unoptimized web pages. But be careful—open too many tabs, and your browser *will* crash, taking your unsaved progress with it.

## 🎮 How to Play

1.  **Open New Tabs**: Click the blue button to open tabs. Each tab generates passive income (virtual dollars).
2.  **Watch Your Resources**:
    *   **RAM**: Used by every tab. If you run out, your system starts swapping, and efficiency plummets.
    *   **CPU**: Used by JavaScript on tabs. High CPU load causes lag and increases crash risk.
3.  **Tycoon Upgrades**:
    *   **Download More RAM**: Increases memory capacity.
    *   **Overclock CPU**: Increases processing power (at a risk?).
    *   **Adblock Premium**: Increases income per tab (by blocking resource-hogging ads and running *your* miners instead).
    *   **Dark Mode**: cool down your CPU usage because pixels are darker.
4.  **Avoid Crashes**: If your efficiency drops too low (lag), your browser might crash. A crash closes 50% of your tabs and loses 50% of your money.

## 🛠️ Tech Stack

This project is built to demonstrate modern web performance and state management techniques:

*   **Framework**: [SvelteKit](https://kit.svelte.dev/)
*   **State Management**: Svelte 5 Runes (`$state`, `$derived`, `$effect`)
*   **Performance**: Game loop and heavy calculations run in a **Web Worker** to keep the UI thread responsive (mostly).
*   **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
*   **Persistence**: `localStorage` auto-saving.

## 🚀 Development

### Prerequisites
*   Node.js (LTS version recommended)
*   npm / pnpm / bun

### Quick Start

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev
```

Navigate to `http://localhost:5173` to start playing.

### Building for Production

To create a production version of the app:

```bash
bun run build
```

You can preview the production build with:

```bash
bun run preview
```

## ⚠️ Known Issues
*   Memory leaks are simulated and intentional.
*   If the browser freezes, it's a feature, not a bug.
*   The entire game concept is functionally useless.