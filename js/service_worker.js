
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === us_origin || url.origin === uk_origin || url.origin === axs_home || axs_uk_redirect === url.origin) {

    await chrome.sidePanel.setOptions({
      tabId,
      path: 'html/sidepanel.html',
      enabled: true
    });

  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

// context menu ["page", "selection", "image", "link"]
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({ "title": "TicketBoat ON/OFF", "contexts": ["all"], "id": "toggle_ticketboat" });

});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === 'toggle_ticketboat') {
    let result = await chrome.storage.local.get(['status'])
    chrome.storage.local.set({
      ['status']: !result['status']
    }, function (result) { })

    if (result["status"]) {
      chrome.action.setIcon({ path: "/images/off.png" });
    } else {
      chrome.action.setIcon({ path: "/images/on.png" });
    }

  }


})
