import { type Context as Context_, createDefine } from "fresh";

type State = { userId: number };
export type Context = Context_<State>;
export const define = createDefine<State>();
