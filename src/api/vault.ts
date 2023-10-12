import { VaultEntry } from "@types";
import { client } from ".";

type SelectCrit = {
  // userId?: number | null,
  username?: string | null;
  title?: string | null;
  website?: string | null;
  notes?: string | null;
  folder?: string | null;
  createdAt?: Date | string | null;
  deletedAt?: Date | string | null;
  active?: boolean | null;
  deleted?: boolean | null;
};

export const selectVaultEntry = async (data: { id: number }): Promise<VaultEntry> => {
  const response = await client.post("/api/db/vault/select", data, { headers: { "Content-Type": "application/json" } });
  if (response.status !== 200) throw new Error(`Querying vault entry by id ${data.id} failed.`);
  // try to extract properties first, instead of returning immediately
  const { userId, username, title, website, notes, folder, createdAt, deletedAt, active, deleted } = response.data;
  return { userId, username, title, website, notes, folder, createdAt, deletedAt, active, deleted };
};

export const selectVaultEntries = async (data?: { ids?: number[]; crit?: SelectCrit }): Promise<VaultEntry[]> => {
  if (data == null) {
    data = {};
  }
  const response = await client.post("/api/db/vault/select", data, { headers: { "Content-Type": "application/json" } });
  if (response.status !== 200) throw new Error("Querying vault entries failed.");
  return response.data.map((el: any) => {
    const { userId, username, title, website, notes, folder, createdAt, deletedAt, active, deleted } = el;
    return { userId, username, title, website, notes, folder, createdAt, deletedAt, active, deleted };
  });
};
