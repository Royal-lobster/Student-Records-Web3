<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let open: boolean;
  export let title: string = "";
  export let secondaryAction: (() => void) | null = null;
  export let primaryAction: (() => void) | null = null;
  export let primaryText: string = "";
  export let secondaryText: string = "";
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      dispatch("toggle");
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <input type="checkbox" hidden bind:checked={open} class="modal-toggle" />
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-5">{title}</h3>
      <slot />
      <div class="modal-action">
        {#if secondaryText}
          <button
            on:click={() => {
              if (secondaryAction) secondaryAction();
              dispatch("toggle");
            }}
            class="btn">{secondaryText}</button
          >
        {/if}
        {#if primaryText}
          <button
            on:click={primaryAction}
            disabled={loading}
            class={`btn ${loading && "loading"} btn-error`}
            >{primaryText}</button
          >
        {/if}
      </div>
    </div>
  </div>
{/if}
