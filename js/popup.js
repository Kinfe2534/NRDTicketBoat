$(window).on("load", async function () {
  console.log("Hi, I am Ticketboat popup.js :)");
  let result = await chrome.storage.local.get(["email"]);
  $("#email").attr("placeholder", result["email"]);
});

$("#capture_confirmation").on("click", function () {
  try {
    // take visible tab image
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.captureVisibleTab(tabs.windowId, { format: "png" }, (image) => {
        // image is base64
        // download image with potrace

        let a = document.createElement("a");
        a.download = "capture_confirmation.png";
        a.href = image;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  } catch (err) {
    console.warn({ where: "Error in popup confirmation_screenshot", e: err });
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

$("#open_options").on("click", function () {
  try {
    chrome.tabs.create({
      url: "html/options.html",
    });
  } catch (err) {
    console.warn({ where: "Error in Popup options", e: err });
  }
});
$("#save").on("click", async function () {
  try {
    let val = $("#email").val();
    await chrome.storage.local.set({
      ["email"]: val,
    });
    chrome.runtime.sendMessage({ cmd: "email_updated", content: "" });
    window.close();
  } catch (err) {
    console.warn({ where: "Error in popup save", e: err });
  }
});
