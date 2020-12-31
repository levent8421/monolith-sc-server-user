const storage = sessionStorage;

export function storageSave(key, value) {
    return storage.setItem(key, value);
}

export function storageGet(key) {
    return storage.getItem(key);
}