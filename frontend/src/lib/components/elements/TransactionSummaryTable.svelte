<script lang="ts">
  import type { ContractReceipt } from "ethers";
  export let transactionResult: ContractReceipt | null = null;
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
      <slot />
    </tbody>
  </table>
</div>
