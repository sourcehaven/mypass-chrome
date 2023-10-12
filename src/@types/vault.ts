export type VaultEntry = {
  userId: number;
  username: string;
  title: string | null;
  website: string | null;
  notes: string | null;
  folder: string | null;
  createdAt: string;
  deletedAt: string | null;
  active: boolean;
  deleted: boolean;
};
