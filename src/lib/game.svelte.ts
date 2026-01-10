import { browser } from '$app/environment';
import  GameWorker from './workers/game.worker?worker';

export type UpgradeType = 'ram' | 'cpu' | 'adblock' | 'darkmode';

export interface Upgrade {
    id: UpgradeType;
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    level: number;
    effect: (level: number) => number;
}

export class GameState {
    // Resources
    money = $state(0);
    tabs = $state(1);
    
    // Stats (computed from worker or upgrades)
    ramUsage = $state(0);
    cpuUsage = $state(0);
    efficiency = $state(1);
    
    // Upgrades
    upgrades = $state<Record<UpgradeType, Upgrade>>({
        ram: {
            id: 'ram',
            name: 'Download More RAM',
            description: 'Increases your RAM capacity so you can hoard more tabs.',
            baseCost: 100,
            costMultiplier: 1.5,
            level: 1,
            effect: (lvl) => 4096 * Math.pow(1.5, lvl - 1)
        },
        cpu: {
            id: 'cpu',
            name: 'Overclock CPU',
            description: 'Risky? Maybe. Faster? Yes. Increases CPU capacity.',
            baseCost: 250,
            costMultiplier: 1.6,
            level: 1,
            effect: (lvl) => 100 * Math.pow(1.2, lvl - 1)
        },
        adblock: {
            id: 'adblock',
            name: 'Adblock Premium',
            description: 'Block ads to load content faster? No, replace them with your own crypto miners.',
            baseCost: 500,
            costMultiplier: 2,
            level: 1,
            effect: (lvl) => 1 + (lvl - 1) * 0.5
        },
        darkmode: {
            id: 'darkmode',
            name: 'Dark Mode Theme',
            description: 'Reduces eye strain and ironically cools down your CPU usage.',
            baseCost: 1000,
            costMultiplier: 1.8,
            level: 1,
            effect: (lvl) => Math.max(0.1, 1 - (lvl * 0.05)) // Reduces CPU cost multiplier
        }
    });

    // Worker
    private worker: Worker | null = null;
    private channel: BroadcastChannel | null = null;
    
    // Meta
    messages = $state<{id: number, text: string, type: 'info'|'error'|'success'}[]>([]);
    
    constructor() {
        if (browser) {
            this.channel = new BroadcastChannel('browser_tab_tycoon');
            this.channel.onmessage = (e) => {
                if (e.data?.type === 'SYNC') {
                    this.restoreState(e.data.payload);
                }
            };
            this.load();
            this.initWorker();
        }
    }

