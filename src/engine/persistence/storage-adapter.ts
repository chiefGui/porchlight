export type StorageAdapter = {
	load<T>(key: string): Promise<T | null>;
	save<T>(key: string, data: T): Promise<void>;
	delete(key: string): Promise<void>;
	clear(): Promise<void>;
};

export class IndexedDBAdapter implements StorageAdapter {
	private db: IDBDatabase | null = null;
	private readonly storeName = "gameState";

	constructor(private readonly dbName: string) {}

	private async getDB(): Promise<IDBDatabase> {
		if (this.db) {
			return this.db;
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);

			request.onerror = () => reject(request.error);

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});
	}

	async load<T>(key: string): Promise<T | null> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, "readonly");
			const store = transaction.objectStore(this.storeName);
			const request = store.get(key);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result ?? null);
		});
	}

	async save<T>(key: string, data: T): Promise<void> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.put(data, key);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async delete(key: string): Promise<void> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(key);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async clear(): Promise<void> {
		const db = await this.getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.storeName, "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.clear();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
}
