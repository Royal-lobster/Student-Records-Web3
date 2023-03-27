import { toast } from "$lib/store/toast";

export const isCSVResultValid = (
  result: Record<string, string>[],
  tableStructure: { name: string; type: string }[]
) => {
  // check if results have a column full of eth addresses
  const ethAddrRegex = /^0x[a-fA-F0-9]{40}$/;

  // check if recipient column exists and is full of eth addresses
  const recipientColumnExists = result.every(
    (row) => row.recipient && ethAddrRegex.test(row.recipient)
  );

  if (!recipientColumnExists) {
    if (!result.every((row) => Object.keys(row).includes("recipient"))) {
      toast({
        message: "column 'recipient' does not exist",
        type: "error",
      });
    } else if (!result.every((row) => ethAddrRegex.test(row.recipient))) {
      toast({
        message: "Recipient column is not full of ethereum addresses",
        type: "error",
      });
    }

    return false;
  }

  const nonMatches: string[] = [];

  // except for recipient column, check if all other columns are in tableStructure and follow the type
  const allColumnsExist = result // {column1: value1, column2: value2}
    .map((row) => Object.keys(row)) // [['column1', 'column2']]
    .flat() // ['column1', 'column2']
    .every((column) => {
      let res =
        column === "recipient" ||
        tableStructure.some((col) => col.name === column);
      if (!res) {
        nonMatches.push(column);
      }
      return res;
    }); // true

  if (!allColumnsExist) {
    toast({
      message:
        "Columns in csv file do not match table structure - " +
        nonMatches.join(", "),
      type: "error",
    });
    return false;
  }

  // check if all values are of the correct type
  const allValuesAreCorrectType = result.every((row) => {
    return Object.entries(row).every(([column, value]) => {
      if (column === "recipient") {
        return true;
      }

      const columnType = tableStructure.find(
        (col) => col.name === column
      )?.type;
      if (columnType === "text") {
        return typeof value === "string";
      } else if (columnType === "number") {
        return !isNaN(Number(value));
      } else if (columnType === "boolean") {
        return value === "true" || value === "false";
      } else if (columnType === "date") {
        return !isNaN(Date.parse(value));
      } else if (columnType === "email") {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(value);
      } else {
        nonMatches.push(column);
        return false;
      }
    });
  });

  if (!allValuesAreCorrectType) {
    toast({
      message: "Values in csv file are not of the correct type - " + nonMatches,
      type: "error",
    });
    return false;
  }

  toast({
    message: "Imported CSV file successfully",
    type: "success",
  });

  return true;
};
