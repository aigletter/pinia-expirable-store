import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import defineExpirableStore from "./ExpirableStore";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export type { ExpirableStore } from "./types/ExpirableStore";

export default defineExpirableStore;