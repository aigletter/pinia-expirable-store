export interface StoreRecord<T = unknown> {
    expired: number | null;
    content: T;
}