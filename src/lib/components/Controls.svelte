<script lang="ts">
    import { game } from '$lib/game.svelte';
</script>

<div class="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 border-t-2 border-gray-700 backdrop-blur z-40">
    <div class="max-w-2xl mx-auto flex gap-4 justify-center items-center">
        
        <button 
            onclick={() => game.openTab()}
            class="group relative flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            disabled={game.efficiency < 0.1}
        >
            <div class="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <span class="relative text-lg md:text-xl flex items-center justify-center gap-2">
                <span>Open New Tab</span>
                <span class="text-xs bg-blue-800 px-2 py-1 rounded inline-block">+Tabs</span>
            </span>
            
            {#if game.efficiency < 0.5}
                <span class="absolute top-0 right-0 p-1 text-[10px] text-red-200 bg-red-800 rounded-bl">LAGGING</span>
            {/if}
        </button>

        <button 
            onclick={() => game.closeTab()}
            class="bg-red-900/50 hover:bg-red-800 text-red-200 font-mono py-4 px-4 rounded-lg border border-red-800 transition-colors"
            title="Close Tab (Panic Button)"
        >
            <span class="text-xl">X</span>
        </button>

    </div>
</div>
