<script lang="ts">
  import "../app.css";
  import { toastData } from "$lib/store/toast";
  import Toast from "$lib/components/elements/Toast.svelte";
  //@ts-ignore
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import { attachRecordContract } from "$lib/shared/attach-contract";

  attachRecordContract();

  NProgress.configure({
    minimum: 0.16,
  });

  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }
</script>

<div class="container max-w-7xl mx-auto px-5">
  <slot />
  {#if $toastData}
    <Toast type={$toastData.type}>
      {$toastData.message}
    </Toast>
  {/if}
</div>
