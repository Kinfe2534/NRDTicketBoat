// create purchase tracker db

let db = null;

const request = indexedDB.open("PurchaseTracker", 3);

request.onerror = function (event) {
  console.log("Problem opening PurchaseTracker DB.");
};

request.onupgradeneeded = function (event) {
  console.log("PurchaseTracker DB onupgradeneeded event triggered :).");
  db = event.target.result;

  const objectStore_dashboard = db.createObjectStore("dashboard", { autoIncrement: true });
  const objectStore_config = db.createObjectStore("config", { keyPath: "key" });

  objectStore_dashboard.transaction.oncomplete = function (event) {
    console.log("PurchaseTraccker DB ObjectStore Dashboard Created.");
  };
  objectStore_config.transaction.oncomplete = function (event) {
    console.log("PurchaseTraccker DB ObjectStore Config Created .");
  };
};

request.onsuccess = async function (event) {
  db = event.target.result;
  console.log("PurchaseTracker DB OPENED.");

  db.onerror = function (event) {
    console.log("PurchaseTracker FAILED TO OPEN DB.");
    console.log(event);
  };
  let result = await read("buyer_email", "config");
  if (result == null) {
    console.log("No email :", result);
    create({ key: "buyer_email", email: "john.doe@ticketboat.com" }, "config");
  } else if (result["email"] === "john.doe@ticketboat.com") {
    console.log("default email :", result["email"]);
  } else {
    console.log("configured email :", result["email"]);
  }
};
// Purchase Tracker Create Read Update Delete Operations on DB
function create(record, objectStoreName) {
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
function read(keyPath, objectStoreName) {
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

      let request = objectStore.get(keyPath);

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
    });
  }
}

function update(record, objectStoreName) {
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

function remove(record, objectStoreName) {
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

function readAll(objectStoreName) {
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

function clearAll(objectStoreName) {
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
