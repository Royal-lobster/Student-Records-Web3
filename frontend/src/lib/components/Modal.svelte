<script lang="ts">
  export let open: boolean = false;
  export let title: string = "";

  import { onMount } from "svelte";

  let toggle: HTMLInputElement;
  onMount(() => {
    if (open) toggle.checked = open;
    else toggle.checked = false;
  });

  $: if (open && toggle) toggle.checked = open;
</script>

<input type="checkbox" hidden bind:this={toggle} class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="font-bold text-lg">{title}</h3>
    <div class="py-4">
      <slot />
    </div>
  </div>
</div>
