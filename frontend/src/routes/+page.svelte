<script>
  import Concept from "$lib/components/Home/Concept.svelte";
  import Hero from "$lib/components/Home/Hero.svelte";
  import UsesAndLimitations from "$lib/components/Home/UsesAndLimitations.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
</script>

<div>
  <nav
    class="flex flex-col justify-center flex-wrap items-center w-full mb-16 mt-10 border-b-[1px] border-black/10 pb-4"
  >
    <img src="/images/jntugv-logo.svg" alt="logo" width="45px" />
    <h2 class="text-lg text-center md:text-2xl">
      Jawaharlal Nehru Technological University - Gurajada, Vizianagaram
    </h2>
    <h1 class="text-lg text-center md:text-2xl text-neutral">
      Student Record Management System
    </h1>
  </nav>

  <Hero />
  <Concept />
  <UsesAndLimitations />
</div>
