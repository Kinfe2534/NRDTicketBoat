importScripts("indexeddb.js");

// set defaults on installation
chrome.runtime.onInstalled.addListener(async function () {
  let result = await chrome.storage.local.get(["email"]);
  //check if ticketmaster fullscreenshot selector is available or set it

  if (Object.keys(result).length == 0) {
    chrome.storage.local.set({
      ["email"]: "john.doe@ticketboat.com",
    });
  }
});

// intercept requests from page ticketmaster
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "from_webRequest_onBeforeSendHeaders_tm", details: details }, function (response) {
        // alert("hello again");
      });
    });
  },
  {
    urls: ["https://checkout.ticketmaster.com/graphql"],
    types: ["xmlhttprequest"],
  },
  ["requestHeaders", "extraHeaders"]
);
// intercept requests from page etix
/* chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "from_webRequest_onBeforeSendHeaders_etix", details: details }, function (response) {
        // alert("hello again");
      });
    });
  },
  {
    urls: ["https://www.etix.com/ticket/mvc/legacyOnlineSale/performance/sale/deliverOrder", "https://etix.com/ticket/mvc/legacyOnlineSale/performance/sale/deliverOrder"],
    types: ["main_frame"],
  },
  ["requestHeaders", "extraHeaders"]
);
 */
// listen for messages from extension pages
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "add_indexeddb_record_tm") {
    setTimeout(async () => {
      create(request.confirmation_res_tm);
    }, 10);
  } else if (request.cmd === "add_indexeddb_record_etix") {
    setTimeout(async () => {
      create(request.confirmation_res_etix);
    }, 10);
  } else if (request.cmd === "confirmation_capture_tm") {
    setTimeout(async () => {
      // take visible tab image
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
          // image is base64
          // download image with potrace
          chrome.tabs.sendMessage(tabs[0].id, { cmd: "save_confirmation_capture_tm", image: image });
        });
      });
    }, 10);
  } else if (request.cmd === "confirmation_capture_etix") {
    setTimeout(async () => {
      // take visible tab image
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
          // image is base64
          // download image with potrace
          chrome.tabs.sendMessage(tabs[0].id, { cmd: "save_confirmation_capture_etix", image: image });
        });
      });
    }, 10);
  }
});
