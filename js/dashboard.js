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
  } catch (err) {
    console.warn({ where: "Error in Dashboard clearAll", e: err });
  }
});

// display data in the dashboard table
function dashboard_table(tm_confirmaiton_res) {
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
              
                      </tr>
                  </thead>
              <tbody id="tbody_get">           
      
              </tbody>
          </table>`);

  // populate table body
  tm_confirmaiton_res.forEach((element, index, arry) => {
    $("#tbody_get").append(
      `<tr>
        <th scope="row">${index + 1}</th>
        <td>${element.email}</td>
        <td>${element.created}</td>
        <td>${element.type}</td>
        <td>$${(Number(element.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
        <td>${element.data.data.getSessionStatus.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>
        <td><button type="button" class="btn btn-outline-info btn-sm">Expand</button></td>
    </tr>`
    );
  });
}

let initialize_table = setInterval(() => {
  if (db) {
    console.log("db found");
    clearInterval(initialize_table);
    readAll().then((result) => {
      dashboard_table(result);
    });
  } else {
    console.log("no db yet");
  }
}, 100);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "indexeddb_updated") {
    readAll().then((result) => {
      dashboard_table(result);
    });
  }
});
