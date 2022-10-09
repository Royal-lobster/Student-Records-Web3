<script lang="ts">
  import { BigNumber, type ContractReceipt } from "ethers";
  export let transactionResult: ContractReceipt | null = null;
  export let additionalData: Array<[string, string]> = [];
</script>

<table class="table-auto table-zebra  w-full table-compact">
  <tbody>
    <tr>
      <th class="text-left"> Transaction Hash:</th>
      <td class="break-all">{transactionResult?.transactionHash}</td>
    </tr>
    <tr>
      <th class="text-left">Block Number</th>
      <td>{transactionResult?.blockNumber}</td>
    </tr>
    <tr>
      <th class="text-left">Gas Used</th>
      <td>{BigNumber.from(transactionResult?.gasUsed).toString()}</td>
    </tr>
    {#each additionalData as [key, value]}
      <tr>
        <th class="text-left">{key}</th>
        <td>{value}</td>
      </tr>
    {/each}
  </tbody>
</table>
