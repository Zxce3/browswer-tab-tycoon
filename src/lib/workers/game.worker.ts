
let timer: ReturnType<typeof setInterval> | null = null;
let TICK_RATE = 100; // 10 ticks per second

interface ValidState {
    tabs: number;
    moneyPerTab: number;
    ramPerTab: number;
    cpuPerTab: number;
    totalRam: number;
    totalCpu: number;
    adblockLevel: number; // Multiplier
}

let currentState: ValidState = {
    tabs: 1,
    moneyPerTab: 1,
    ramPerTab: 50,
    cpuPerTab: 2,
    totalRam: 4096,
    totalCpu: 100,
    adblockLevel: 1
};

self.onmessage = (e: MessageEvent) => {
    if (e.data.type === 'START') {
        if (!timer) {
            timer = setInterval(tick, TICK_RATE);
        }
    } else if (e.data.type === 'STOP') {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    } else if (e.data.type === 'UPDATE_STATE') {
        currentState = { ...currentState, ...e.data.payload };
    }
};

function tick() {
    // Calculate Resource Usage
    const ramUsage = currentState.tabs * currentState.ramPerTab;
    const cpuUsage = currentState.tabs * currentState.cpuPerTab;
    
    // Performance Penalty
    let efficiency = 1.0;
    
    // RAM penalty: Exponential decay if over limit
    if (ramUsage > currentState.totalRam) {
        efficiency *= 0.1; // Swapping to disk, super slow
    }
    
    // CPU penalty: Linear scaling down
    if (cpuUsage > currentState.totalCpu) {
        // If 200 usage / 100 total = 2. Efficiency = 0.5
        efficiency *= (currentState.totalCpu / cpuUsage);
    }

    // Money Generation
    // Base * Multipliers * Efficiency * TimeFactor
    const baseIncome = currentState.tabs * currentState.moneyPerTab;
    const income = baseIncome * currentState.adblockLevel * efficiency * (TICK_RATE / 1000);

    // Crash Risk Calculation
    // Only if system is stressed
    let crashRisk = 0;
    if (efficiency < 0.5) {
        crashRisk = 0.005; // 0.5% chance per tick to crash if stressed
    }

    const payload = {
        income,
        ramUsage,
        cpuUsage,
        efficiency,
        crashed: Math.random() < crashRisk
    };

    self.postMessage({ type: 'TICK', payload });
}
