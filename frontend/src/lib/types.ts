export type RecordDetails = {
  name: string;
  description: string;
};
export type ToastData = {
  message: string;
  type: "success" | "error" | "info" | "warning";
};
export type RecordDetailsFull = {
  name: string;
  description: string;
  maintainer: string;
  id: number;
  ipfs_structure: string;
};

export type Entry = {
  record_id: string;
  entry_id: string;
  recipient: string;
  acknowledged: boolean;
  ipfsHash: string;
};

export type EntryExpanded = Record<string, string> & Entry;
