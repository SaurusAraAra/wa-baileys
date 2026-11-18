

import * as async_mutex_1 from 'async-mutex';
const makeMutex = () => {
    const mutex = new async_mutex_1.Mutex();
    return {
        mutex(code) {
            return mutex.runExclusive(code);
        }
    };
};

const makeKeyedMutex = () => {
    const map = new Map();
    return {
        async mutex(key, task) {
            let entry = map.get(key);
            if (!entry) {
                entry = { mutex: new async_mutex_1.Mutex(), refCount: 0 };
                map.set(key, entry);
            }
            entry.refCount++;
            try {
                return await entry.mutex.runExclusive(task);
            }
            finally {
                entry.refCount--;
                if (entry.refCount === 0 && map.get(key) === entry) {
                    map.delete(key);
                }
            }
        }
    };
};


export { makeMutex };
export { makeKeyedMutex };
