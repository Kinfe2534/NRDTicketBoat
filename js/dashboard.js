$(window).on("load", function () {
  console.log("Hi, I am Purchase Tracker Dashboard.js :)");
});
$("#add_sample_record").on("click", async function () {
  try {
    chrome.runtime.sendMessage({ cmd: "add_sample_record", content: "" });
  } catch (err) {
    console.warn({ where: "Error in Dashboard add_record", e: err });
  }
});

$("#clear_all_records").on("click", function () {
  try {
    clearAll();
    udpate_table();
  } catch (err) {
    console.warn({ where: "Error in Dashboard clearAll", e: err });
  }
});

// display data in the dashboard table
function dashboard_table(indexeddb_data) {
  // clear table content first
  $("#dashboard_table_container").empty();
  // add table head
  $("#dashboard_table_container").append(`
  
          <table class="table table-striped">
                  <thead>
                      <tr>
                          <th scope="col">S/No</th>
                          <th scope="col">Buyer Email</th>
                          <th scope="col">Created</th>
                          <th scope="col">Type</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Funding Method</th>
                          <th scope="col">Last Four Digits</th>
              
                      </tr>
                  </thead>
              <tbody id="tbody_get">           
      
              </tbody>
          </table>`);

  // populate table body
  indexeddb_data.forEach((tm_confirmation_res, index, arry) => {
    $("#tbody_get").append(
      `<tr>
        <th scope="row">${index + 1}</th>
        <td>${tm_confirmation_res.email}</td>
        <td>${tm_confirmation_res.created}</td>
        <td>${tm_confirmation_res.type}</td>
        <td>$${(Number(tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
        <td>${tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>
        <td>${tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].fundingMethod}</td>
        <td>${tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].ccLast4Digits}</td>
        
    </tr>`
    );
  });
}

let initialize_table = setInterval(() => {
  if (db) {
    console.log("db found");
    clearInterval(initialize_table);
    udpate_table();
  } else {
    console.log("no db yet");
  }
}, 100);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "indexeddb_updated") {
    udpate_table();
  }
});
async function udpate_table() {
  readAll().then((result) => {
    dashboard_table(result);
  });
}