    private initWorker() {
        this.worker = new GameWorker();
        this.worker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'TICK') {
                this.handleTick(payload);
            }
        };
        this.start();
    }

    start() {
        this.worker?.postMessage({ type: 'START' });
        this.syncWorkerState();
    }

    stop() {
        this.worker?.postMessage({ type: 'STOP' });
    }

    private syncWorkerState() {
        console.log("Syncing worker state");
        this.worker?.postMessage({
            type: 'UPDATE_STATE',
            payload: {
                tabs: this.tabs,
                moneyPerTab: 1, // Base rate
                ramPerTab: 50, // 50MB per tab standard
                cpuPerTab: 2, // 2% CPU per tab standard (modifiers applied below)
                
                // Calculated stats sent to worker
                totalRam: this.upgrades.ram.effect(this.upgrades.ram.level),
                totalCpu: this.upgrades.cpu.effect(this.upgrades.cpu.level),
                adblockLevel: this.upgrades.adblock.effect(this.upgrades.adblock.level),
                
                // Modifiers
                // CPU cost is modified by Dark Mode (less usage)
                // We send the 'base' cost, but maybe we should send the modified cpuPerTab
                // Let's modify the cpuPerTab we send:
                // Base 2 * DarkModeReduction
                // DarkMode effect returns e.g. 0.9 (90% cost)
                // Wait, effect logic above: 1 - (lvl * 0.05). Lvl 1 = 0.95.
            }
        });
        
        // Re-send specific dynamic values that depend on logic
        // Actually, let's recalculate the payload cleanly
        const currentState = {
            tabs: this.tabs,
            moneyPerTab: 10,
            ramPerTab: 150, // Chrome needs more RAM
            cpuPerTab: 5 * this.upgrades.darkmode.effect(this.upgrades.darkmode.level),
            totalRam: this.upgrades.ram.effect(this.upgrades.ram.level),
            totalCpu: this.upgrades.cpu.effect(this.upgrades.cpu.level),
            adblockLevel: this.upgrades.adblock.effect(this.upgrades.adblock.level)
        };
        
        this.worker?.postMessage({
            type: 'UPDATE_STATE',
            payload: currentState
        });
    }

    private handleTick(payload: any) {
        this.money += payload.income;
        this.ramUsage = payload.ramUsage;
        this.cpuUsage = payload.cpuUsage;
        this.efficiency = payload.efficiency;

        if (payload.crashed) {
            this.triggerCrash();
        }
        
        // Auto-save every approx 5 seconds (50 ticks)
        if (Math.random() < 0.02) this.save();
    }

    triggerCrash() {
        this.addMessage("BROWSER CRASH! You lost 50% of your progress. Did you try turning it off and on again?", 'error');
        this.tabs = Math.max(1, Math.floor(this.tabs * 0.5));
        this.money = this.money * 0.5;
        this.syncWorkerState();
    }

    addMessage(text: string, type: 'info'|'error'|'success' = 'info') {
        const id = Date.now();
        this.messages.push({ id, text, type });
        if (this.messages.length > 5) this.messages.shift();
        
        setTimeout(() => {
            this.messages = this.messages.filter(m => m.id !== id);
        }, 3000);
    }

    // Actions
    openTab() {
        this.tabs++;
        this.syncWorkerState();
        this.save();
        
        const jokes = [
            "Opening StackOverflow...",
            "Checking Reddit...",
            "Another documentation tab...",
            "Centering a div...",
            "npm install..."  
        ];
        if (Math.random() < 0.1) this.addMessage(jokes[Math.floor(Math.random() * jokes.length)]);
    }

    closeTab() {
        if (this.tabs > 1) {
            this.tabs--;
            this.syncWorkerState();
            this.save();
        }
    }

    buyUpgrade(id: UpgradeType) {
        const upgrade = this.upgrades[id];
        const cost = this.getUpgradeCost(id);
        
        if (this.money >= cost) {
            this.money -= cost;
            this.upgrades[id].level++;
             // Force reactivity update if needed (deep reactivity handled by proxies usually, but map assignment is safe)
            this.syncWorkerState();
            this.save();
            this.addMessage(`Upgraded ${upgrade.name}!`, 'success');
        } else {
            this.addMessage("Not enough funds! Freelance harder!", 'error');
        }
    }

    getUpgradeCost(id: UpgradeType) {
        const u = this.upgrades[id];
        return Math.floor(u.baseCost * Math.pow(u.costMultiplier, u.level - 1));
    }
    
    // Persistence
    save(broadcast = true) {
        if (!browser) return;
        const data = {
            money: this.money,
            tabs: this.tabs,
            upgrades: {
                ram: this.upgrades.ram.level,
                cpu: this.upgrades.cpu.level,
                adblock: this.upgrades.adblock.level,
                darkmode: this.upgrades.darkmode.level,
            }
        };
        localStorage.setItem('browserTabTycoonSave', JSON.stringify(data));
        if (broadcast) {
            this.channel?.postMessage({ type: 'SYNC', payload: data });
        }
    }

    load() {
        if (!browser) return;
        const saved = localStorage.getItem('browserTabTycoonSave');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.restoreState(data);
            } catch (e) {
                console.error("Failed to load save", e);
            }
        }
    }

    restoreState(data: any) {
        this.money = data.money !== undefined ? data.money : 0;
        this.tabs = data.tabs || 1;
        if (data.upgrades) {
            this.upgrades.ram.level = data.upgrades.ram || 1;
            this.upgrades.cpu.level = data.upgrades.cpu || 1;
            this.upgrades.adblock.level = data.upgrades.adblock || 1;
            this.upgrades.darkmode.level = data.upgrades.darkmode || 1;
        }
        this.syncWorkerState();
    }
    
    reset() {
        // Hard reset
        this.money = 0;
        this.tabs = 1;
        this.upgrades.ram.level = 1;
        this.upgrades.cpu.level = 1;
        this.upgrades.adblock.level = 1;
        this.upgrades.darkmode.level = 1;
        this.save();
        this.syncWorkerState();
        this.addMessage("Game Reset. A fresh start!", 'info');
    }
}

export const game = new GameState();
