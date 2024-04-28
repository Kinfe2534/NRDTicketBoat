$(window).on("load", function () {
  console.log("Hi, I am Ticketboat popup.js :)");
});

$("#visible_tab_screenshot").on("click", function () {
  try {
    visible_tab_screenshot();
  } catch (err) {
    console.warn({ where: "Error in popup screenshot", e: err });
  }
});
$("#full_page_screenshot").on("click", function () {
  try {
    full_page_screenshot();
  } catch (err) {
    console.warn({ where: "Error in take sidepanel Screenshot", e: err });
  }
});
$("#open_dashboard").on("click", function () {
  try {
    chrome.tabs.create({
      url: "html/dashboard.html",
    });
  } catch (err) {
    console.warn({ where: "Error in open_dashboard", e: err });
  }
});
$("#add_record").on("click", function () {
  try {
    chrome.runtime.sendMessage({ cmd: "add_record", content: "" });
  } catch (err) {
    console.warn({ where: "Error in Popup add_record", e: err });
  }
});
$("#open_sidepanel").on("click", async function () {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.sidePanel.open({ tabId: tabs[0].id });
    await chrome.sidePanel.setOptions({
      tabId: tabs[0].id,
      path: "html/sidepanel.html",
      enabled: true,
    });
    const options = await chrome.sidePanel.getOptions({ tabId: tabs[0].id });
    console.log("Sidepanel Options");
    console.log(options);
  } catch (err) {
    console.warn({ where: "Error open_sidepanel", e: err });
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
        a.download = "pt_visible_tab_screenshot.png";
        a.href = image;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  } catch (e) {
    console.warn(e);
  }
  console.log("Screenshot Taken from popup :)...dummy test");
}

async function full_page_screenshot() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "take_fullpage_screenshot", selector: $("#selector").val() }, function (response) {});
    });
  } catch (e) {
    console.warn(e);
  }
}
