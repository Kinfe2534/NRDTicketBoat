// create purchase tracker db

let db = null;

const objectStoreName = "TM_Objectstore";

const request = indexedDB.open("PurchaseTracker", 3);

request.onerror = function (event) {
  console.log("Problem opening PurchaseTracker DB.");
};

request.onupgradeneeded = function (event) {
  console.log("PurchaseTracker DB onupgradeneeded event triggered :).");
  db = event.target.result;

  let objectStore = db.createObjectStore(objectStoreName, { autoIncrement: true });

  objectStore.transaction.oncomplete = function (event) {
    console.log("PurchaseTraccker DB ObjectStore Created.");
  };
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("PurchaseTracker DB OPENED.");

  db.onerror = function (event) {
    console.log("PurchaseTracker FAILED TO OPEN DB.");
    console.log(event);
  };
};
// Purchase Tracker Create Read Update Delete Operations on DB
function create(record) {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        console.log("ALL INSERT TRANSACTIONS COMPLETE.");
        resolve(true);
      };

      transaction.onerror = function () {
        console.log("PROBLEM INSERTING RECORDS.");
        resolve(false);
      };

      let request = objectStore.add(record);

      request.onsuccess = function () {
        console.log("Added: ", record);
      };
    });
  }
}
function read(record) {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        console.log("ALL READ TRANSACTIONS COMPLETE.");
      };

      transaction.onerror = function () {
        console.log("PROBLEM READING RECORDS.");
      };

      let request = objectStore.get(record);

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
    });
  }
}

function update(record) {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        console.log("ALL UPDATE TRANSACTIONS COMPLETE.");
        resolve(true);
      };

      transaction.onerror = function () {
        console.log("PROBLEM UPDATING RECORDS.");
        resolve(false);
      };

      objectStore.put(record);
    });
  }
}

function remove(record) {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        console.log("ALL DELETE TRANSACTIONS COMPLETE.");
        resolve(true);
      };

      transaction.onerror = function () {
        console.log("PROBLEM DELETE RECORDS.");
        resolve(false);
      };

      objectStore.delete(record);
    });
  }
}

function readAll() {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        //console.log("ALL READ TRANSACTIONS COMPLETE.");
      };

      transaction.onerror = function () {
        console.log("PROBLEM READING RECORDS.");
      };

      let request = objectStore.getAll();

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
    });
  }
}

function clearAll() {
  if (db) {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = function () {
        console.log("ALL DELETE TRANSACTIONS COMPLETE.");
        resolve(true);
      };

      transaction.onerror = function () {
        console.log("PROBLEM DELETE RECORDS.");
        resolve(false);
      };

      objectStore.clear();
    });
  }
}

