<script lang="ts">
    import { game } from '$lib/game.svelte';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';
</script>

<div class="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    {#each game.messages as msg (msg.id)}
        <div 
            animate:flip
            in:fly={{ x: 50, duration: 300 }}
            out:fade
            class="p-3 rounded-lg shadow-xl border-l-4 backdrop-blur-md pointer-events-auto transform transition-all
            {msg.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' : 
             msg.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' : 
             'bg-gray-800/90 border-blue-500 text-gray-100'}"
        >
            <div class="text-sm font-medium">{msg.text}</div>
        </div>
    {/each}
</div>
