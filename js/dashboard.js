$(window).on("load", function () {
  console.log("Hi, I am Purchase Tracker Dashboard.js :)");
});
$("#add_sample_record_tm").on("click", async function () {
  try {
    let result = await chrome.storage.local.get(["email"]);
    create({
      id: Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7),
      email: result["email"],
      created: new Date(),
      type: "purchase_confirmation_tm",
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
    });
  } catch (err) {
    console.warn({ where: "Error in Dashboard add_sample_record_tm", e: err });
  }
});
$("#add_sample_record_etix").on("click", async function () {
  try {
    let result = await chrome.storage.local.get(["email"]);
    create({
      id: Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7),
      email: result["email"],
      created: new Date(),
      type: "purchase_confirmation_etix",
      data: {},
    });
  } catch (err) {
    console.warn({ where: "Error in Dashboard add_sample_record_etix", e: err });
  }
});

$("#clear_all_records").on("click", function () {
  try {
    clearAll();
  } catch (err) {
    console.warn({ where: "Error in Dashboard clearAll", e: err });
  }
});

// display data in the dashboard table
function dashboard_table(indexeddb_data) {
  // clear table content first
  $("#table_container_tm").empty();
  $("#table_container_etix").empty();
  // add table title
  $("#table_container_tm").append(`<h1 class="display-4">Ticketmaster</h1>`);
  // add table head
  $("#table_container_tm").append(`
  
          <table class="table table-striped">
                  <thead>
                      <tr>
                         
                          <th scope="col">Id</th>
                          <th scope="col">Buyer Email</th>
                          <th scope="col">Created</th>
                          <th scope="col">Type</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Funding Method</th>
                          <th scope="col">Last Four Digits</th>
                          <th scope="col">Event Id</th>
                          <th scope="col">Event Date</th>
                          <th scope="col">Event Type</th>
                          <th scope="col">Event Link</th>
                          
              
                      </tr>
                  </thead>
              <tbody id="tbody_tm">           
      
              </tbody>
          </table>`);
  // add table title etix
  $("#table_container_tm").append(`<h1 class="display-4">Etix</h1>`);
  $("#table_container_etix").append(`
  
          <table class="table table-striped">
                  <thead>
                      <tr>
                       
                          <th scope="col">Id</th>
                          <th scope="col">Buyer Email</th>
                          <th scope="col">Created</th>
                          <th scope="col">Type</th>
                      
                          
              
                      </tr>
                  </thead>
              <tbody id="tbody_etix">           
      
              </tbody>
          </table>`);

  // populate table body
  indexeddb_data.forEach((stored_data, index, arry) => {
    if (stored_data.type === "purchase_confirmation_tm") {
      $("#tbody_tm").append(
        `<tr>
          <td>${stored_data.id}</td>
          <td>${stored_data.email}</td>
          <td style="max-width: 150px;" class="text-truncate">${stored_data.created}</td>
          <td>${stored_data.type}</td>
          <td>$${(Number(stored_data.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
          <td>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>
          <td>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].fundingMethod}</td>
          <td>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].ccLast4Digits}</td>
          <td>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.eventData.eventId}</td>
          <td style="max-width: 150px;" class="text-truncate">${stored_data.data.data.getSessionStatus.purchaseStatusResponse.eventData.eventDate}</td>
          <td>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.eventData.eventType}</td>
          <td style="max-width: 150px;" class="text-truncate"><a target='_blank' href=${stored_data.data.data.getSessionStatus.purchaseStatusResponse.eventData.url}>${stored_data.data.data.getSessionStatus.purchaseStatusResponse.eventData.url}</a></td>
          
          
      </tr>`
      );
    } else if (stored_data.type === "purchase_confirmation_etix") {
      $("#tbody_etix").append(
        `<tr>
          
          <td>${stored_data.id}</td>
          <td>${stored_data.email}</td>
          <td style="max-width: 150px;" class="text-truncate">${stored_data.created}</td>
          <td>${stored_data.type}</td>          
      </tr>`
      );
    }
  });
}

setInterval(() => {
  if (db) {
    readAll().then((result) => {
      dashboard_table(result);
    });
  } else {
    console.log("no db yet");
  }
}, 500);
