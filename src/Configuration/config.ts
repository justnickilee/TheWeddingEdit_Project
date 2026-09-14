export const TasksStoreName = "Tasks";

export const VendorsStoreName = "Vendors";

export const GuestsStoreName = "Guests";

export const GuestTagsStoreName = "GuestTags";

export const WeddingStoreName = "Wedding";

export const DbConfig = Object({
    "IndexedDbName" : "TheWeddingEditDB",
    "IndexedDbVersion" : 6,
    "DbStoreNames": [TasksStoreName, VendorsStoreName, GuestsStoreName, WeddingStoreName],
});