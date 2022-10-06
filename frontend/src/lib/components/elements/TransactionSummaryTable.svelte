<script lang="ts">
  import type { ContractReceipt } from "ethers";
  export let transactionResult: ContractReceipt | null = null;
  export let additionalData: Array<[string, string]>;
</script>

<div class="overflow-x-auto">
  <table class="table w-full table-compact">
    <tbody>
      <tr>
        <th> Transaction Hash:</th>
        <td>{transactionResult?.transactionHash}</td>
      </tr>
      <tr>
        <th>Block Number</th>
        <td>{transactionResult?.blockNumber}</td>
      </tr>
      <tr>
        <th>Gas Used</th>
        <td>{transactionResult?.gasUsed}</td>
      </tr>
      {#each additionalData as [key, value]}
        <tr>
          <th>{key}</th>
          <td>{value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
