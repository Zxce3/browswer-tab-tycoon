<script lang="ts">
    import { game, type UpgradeType } from '$lib/game.svelte';

    const upgradeKeys = Object.keys(game.upgrades) as UpgradeType[];
    
    // Icons (simulated with emoji or simple svg for now)
    const icons: Record<string, string> = {
        ram: '💾',
        cpu: '⚡',
        adblock: '🛡️',
        darkmode: '🌙'
    };

    function getCost(key: UpgradeType) {
        return game.getUpgradeCost(key);
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-24">
    {#each upgradeKeys as key}
        {@const u = game.upgrades[key]}
        {@const cost = getCost(key)}
        {@const canAfford = game.money >= cost}

        <button 
            class="relative flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all duration-200 group
                {canAfford 
                    ? 'bg-gray-800 border-gray-600 hover:border-blue-400 hover:bg-gray-750 cursor-pointer shadow-md' 
                    : 'bg-gray-900 border-gray-800 opacity-60 cursor-not-allowed'}"
            onclick={() => canAfford && game.buyUpgrade(key)}
            disabled={!canAfford}
        >
            <div class="flex justify-between w-full mb-2">
                <span class="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{icons[key]}</span>
                <span class="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">Lvl {u.level}</span>
            </div>
            
            <h3 class="font-bold text-gray-200 group-hover:text-white">{u.name}</h3>
            <p class="text-xs text-gray-400 mt-1 min-h-[3rem]">{u.description}</p>
            
            <div class="mt-4 w-full flex justify-between items-center pt-2 border-t border-gray-700">
                <span class="text-yellow-400 font-mono font-bold">${new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(cost)}</span>
                <span class="text-[10px] uppercase tracking-wide text-gray-500 group-hover:text-blue-300">Upgrade</span>
            </div>
            
            <!-- Effect Preview -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-green-400 font-mono">
                Next: {key === 'ram' ? '+' : key === 'cpu' ? '+' : 'x'}{((u.costMultiplier - 1) * 100).toFixed(0)}%
            </div>
        </button>
    {/each}
</div>
