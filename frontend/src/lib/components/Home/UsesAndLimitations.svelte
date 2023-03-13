<script>
  import { CheckDoubleLine, DeleteBin5Fill } from "svelte-remixicon";
</script>

<section class="text-gray-900 body-font">
  <div class="container px-5 py-10 mx-auto flex flex-wrap">
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/2 md:w-full">
        <div
          class="flex border-2 rounded-lg text-white bg-neutral p-8 sm:flex-row flex-col"
        >
          <div
            class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-xl bg-primary text-white flex-shrink-0"
          >
            <CheckDoubleLine size="30" />
          </div>
          <div class="flex-grow">
            <h2 class="text-white text-2xl title-font font-medium mb-3">
              Advantages of the project
            </h2>
            <ul class="list-disc list-inside">
              <li class="mb-2">
                <span class="font-bold">Security:</span> The decentralized nature
                of blockchain makes it almost impossible for records to be tampered
                with or altered.
              </li>
              <li class="mb-2">
                <span class="font-bold">Transparency:</span> Each transaction on
                the blockchain is recorded and can be viewed by anyone, creating
                a transparent system.
              </li>
              <li class="mb-2">
                <span class="font-bold">Efficiency:</span> Using blockchain for student
                records can streamline processes and eliminate the need for intermediaries,
                saving time and resources.
              </li>
              <li class="mb-2">
                <span class="font-bold">Accessibility:</span> Blockchain provides
                a secure and accessible platform for storing records that can be
                accessed from anywhere in the world.
              </li>
              <li class="mb-2">
                <span class="font-bold">Immutable:</span> Once data is stored on
                the blockchain, it cannot be deleted or altered, providing a permanent
                record of student achievements.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/2 md:w-full">
        <div
          class="flex border-2 rounded-lg text-white bg-neutral p-8 sm:flex-row flex-col"
        >
          <div
            class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-lg bg-primary text-white flex-shrink-0"
          >
            <DeleteBin5Fill size="30" />
          </div>
          <div class="flex-grow">
            <h2 class="text-white text-2xl title-font font-medium mb-3">
              Limitations of the project
            </h2>
            <ul class="list-disc list-inside text-md">
              <li class="mb-2">
                <span class="font-bold"
                  >Requires paying gas fees for each transaction:</span
                > This can be overcome using a relayer.
              </li>
              <li class="mb-2">
                <span class="font-bold"
                  >Slower than traditional technologies:</span
                > This can be overcome using an indexer.
              </li>
              <li class="mb-2">
                <span class="font-bold">Only public records can be stored:</span
                > This limits the type of information that can be recorded.
              </li>
              <li class="mb-2">
                <span class="font-bold"
                  >Requires maintainers and recipients to maintain crypto
                  wallet:</span
                > This is addressed by use of web3Auth which allows sign in with
                any social media and uses the token to generate wallet address pairs
                securely.
              </li>
              <li class="mb-2">
                <span class="font-bold">Unpredictable cost per operations:</span
                > Although this is a limitation, it is still cheaper since we are
                using Polygon network.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
