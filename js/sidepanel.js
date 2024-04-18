$(window).on("load", function () {
  console.log("Hi, I am Ticketboat sidepanel.js :)");
});

$("#visible_tab_screenshot").on("click", function () {
  try {
    visible_tab_screenshot();
  } catch (err) {
    console.warn({ where: "Error in take sidepanel Screenshot", e: err });
  }
});

$("#full_page_screenshot").on("click", function () {
  try {
    full_page_screenshot();
  } catch (err) {
    console.warn({ where: "Error in take sidepanel Screenshot", e: err });
  }
});

async function visible_tab_screenshot() {
  try {
    // take visible tab image
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
        // image is base64
        // download image with potrace

        let a = document.createElement("a");
        a.download = "ticketboat_capture.png";
        a.href = image;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  } catch (e) {
    console.warn(e);
  }
}
async function full_page_screenshot() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "take_fullpage_screenshot" }, function (response) {});
    });
  } catch (e) {
    console.warn(e);
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    // display table data
    if (request.cmd === "confirmation_response") {
      console.log("Confirmation Response : ");
      console.log(request.content);
      // clear table content first
      $("#table_container").empty();
      // add table head
      $("#table_container").append(`
      <h1 class="display-6">Confirmation Details...</h1>
      
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th scope="col">Section:</th>
                              <th scope="col"># of Tickets</th>
                              <th scope="col">Price</th>
                  
                          </tr>
                      </thead>
                  <tbody id="tbody">           
          
                  </tbody>
              </table>`);

      // populate table body

      $("#tbody").append(`<tr>
                                  <th scope="row">Purchase Status</th>
                                  <td>${request.content.data.purchaseStatusResponse.status}</td>
                                  
                              </tr>`);
      $("#tbody").append(`<tr>
                              <th scope="row">Total Amount</th>
                              <td>$${(Number(request.content.data.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
                              
                          </tr>`);
      $("#tbody").append(`<tr>
                          <th scope="row">Quantity</th>
                          <td>${request.content.data.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>
                          
                      </tr>`);
    } else if (request.cmd === "unknown_response") {
      $("#table_container").append(`
      <h1 class="display-6">Confirmation Details... Unknown Response</h1>
      <h1 class="display-6">Status... ${request.content}</h1>
      `);
    }
  } catch (err) {
    console.warn({ where: "Error in dispalaying table in sidepanel", e: err });
  }
});
