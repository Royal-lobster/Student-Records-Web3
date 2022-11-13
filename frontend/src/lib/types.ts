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
};

export type Entries = {
  recipient: string;
  ipfsHash: string;
  acknowledged: boolean;
};

export type EntriesExpanded = {
  [key in ipfsDataKeys]: string;
} & {
  recipient: string;
  acknowledged: boolean;
};

export enum ipfsDataKeys {
  Name = "Name",
  Email = "Email",
  Company = "Company",
  Designation = "Designation",
  Package = "Package (LPA)",
}
