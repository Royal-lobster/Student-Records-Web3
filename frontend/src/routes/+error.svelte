<script lang="ts">
  import { page } from "$app/stores";
</script>

<div
  class="grid place-content-center absolute top-0 left-0 w-screen  h-screen bg-red-500 text-white p-8"
>
  <h1 class="text-5xl font-extrabold text-white mb-5">
    {$page.status}: {$page.error?.message}
  </h1>
  <p>Sorry, but we couldn't load the page you were looking for.</p>
  <p>
    Maybe you want to go to <a class="underline underline-offset-4" href="/"
      >home</a
    >?
  </p>
</div>
