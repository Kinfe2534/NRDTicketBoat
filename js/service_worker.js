importScripts("indexeddb.js");

chrome.runtime.onInstalled.addListener(async function () {
  let result = await chrome.storage.local.get(["email"]);
  //check if ticketmaster fullscreenshot selector is available or set it

  if (Object.keys(result).length == 0) {
    chrome.storage.local.set({
      ["email"]: "john.doe@ticketboat.com",
    });
  }
});

///////////////////////////
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "tm_add_indexeddb_record") {
    setTimeout(async () => {
      create(request.tm_confirmation_res);
      chrome.runtime.sendMessage({ cmd: "indexeddb_updated", content: "" });
    }, 100);
  } else if (request.cmd === "add_sample_record") {
    setTimeout(async () => {
      let result = await chrome.storage.local.get(["email"]);
      sample_data.email = result["email"];
      create(sample_data);
      chrome.runtime.sendMessage({ cmd: "indexeddb_updated", content: "" });
    }, 100);
  }
});
/////////////////////////////
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "from_webRequest_onBeforeSendHeaders", details: details }, function (response) {
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
