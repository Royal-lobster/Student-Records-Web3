<script lang="ts">
  export let entries: any;
</script>

<table>
  <thead>
    <tr>
      <th>Entry</th>
      <th>Timestamp</th>
    </tr>
  </thead>
  <tbody>
    {#each entries as entry}
      <tr>
        <td>{entry}</td>
        <td>TODO</td>
      </tr>
    {/each}
  </tbody>
</table>
