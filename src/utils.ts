const storeDatabase = 'zustand-indexedDB-storage'

class IndexedDBHelper {
    private dbName: string;
    private dbVersion: number;
  
    constructor(dbName: string, dbVersion: number = 1) {
      this.dbName = dbName;
      this.dbVersion = dbVersion;
    }
  
    // Open or upgrade the database
    async openDB(storeNames: string[]): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = request.result;
          for (const storeName of storeNames) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            }
          }
        };
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    async getStoreNames(): Promise<string[]> {
      const db = await this.openDB([])
      return Array.from(db.objectStoreNames)
    }

    drop () {
      indexedDB.deleteDatabase(storeDatabase)
    }
  
    // Add a record
    async addRecord(storeName: string, record: any): Promise<IDBValidKey> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add(record);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    // Get a record by ID
    async getRecord(storeName: string, id: IDBValidKey): Promise<any> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    // Update a record
    async updateRecord(storeName: string, record: any): Promise<void> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(record);
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    // Delete a record by ID
    async deleteRecord(storeName: string, id: IDBValidKey): Promise<void> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    // Clear all records in a store
    async clearStore(storeName: string): Promise<void> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    // Get all records in a store
    async getAllRecords(storeName: string): Promise<any[]> {
      const db = await this.openDB([storeName]);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
export const indexedDBInstance = new IndexedDBHelper(storeDatabase)