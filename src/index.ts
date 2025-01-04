import { indexedDBInstance } from "./utils";

interface StateStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

type CustomObject = Record<string, any>;

export const indexedDBStorage: StateStorage = {
  getItem: async (key) => {
    const stores = (await indexedDBInstance.getStoreNames()).filter((store) =>
      store.startsWith(key)
    );
    const objectKeys: string[] = [];
    const storesRecordsPromises = stores.map((store) => {
      const objectKey = store.split("_").at(-1)!;
      objectKeys.push(objectKey);
      return indexedDBInstance.getAllRecords(objectKey);
    });

    const storesRecords = await Promise.all(storesRecordsPromises);

    const jsonValue = storesRecords.reduce((acc, records, index) => {
      const store = objectKeys[index];
      if (store.endsWith("[]")) {
        acc[store.replace("[]", "")] = records;
      } else {
        acc[store] = records.at(0);
      }
      return acc;
    }, {} as CustomObject);

    return JSON.stringify(jsonValue);
  },
  setItem: async (storeKey, value) => {
    const jsonValue = JSON.parse(value);
    const recordsPromises = Object.keys(jsonValue.state).map((key) => {
      let store = [storeKey, jsonValue.version, key].join("_");
      if (Array.isArray(jsonValue[key])) {
        store += "[]";
        return Promise.all(
          jsonValue[key].map((value) => {
            indexedDBInstance.clearStore(store);
            return indexedDBInstance.addRecord(store, value);
          })
        );
      }
      indexedDBInstance.clearStore(store);
      return indexedDBInstance.addRecord(store, jsonValue[key]);
    });
    await Promise.all(recordsPromises);
  },
  removeItem: async (key) => {
    const stores = await indexedDBInstance.getStoreNames();
    await Promise.all(
      stores
        .filter((store: string) => store.startsWith(key))
        .map((store) => indexedDBInstance.clearStore(store))
    );
  },
};
