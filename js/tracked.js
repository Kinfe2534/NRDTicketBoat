$(window).on("load", function () {
  console.log("Hi, I am Ticketboat tracked.js :)");
});
const tracked_data = [
  {
    id: "59ab151aa3ca436aa1aaa68f6f37bdc1",
    created: new Date().toISOString(),
    type: "tm_purchase_confirmation",
    data: {},
  },
  {
    id: "59ab151aa3ca436aa1aaa68f6f37bdc2",
    created: new Date().toISOString(),
    type: "tm_purchase_confirmation",
    data: {},
  },
  {
    id: "59ab151aa3ca436aa1aaa68f6f37bdc3",
    created: new Date().toISOString(),
    type: "tm_purchase_confirmation",
    data: {},
  },
  ,
  {
    id: "59ab151aa3ca436aa1aaa68f6f37bdc4",
    created: new Date().toISOString(),
    type: "tm_purchase_confirmation",
    data: {},
  },
];
let db = null;
const request = indexedDB.open("PurchaseTracker", 3);

request.onerror = function (event) {
  console.log("Problem opening PurchaseTracker DB.");
};

request.onupgradeneeded = function (event) {
  console.log("PurchaseTracker DB onupgradeneeded event triggered :).");
  db = event.target.result;

  let objectStore = db.createObjectStore("tm_confirmation_data", {
    keyPath: "id",
  });

  objectStore.transaction.oncomplete = function (event) {
    console.log("PurchaseTraccker DB ObjectStore Created.");
  };
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("PurchaseTracker DB OPENED.");
  insert_records(tracked_data);

  db.onerror = function (event) {
    console.log("PurchaseTracker FAILED TO OPEN DB.");
    console.log(event);
  };
};
function insert_records(tracked_data) {
  if (db) {
    const insert_transaction = db.transaction("tm_confirmation_data", "readwrite");
    const objectStore = insert_transaction.objectStore("tm_confirmation_data");

    return new Promise((resolve, reject) => {
      insert_transaction.oncomplete = function () {
        console.log("ALL INSERT TRANSACTIONS COMPLETE.");
        resolve(true);
      };

      insert_transaction.onerror = function () {
        console.log("PROBLEM INSERTING RECORDS.");
        resolve(false);
      };

      tracked_data.forEach((data) => {
        let request = objectStore.add(data);

        request.onsuccess = function () {
          console.log("Added: ", data);
        };
      });
    });
  }
}
