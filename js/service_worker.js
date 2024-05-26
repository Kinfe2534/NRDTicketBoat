importScripts("indexeddb.js");

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
  } else if (request.cmd === "confirmation_capture") {
    setTimeout(async () => {
      // take visible tab image
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
          // image is base64
          // download image with potrace
          chrome.tabs.sendMessage(tabs[0].id, { cmd: "save_confirmation_capture", image: image });
        });
      });
    }, 10);
  } else if (request.cmd === "get_email") {
    let result = await read("buyer_email", "config");
    await chrome.storage.local.set({ ["email"]: result["email"] });
  } else if (request.cmd === "save_email") {
    await update({ key: "buyer_email", email: request.email }, "config");
  }
});
// set defaults on installation
chrome.runtime.onInstalled.addListener(function () {});
