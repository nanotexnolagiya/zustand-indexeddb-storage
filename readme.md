# zustand-indexeddb-storage

[![NPM Version](https://img.shields.io/npm/v/zustand-indexeddb-storage.svg)](https://www.npmjs.com/package/zustand-indexeddb-storage)
[![License](https://img.shields.io/npm/l/zustand-indexeddb-storage.svg)](https://www.npmjs.com/package/zustand-indexeddb-storage)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/zustand-indexeddb-storage/ci.yml)](https://github.com/nanotexnolagiya/zustand-indexeddb-storage/actions)

`zustand-indexeddb-storage` is a plugin for [Zustand](https://github.com/pmndrs/zustand) that allows you to persist your store's state in IndexedDB. This package makes it easy to maintain state across sessions and browser tabs.

## Features

- **Persist Zustand State in Indexed DB**: Save and load Zustand state from Indexed DB automatically.
- **Lightweight**: Minimalistic design with a small footprint.

## Installation

Install the package via npm or yarn:

```bash
npm install zustand-indexeddb-storage
# or
yarn add zustand-indexeddb-storage
```

## Example
```javascript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { indexedDBStorage } from "zustand-indexeddb-storage";

const useMainStore = create(
  persist(
    (...args) => ({
      ...locationSlice(...args),
      ...profileSlice(...args),
    }),
    {
      name: "main",
      storage: createJSONStorage(() => indexedDBStorage),
      partialize(state) {
        return {
          basketIds: state.basketIds
        };
      },
    }
  )
);
export default useMainStore;
```
---
![An Example](./example-of-indexeddb.png)
