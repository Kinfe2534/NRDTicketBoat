$(window).on("load", function () {
  console.log("Hi, I am Ticketboat sidepanel.js :)");
});

$("#take_visible_tab_screenshot").on("click", function () {
  try {
    // take visible tab image
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
        // image is base64
        // download image with potrace

        let a = document.createElement("a");
        a.download = "pt_visible_tab_screenshot.png";
        a.href = image;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  } catch (err) {
    console.warn({ where: "Error in sidepanel take_visible_tab_screenshot", e: err });
  }
});

$("#take_fullpage_screenshot").on("click", function () {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "take_fullpage_screenshot" }, function (response) {});
    });
  } catch (err) {
    console.warn({ where: "Error in take sidepanel Screenshot", e: err });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    // display table data
    if (request.cmd === "tm_get_confirmation_data") {
      console.log("TM Get Confirmation Data Response : ");
      console.log(request.tm_confirmation_res);
      // clear table content first
      $("#tm_get_confirmation_table").empty();
      // add table head
      $("#tm_get_confirmation_table").append(`
      <h1 class="display-6">TM Get Confirmation Data Response </h1>
      
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th scope="col">Key</th>
                              <th scope="col">Value</th>
                  
                          </tr>
                      </thead>
                  <tbody id="tbody_get">           
          
                  </tbody>
              </table>`);

      // populate table body

      $("#tbody_get").append(`<tr>
                                  <th scope="row">Purchase Status</th>
                                  <td>${request.tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.status}</td>
                                  
                              </tr>`);
      $("#tbody_get").append(`<tr>
                              <th scope="row">Total Amount</th>
                              <td>$${(Number(request.tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.paymentMethods[0].chargeableAmount.subCurrencyValue) / 100).toFixed(2)}</td>
                              
                          </tr>`);
      $("#tbody_get").append(`<tr>
                          <th scope="row">Quantity</th>
                          <td>${request.tm_confirmation_res.data.data.getSessionStatus.purchaseStatusResponse.ticketOrderItems[0].ticketTypes[0].quantity}</td>
                          
                      </tr>`);
    } else if (request.cmd === "tm_get_confirmation_data_unknown_response") {
      // clear table content first
      $("#tm_get_confirmation_table").empty();
      // add table head
      $("#tm_get_confirmation_table").append(`
      <h1 class="display-6">TM Get Confirmation Data Response </h1>`);
      $("#tm_get_confirmation_table").append(`
      <h1 class="display-6">Confirmation Details... Unknown Response</h1>
      <h1 class="display-6">Status... ${request.content}</h1>
      `);
    } else if (request.cmd === "tm_post_confirmation_data") {
      console.log("TM Post Confirmation Data Response : ");
      console.log(request.content);
      // clear table content first
      $("#tm_post_confirmation_table").empty();
      // add table head
      $("#tm_post_confirmation_table").append(`
      <h1 class="display-6">TM Post Confirmation Data Response</h1>
      
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th scope="col">Key</th>
                              <th scope="col">Value</th>
                  
                          </tr>
                      </thead>
                  <tbody id="tbody_post">           
          
                  </tbody>
              </table>`);

      // populate table body

      $("#tbody_post").append(`<tr>
                                  <th scope="row">Post Response</th>
                                  <td>${JSON.stringify(request.content)}</td>
                                  
                              </tr>`);
    } else if (request.cmd === "tm_post_confirmation_data_unknown_response") {
      // clear table content first
      $("#tm_post_confirmation_table").empty();
      // add table head
      $("#tm_post_confirmation_table").append(`
      <h1 class="display-6">TM Post Confirmation Data Response</h1>`);
      $("#tm_post_confirmation_table").append(`
      
      
      <h1 class="display-6">Status... ${request.content}</h1>
      `);
    }
  } catch (err) {
    console.warn({ where: "Error in dispalaying table in sidepanel", e: err });
  }
});
