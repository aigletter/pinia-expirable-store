import {StoreRecord} from "./StoreRecord";

export interface ExpirableStore {
    get<T = unknown>(key: string, defaultValue?: T): T | undefined;
    set<T = unknown>(key: string, value: T, ttl?: number | null): void;
    has(key: string): boolean;
    remove(key: string): void;
    _storage: Record<string, StoreRecord>;
}