export const kv = await Deno.openKv();

export type Kv = typeof kv;
