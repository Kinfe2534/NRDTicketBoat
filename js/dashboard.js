$(window).on("load", function () {
  console.log("Hi, I am Purchase Tracker Dashboard.js :)");
});
$("#add_record").on("click", async function () {
  try {
    let result = await chrome.storage.local.get(["buyer_email"]);
    if (result.buyer_email) {
      sample_data.email = result.buyer_email;
    } else {
      sample_data.email = "john.doe@ticketboat.com";
    }
    create(sample_data);
  } catch (err) {
    console.warn({ where: "Error in Dashboard add_record", e: err });
  }
});
$("#display_record").on("click", function () {
  try {
    readAll();
  } catch (err) {
    console.warn({ where: "Error in Dashboard readAll", e: err });
  }
});
$("#clear_all_records").on("click", function () {
  try {
    clearAll();
  } catch (err) {
    console.warn({ where: "Error in Dashboard clearAll", e: err });
  }
});
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
// display data in the dashboard table
function dashboard_table(stored_data) {
  // clear table content first
  $("#dashboard_table_container").empty();
  // add table head
  $("#dashboard_table_container").append(`
  
          <table class="table table-striped">
                  <thead>
                      <tr>
                          <th scope="col">S/No</th>
                          <th scope="col">Buyer Email</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Quantity</th>
              
                      </tr>
                  </thead>
              <tbody id="tbody_get">           
      
              </tbody>
          </table>`);

  // populate table body
  stored_data.forEach((element, index, arry) => {
    $("#tbody_get").append(
      `<tr>

    <th scope="row">${index + 1}</th>
    <td>${element.email}</td>
    <td>$${(Number(element.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
    <td>${element.data.data.getSessionStatus.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>

    </tr>`
    );
  });
}
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

