importScripts("indexeddb.js");
const ticket_sites = ["https://www.ticketmaster.com", "https://checkout.ticketmaster.com", "https://tix.axs.com", "https://shop.axs.co.uk", "https://www.axs.com", "https://q.axs.co.uk"];

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (ticket_sites.includes(url.origin)) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "html/sidepanel.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});
// context menu ["page", "selection", "image", "link"]
chrome.runtime.onInstalled.addListener(async function () {
  chrome.contextMenus.create({
    title: "Purchase Tracker ON/OFF",
    contexts: ["all"],
    id: "toggle_purchase_tracker",
  });

  // first get all stored keys in localStorage config
  let result_0 = await chrome.storage.local.get(["tm_fullpage_screenshot_selector"]);
  let result_1 = await chrome.storage.local.get(["buyer_email"]);
  //check if ticketmaster fullscreenshot selector is available or set it
  if (Object.keys(result_0).length == 0) {
    chrome.storage.local.set({
      ["tm_fullpage_screenshot_selector"]: "#__next",
    });
  }
  if (Object.keys(result_1).length == 0) {
    chrome.storage.local.set({
      ["buyer_email"]: "john.doe@ticketboat.com",
    });
  }
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === "toggle_purchase_tracker") {
    let result = await chrome.storage.local.get(["status"]);
    chrome.storage.local.set(
      {
        ["status"]: !result["status"],
      },
      function (result) {}
    );

    if (result["status"]) {
      chrome.action.setIcon({ path: "/images/off.png" });
    } else {
      chrome.action.setIcon({ path: "/images/on.png" });
    }
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
      let result = await chrome.storage.local.get(["buyer_email"]);
      sample_data.email = result["buyer_email"];
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

/////////////////////////////
chrome.webRequest.onCompleted.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "from_webRequest_complete", details: details }, function (response) {
        // alert("hello again");
      });
    });
  },
  {
    urls: ["https://checkout.ticketmaster.com/graphql"],
    types: ["xmlhttprequest"],
  },
  ["responseHeaders"]
);
//////////////////
chrome.webRequest.onErrorOccurred.addListener(
  function (e) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "from_webRequest_error", id: e.requestId }, function (response) {
        // alert("hello again");
      });
    });
  },
  {
    urls: ["https://checkout.ticketmaster.com/graphql"],
    types: ["xmlhttprequest"],
  }
);
