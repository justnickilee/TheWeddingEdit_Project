import { DbConfig } from '../Configuration/config.ts'
import type * as Types from '../Models/Types'
import type { DbResult } from '../Models/DbResult'
import * as Config from '../Configuration/config.ts'
import { useState } from 'react';
import uuid from 'react-uuid'

let database: IDBDatabase;

export function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const openDbRequest: IDBOpenDBRequest = window.indexedDB.open(DbConfig.IndexedDbName, DbConfig.IndexedDbVersion);

        openDbRequest.onerror = () => {
            reject('Encountered an error while attempting to open the database.');
        };

        openDbRequest.onsuccess = (event) => { 
            database = (event.target as IDBRequest).result;
            resolve((event.target as IDBRequest).result);
        };

        openDbRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;
            const storeNames: string[] = DbConfig.DbStoreNames;

            storeNames.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName))
                    db.createObjectStore(storeName, { keyPath: 'id' });
            });
        };
    });
}

export async function getWedding(): Promise<Types.Wedding | null> {
    const promiseStore = getDbPromiseStore(Config.WeddingStoreName, 'readonly');
    const wedding = await promiseStore.getAll<Types.Wedding>();

    if (wedding == null || wedding.length == 0)
        return null;

    return wedding[0];
}

export async function createWedding(wedding: Types.Wedding): Promise<DbResult> {
    if (wedding == null || wedding.id == null || wedding.title == null)
        return {
            wasSuccessful: false,
            message: 'Invalid event information.'
        };

    const promiseStore = getDbPromiseStore(Config.WeddingStoreName, 'readwrite');
    const result = await promiseStore.add(wedding, wedding.id);

    return {
        wasSuccessful: true,
        message: result.toString()
    };
}

export async function deleteWedding(wedding: Types.Wedding) : Promise<DbResult> {
    const promiseStore = getDbPromiseStore(Config.WeddingStoreName, 'readwrite');
    await promiseStore.delete(wedding.id);

    return {
        wasSuccessful: true,
        message: 'Deleted wedding.'
    }
}

export async function addGuest(newGuest: Types.Guest): Promise<DbResult> {
    if (newGuest == null || newGuest.id == null || newGuest.firstName == null)
        return {
            wasSuccessful: false,
            message: 'Invalid guest information.'
        };

    const promiseStore = getDbPromiseStore(Config.GuestsStoreName, 'readwrite');
    const result = await promiseStore.add(newGuest);

    return {
        wasSuccessful: true,
        message: result.toString()
    };
}


/*
    const result = useAddGuest({...});

    return <div>{result.message}</div>
*/

export function useAddGuest(newGuest: Types.Guest): DbResult {
    const [result, setResult] = useState<DbResult>({
        wasSuccessful: false,
        message: `pending`
    })

    const store = database.transaction(Config.GuestsStoreName, 'readwrite').objectStore(Config.GuestsStoreName);
    const newGuestRequest = store.add(newGuest);

    newGuestRequest.onsuccess = () => {
        const result: DbResult = {
            wasSuccessful: true,
            message: `New guest added: ${newGuest.firstName}`
        };

        setResult(result);
    };

    newGuestRequest.onerror = () => {
        const result: DbResult = {
            wasSuccessful: false,
            message: `Encountered an error while attempting to add new guest: ${newGuest.firstName}`
        };

        setResult(result);
    }

    return result;

}

export async function getGuests(): Promise<Types.Guest[]> {

    const promiseStore = getDbPromiseStore(Config.GuestsStoreName, 'readonly');
    return await promiseStore.getAll<Types.Guest>();

    // return new Promise<Types.Guest[]>((resolve, reject) => {
    //     getGuestsRequest.onsuccess = () => {
    //         const guests: Types.Guest[] = getGuestsRequest.result;
    //         guests.forEach(user => {
    //             console.log(user.firstName);
    //         });

    //         resolve(guests);
    //     };

    //     getGuestsRequest.onerror = () => {
    //         reject('Encountered an error while attempting to retrieve guests from the database.');
    //     };
    // });
}


function getDbPromiseStore(objectStoreName: string, mode: IDBTransactionMode) {
    function wrapInPromise<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (err) => {
                reject(err);
            };
        })
    };

    const store = database.transaction(objectStoreName, mode).objectStore(objectStoreName);

    return {
        getAll: function <T>() {
            return wrapInPromise<T[]>(store.getAll());
        },
        add: (newObject: any, key?: IDBValidKey) => {
            return wrapInPromise(store.add(newObject));
        },
        delete: (objectKey: any) => {
            return wrapInPromise(store.delete(objectKey));
        }
    };
}
