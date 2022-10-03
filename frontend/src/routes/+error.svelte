<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="grid place-content-center min-h-screen bg-red-500 text-white">
	<h1 class="text-5xl font-extrabold text-white mb-5">{$page.status}: {$page.error?.message}</h1>
	<p>Sorry, but we couldn't load the page you were looking for.</p>
	<p>Maybe you want to go to <a class="underline underline-offset-4" href="/">home</a>?</p>
</div>
