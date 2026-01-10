<script lang="ts">
   import { game } from '$lib/game.svelte';

   // Visual cap for tabs to prevent DOM explosion
   const DISPLAY_CAP = 48;
   
   // Derive visual tabs array
   let visualTabs = $derived(Array(Math.min(game.tabs, DISPLAY_CAP)).fill(0));
   let overflow = $derived(Math.max(0, game.tabs - DISPLAY_CAP));
</script>

<div class="w-full p-4 overflow-hidden">
    <!-- Browser Toolbar Simulation -->
    <div class="flex items-center gap-2 mb-4 bg-gray-800 p-2 rounded-t-lg border-b border-gray-700">
        <div class="flex gap-1.5 ml-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 bg-gray-900 h-8 rounded ml-4 flex items-center px-3 text-xs text-gray-400 font-mono overflow-hidden">
            https://localhost:3000/how-to-center-div
        </div>
    </div>

    <!-- Tab Container -->
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1 md:gap-2 auto-rows-fr">
        {#each visualTabs as _, i}
            <div 
                class="aspect-[4/3] bg-white rounded-t-md relative shadow hover:-mt-2 transition-all duration-300 group border-t-2 overflow-hidden"
                class:border-blue-500={i % 3 === 0}
                class:border-orange-500={i % 3 === 1}
                class:border-purple-500={i % 3 === 2}
                 style:opacity={1 - (i / DISPLAY_CAP) * 0.5} 
            >
                <!-- Favicon -->
                <div class="absolute top-1 left-2 w-3 h-3 rounded-full bg-gray-200 group-hover:bg-blue-200"></div>
                <!-- Title Lines -->
                <div class="absolute top-6 left-2 right-2 space-y-1">
                    <div class="h-1 bg-gray-100 rounded w-3/4"></div>
                    <div class="h-1 bg-gray-100 rounded w-1/2"></div>
                </div>
                
                <!-- Spinner wrapper for "loading" effect -->
                 <div class="absolute inset-0 flex items-center justify-center bg-gray-50/50 opacity-0 group-hover:opacity-100">
                    <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
            </div>
        {/each}

        {#if overflow > 0}
            <div class="aspect-[4/3] bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-gray-400 font-bold text-xs">
                +{overflow} Tabs
            </div>
        {/if}
    </div>
</div>
