<div class="mt-10 animate-pulse">
  <div class="flex gap-4">
    {#each Array(4) as _}
      <div class="h-8 w-[calc(100vw/4)] bg-base-300 rounded" />
    {/each}
  </div>
  <div class="flex gap-4 mt-4">
    {#each Array(4) as _}
      <div class="h-80 w-[calc(100vw/4)] bg-base-300 rounded" />
    {/each}
  </div>
</div>
