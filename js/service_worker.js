const ticket_sites = [
  "https://tix.axs.com",
  "https://shop.axs.co.uk",
  "https://www.axs.com",
  "https://q.axs.co.uk",
  "https://www.ticketmaster.com",
];

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
    title: "TicketBoat ON/OFF",
    contexts: ["all"],
    id: "toggle_ticketboat",
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === "toggle_ticketboat") {
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
      chrome.tabs.sendMessage(
        tabs[0].id,
        { cmd: "onBeforeSendHeaders", details: details },
        function (response) {
          // alert("hello again");
        }
      );
    });
  },
  { urls: ["https://ids.ad.gt/api/v1/halo_match*"], types: ["xmlhttprequest"] },
  ["requestHeaders"]
);
/////////////////////////////
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { cmd: "onHeadersReceived", details: details },
        function (response) {
          // alert("hello again");
        }
      );
    });
    // modify headers
    details.responseHeaders.name = "kinfe";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { cmd: "onHeadersReceived", details: details },
        function (response) {
          // alert("hello again");
        }
      );
    });
    return {
      responseHeaders: details.responseHeaders,
    };
  },
  { urls: ["https://ids.ad.gt/api/v1/halo_match*"], types: ["xmlhttprequest"] },
  ["responseHeaders", "extraHeaders"]
);
