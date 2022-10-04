<script lang="ts">
  import "../app.css";
  import { toastData } from "$lib/store/toast";
  import Toast from "$lib/components/elements/Toast.svelte";
</script>

<div class="max-w-7xl mx-auto px-5">
  <slot />
  {#if $toastData}
    <Toast type={$toastData.type}>
      {$toastData.message}
    </Toast>
  {/if}
</div>