const sample_data = {
  id: "59ab151aa3ca436aa1aaa68f6f37bdc4",
  created: new Date().toISOString(),
  type: "tm_purchase_confirmation",
  email: "john.doe@ticketboat.com",
  data: {
    data: {
      getSessionStatus: {
        errors: null,
        requestId: "59ab151aa3ca436aa1aaa68f6f37bdc2",
        status: "PURCHASE_SUCCESS",
        purchaseStatusResponse: {
          clubSiteId: null,
          deliveryData: {
            deliveryMethod: null,
            deliveryTax: null,
            description: "Get in with:",
            id: "1073",
            isETicket: true,
            name: "eTickets",
            price: {
              value: 0.0,
              subCurrencyValue: 0,
              currencyCode: "USD",
            },
            subDeliveryOptions: [
              {
                id: "1074",
                name: "Mobile",
                description: "Your phone's your ticket. Locate your tickets in your account - or in your app. When you go mobile, your tickets will not be emailed to you or available for print.",
              },
            ],
            type: "ETICKET",
          },
          encryptedMemberOrderNumber: "Z7IVgZOxvZ16kAs1Ae9",
          errors: [],
          eventData: {
            actOverrideId: 3100091,
            eventDate: "2024-07-12T22:30:00Z",
            eventEndDate: null,
            eventId: "08006030BA04236A",
            eventType: "STANDARD",
            hasStaticMap: true,
            healthCheckMessage: null,
            id: "vv1AFZkZYGkeBveun",
            image: "https://s1.ticketm.net/dam/a/771/58eb5559-dd52-46f0-b84c-361123282771_RETINA_PORTRAIT_16_9.jpg",
            isFanToFanExchange: false,
            isResaleEligible: null,
            isSpanMultipleDays: false,
            localDate: "2024-07-12",
            localTime: "18:30:00",
            name: "MOTHER MOTHER & CAVETOWN",
            onsaleDate: "2024-01-26T15:00:00Z",
            primaryAttraction: {
              id: "K8vZ917Gydf",
              legacyId: "1125964",
              imageHref: "https://s1.ticketm.net/dam/a/771/58eb5559-dd52-46f0-b84c-361123282771_RETINA_PORTRAIT_16_9.jpg",
              name: "Mother Mother",
              organizationId: null,
            },
            primaryCategory: {
              classification: "segment",
              hostId: "8194",
              id: "KZFzniwnSyZfZ7v7nJ",
              name: "Music",
            },
            promoter: "LIVE NATION MUSIC",
            promoterCategory: "LIVENATION",
            promoterId: "653",
            promoterIds: ["653"],
            quaternaryCategory: {
              id: "KZAyXgnZfZ7v7nI",
              name: "Undefined",
              classification: "type",
            },
            quinaryCategory: {
              id: "KZFzBErXgnZfZ7v7lJ",
              name: "Undefined",
              classification: "subType",
            },
            secondaryAttraction: {
              id: "K8vZ91792L7",
              legacyId: "2519721",
              imageHref: null,
              name: "Cavetown",
            },
            subCategory: {
              classification: "genre",
              hostId: "31",
              hostName: "CONCERTS:ROCK/POP",
              id: "KnvZfZ7vAeA",
              name: "Rock",
            },
            tertiaryCategory: {
              id: "KZazBEonSMnZfZ7v6F1",
              name: "Pop",
              classification: "subGenre",
            },
            transferable: true,
            url: "https://www.ticketmaster.com/mother-mother-cavetown-sterling-heights-michigan-07-12-2024/event/08006030BA04236A",
            venue: {
              address: {
                city: "Sterling Heights",
                country: "United States Of America",
                countryCode: "US",
                postCode: "48312",
                region: "Michigan",
                regionCode: "MI",
                streetAddress: "14900 Metropolitan Parkway",
              },
              dmaId: 266,
              id: "KovZpZAJAlAA",
              name: "Michigan Lottery Amphitheatre at Freedom Hill",
              timezone: "America/New_York",
              tmId: "65757",
            },
          },
          hostUpsellEvents: [],
          locale: "en-us",
          orderFees: {
            currencyCode: "USD",
            subCurrencyValue: 550,
          },
          orderNumber: "25-58298/DET",
          parkingConfirmationUrl: "",
          paymentMethods: [
            {
              ccLast4Digits: "0573",
              chargeableAmount: {
                currencyCode: "USD",
                subCurrencyValue: 10160,
              },
              fundingMethod: "MASTERCARD",
              fundingSource: "creditcard",
            },
          ],
          sellerNotes: null,
          status: "SUCCESS",
          ticketOrderItems: [
            {
              adaTypes: null,
              endSeat: "50",
              inventoryDetail: {
                type: "Primary",
                resaleDetail: null,
              },
              isGeneralAdmission: true,
              quantityAvailable: null,
              row: "122",
              seatNames: ["49", "50"],
              section: "LWN3",
              startSeat: "49",
              ticketTypes: [
                {
                  description: "Standard Ticket",
                  id: "000000000001",
                  priceDetails: {
                    facilityCharges: {
                      currencyCode: "USD",
                      value: 0.0,
                    },
                    price: {
                      currencyCode: "USD",
                      value: 36.0,
                    },
                    serviceCharges: {
                      currencyCode: "USD",
                      value: 11.8,
                    },
                    taxDetails: {
                      faceValueTax: {
                        currencyCode: "USD",
                        value: 0.25,
                      },
                      serviceChargeTax: {
                        currencyCode: "USD",
                        value: 0.0,
                      },
                      serviceChargeTax2: {
                        currencyCode: "USD",
                        value: 0.0,
                      },
                    },
                    taxes: {
                      currencyCode: "USD",
                      value: 0.25,
                    },
                  },
                  quantity: 2,
                },
              ],
            },
          ],
        },
      },
    },
  },
};

let initial_timer = setInterval(() => {
  if (db) {
    console.log("db found");
    clearInterval(initial_timer);
    readAll().then((result) => {
      dashboard_table(result);
    });
  } else {
    console.log("no db yet");
  }
}, 100);
let update_timer = setInterval(() => {
  if (db) {
    //console.log("db found");
    readAll().then((result) => {
      dashboard_table(result);
    });
  } else {
    console.log("no db yet");
  }
}, 100);
