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
      chrome.tabs.captureVisibleTab(
        tabs.windowId,
        { format: "png" },
        (image) => {
          // image is base64
          // download image with potrace

          let a = document.createElement("a");
          a.download = "ticketboat_capture.png";
          a.href = image;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      );
    });
  } catch (e) {
    console.warn(e);
  }
}
async function full_page_screenshot() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { cmd: "take_fullpage_screenshot" },
        function (response) {}
      );
    });
 
  } catch (e) {
    console.warn(e);
  }
}
