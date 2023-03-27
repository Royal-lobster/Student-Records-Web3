<script>
  import { CheckDoubleFill, Dashboard3Line, Eye2Line } from "svelte-remixicon";
</script>

<section class="text-gray-900 body-font">
  <div class="container px-5 py-24 mx-auto">
    <h1
      class="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20"
    >
      Secure and Decentralized Data Management
      <br class="hidden sm:block" /> Web Application
    </h1>
    <div
      class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6"
    >
      <div class="p-4 md:w-1/3 flex">
        <div
          class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary text-white mb-4 flex-shrink-0"
        >
          <Dashboard3Line size="25" />
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-800 text-lg title-font font-medium mb-2">
            Record Management Dashboard
          </h2>
          <p class="leading-relaxed text-base">
            Keep track of student records with our easy-to-use dashboard. Add
            new records, edit existing ones, and maintain complete control over
            the records at all times.
          </p>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex">
        <div
          class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary text-white mb-4 flex-shrink-0"
        >
          <CheckDoubleFill size="25" />
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-800 text-lg title-font font-medium mb-2">
            Acknowledgement System
          </h2>
          <p class="leading-relaxed text-base">
            Verify the authenticity of entries with our secure acknowledgement
            system. Recipients can acknowledge or unacknowledge entries and
            maintainers can't edit or delete acknowledged entries.
          </p>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex">
        <div
          class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-primary text-white mb-4 flex-shrink-0"
        >
          <Eye2Line size="25" />
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-800 text-lg title-font font-medium mb-2">
            Transparent
          </h2>
          <p class="leading-relaxed text-base">
            This project allows all parties involved to track the status of
            student records in real-time. This feature ensures that everyone has
            access to the same information, reducing the likelihood of errors or
            misunderstandings.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
