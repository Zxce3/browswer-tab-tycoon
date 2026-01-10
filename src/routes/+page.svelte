<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import Controls from '$lib/components/Controls.svelte';
    import TabGrid from '$lib/components/TabGrid.svelte';
    import Upgrades from '$lib/components/Upgrades.svelte';
    import Toaster from '$lib/components/Toaster.svelte';
</script>

<div class="min-h-screen bg-gray-950 text-gray-100 font-sans pb-40 selection:bg-green-500 selection:text-black">
    <Header />
    <Toaster />
    
    <main class="max-w-7xl mx-auto p-4 space-y-12 mt-8">
        
        <!-- Game Area / Workspace -->
        <section class="bg-gray-900/50 rounded-xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 font-mono text-9xl font-bold pointer-events-none select-none">
                404
            </div>
            
            <div class="flex justify-between items-end mb-6 relative z-10">
                <h2 class="text-2xl font-bold text-gray-400">Workspace</h2>
                <span class="text-xs font-mono text-gray-600">Memory Leak Detected...</span>
            </div>
            
            <TabGrid />
        </section>
        
        <!-- Shop -->
        <section>
            <div class="flex items-center gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-400">Hardware & Software Upgrades</h2>
                <div class="h-px bg-gray-800 flex-1"></div>
            </div>
            <Upgrades />
        </section>
        
    </main>

    <Controls />
</div>
