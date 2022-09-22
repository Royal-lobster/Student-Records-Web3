<script>
  import { readable } from 'svelte/store';
  import { createTable, Subscribe, Render } from 'svelte-headless-table';
  import { addTableFilter } from 'svelte-headless-table/plugins';

  const data = readable([
    {
      receiverAddress: '0xbe88abfc99de4d5cf6d335228256c81575cc7063',
      name: 'Blaise Wehner',
      rollNo: 1,
      email: 'blaise.wehner@hotmail.com',
      achievement: 'Winning the lottery',
      description: 'lorem ipsum dolor sit amet',
      acknowledged: true,
    },
    {
      receiverAddress: '0x8f2acf03c00d8e3f02d0d4cf6adef9dd80127ad7',
      name: 'Bridgette West',
      rollNo: 2,
      email: 'bridgette.west@hotmail.com',
      achievement: 'solving a rubik\'s cube',
      description: 'lorem ipsum dolor sit amet',
      acknowledged: false,
    }
  ]);

  const table = createTable(data, {
    tableFilter: addTableFilter(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Receiver Address',
      accessor: 'receiverAddress',
    }),
    table.column({
      header: 'Name',
      accessor: 'name',
    }),
    table.column({
      header: 'Roll No',
      accessor: 'rollNo',
    }),
    table.column({
      header: 'Email',
      accessor: 'email',
    }),
    table.column({
      header: 'Achievement',
      accessor: 'achievement',
    }),
    table.column({
      header: 'Description',
      accessor: 'description',
    }),
    table.column({
      header: 'Acknowledged',
      accessor: 'acknowledged',
    }),
  ]);

  const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  const { filterValue } = pluginStates.tableFilter;
</script>

<input type="text" bind:value={$filterValue} placeholder="Search rows..." />
<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <th {...attrs}>
                <Render of={cell.render()} />
              </th>
            </Subscribe>
          {/each}
          <th>Delete</th>
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe  attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
              <td {...attrs} class:matches={props.tableFilter.matches}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
          <td><button>delete</button></td>
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>

<style>
	table {
		border-spacing: 0;
		border-top: 1px solid black;
		border-left: 1px solid black;
	}
	th, td {
		border-bottom: 1px solid black;
		border-right: 1px solid black;
		padding: 0.5rem;
	}
  .matches {
    background: rgba(46, 196, 182, 0.2);
  }
</style>