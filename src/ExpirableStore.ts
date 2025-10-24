import {defineStore, StoreDefinition} from "pinia";
import {reactive} from "vue";
import {StoreOption} from "./types/StoreOption";
import {StoreRecord} from "./types/StoreRecord";
import {ExpirableStore} from "./types/ExpirableStore";

export default function defineExpirableStore(name: string, options: StoreOption = {}): StoreDefinition<string, {}, {}, ExpirableStore> {
    return defineStore(name, () => {
        const _storage = reactive<Record<string, StoreRecord>>({});

        const _isSession = (): boolean => {
            if (!options.persist || options.persist === true) {
                return false;
            }
            return options.persist.storage === sessionStorage;
        }


        const _isMemory = (): boolean =>
            !options.persist;

        const _isExpired = (record: StoreRecord): boolean => {
            if (_isMemory() || _isSession()) {
                return false;
            }
            const now = Math.floor(Date.now() / 1000);
            return typeof record.expired === 'number' && record.expired <= now;
        };

        const _getRecord = <T = unknown>(key: string): StoreRecord<T> | null => {
            const record = _storage[key] as StoreRecord<T> | undefined;
            if (!record) {
                return null;
            }
            if (_isExpired(record)) {
                remove(key);
                return null;
            }
            return record;
        };

        const set = <T = unknown>(key: string, value: T, ttl: number|null = null): void => {
            const expired = (_isSession() || ttl === null) ? null : Math.floor(Date.now() / 1000) + ttl;
            _storage[key] = { content: value, expired };
        };

        const get = <T = unknown>(key: string, defaultValue?: T): T | undefined => {
            const record = _getRecord<T>(key);
            if (record) {
                return record.content;
            }
            return typeof defaultValue === 'function'
                ? (defaultValue as () => T)()
                : defaultValue;
        };

        const has = (key: string): boolean => {
            return _getRecord(key) !== null;
        };

        const remove = (key: string): void => {
            delete _storage[key];
        };

        return { get, set, has, remove, _storage };
    }, options as any);
}