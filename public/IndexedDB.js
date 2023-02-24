class IndexedDB {
  constructor(options) {
    this.options = options;
  }

  open() {
    return new Promise((resolve, reject) => {
      const openRequest = window.indexedDB.open(this.options.name, this.options.version);

      openRequest.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.error}`);
      };

      openRequest.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      openRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.options.storeName)) {
          db.createObjectStore(this.options.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  close() {
    this.db.close();
    this.db = null;
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.options.storeName, 'readwrite');
      const store = transaction.objectStore(this.options.storeName);
      const request = store.add(data);

      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.options.storeName, 'readwrite');
      const store = transaction.objectStore(this.options.storeName);
      const request = store.delete(id);

      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  get(id) {
    const transaction = this.db.transaction(this.options.storeName, 'readonly');
    const store = transaction.objectStore(this.options.storeName);
    const request = store.get(id);

    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  }

  getAll() {
    const transaction = this.db.transaction(this.options.storeName, 'readonly');
    const store = transaction.objectStore(this.options.storeName);
    const request = store.getAll();

    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  }

  update(id, data) {
    const transaction = this.db.transaction(this.options.storeName, 'readwrite');
    const store = transaction.objectStore(this.options.storeName);
    const request = store.put(data);

    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  }
}
