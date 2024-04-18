const ticket_sites = ["https://www.ticketmaster.com","https://checkout.ticketmaster.com", "https://tix.axs.com", "https://shop.axs.co.uk", "https://www.axs.com", "https://q.axs.co.uk"];

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
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Purchase Tracker ON/OFF",
    contexts: ["all"],
    id: "toggle_purchase_tracker",
  });
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
  ["requestHeaders"]
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
