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

export type Entries = {
  recipient: string;
  ipfsHash: string;
  acknowledged: boolean;
};

export type EntriesExpanded = Record<string, string> & {
  recipient: string;
  acknowledged: boolean;
};
