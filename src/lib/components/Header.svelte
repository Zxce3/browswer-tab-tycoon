<script lang="ts">
    import { game } from '$lib/game.svelte';

    // Formatters
    const fmtMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    const fmtMem = (n: number) => n > 1024 ? `${(n/1024).toFixed(1)} GB` : `${Math.floor(n)} MB`;
</script>

<header class="bg-gray-900 border-b-4 border-gray-700 p-4 sticky top-0 z-50 shadow-lg select-none">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 class="text-xl font-bold text-green-400 font-mono tracking-tighter">
            &lt;BrowserTabTycoon /&gt;
        </h1>
        
        <div class="flex flex-wrap gap-4 md:gap-8 items-center w-full md:w-auto">
            <!-- Stats -->
            <div class="flex-1 min-w-[120px]">
                <div class="text-xs text-gray-400 uppercase font-bold">Income</div>
                <div class="text-2xl font-mono text-yellow-400">{fmtMoney(game.money)}</div>
                <div class="text-xs text-green-600">+{fmtMoney(game.tabs * game.upgrades.adblock.effect(game.upgrades.adblock.level))}/s</div>
            </div>

            <!-- RAM Bar -->
             <div class="flex-1 min-w-[150px]">
                <div class="flex justify-between text-xs text-gray-400 font-bold mb-1">
                    <span>RAM ({fmtMem(game.ramUsage)})</span>
                    <span>{fmtMem(game.upgrades.ram.effect(game.upgrades.ram.level))}</span>
                </div>
                <div class="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                    <div 
                        class="absolute top-0 left-0 h-full transition-all duration-200"
                        style:width="{Math.min(100, (game.ramUsage / game.upgrades.ram.effect(game.upgrades.ram.level)) * 100)}%"
                        class:bg-blue-500={game.efficiency > 0.8}
                        class:bg-yellow-500={game.efficiency <= 0.8 && game.efficiency > 0.5}
                        class:bg-red-600={game.efficiency <= 0.5}
                    ></div>
                </div>
            </div>

             <!-- CPU Bar -->
             <div class="flex-1 min-w-[150px]">
                <div class="flex justify-between text-xs text-gray-400 font-bold mb-1">
                    <span>CPU Load</span>
                    <span>{game.cpuUsage.toFixed(0)} / {game.upgrades.cpu.effect(game.upgrades.cpu.level).toFixed(0)}%</span>
                </div>
                 <div class="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
                    <div 
                        class="absolute top-0 left-0 h-full transition-all duration-200"
                        style:width="{Math.min(100, (game.cpuUsage / game.upgrades.cpu.effect(game.upgrades.cpu.level)) * 100)}%"
                        class:bg-green-500={game.cpuUsage < game.upgrades.cpu.effect(game.upgrades.cpu.level) * 0.8}
                        class:bg-red-500={game.cpuUsage >= game.upgrades.cpu.effect(game.upgrades.cpu.level) * 0.8}
                    ></div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Lag Warning -->
    {#if game.efficiency < 1}
        <div class="mt-2 text-center text-xs font-bold text-red-400 animate-pulse bg-red-900/20 py-1 rounded">
            SYSTEM LAGGING! PERFORMANCE: {(game.efficiency * 100).toFixed(0)}%
        </div>
    {/if}
</header>
