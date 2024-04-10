$(window).on("load", function () {
  console.log("Hi, I am Ticketboat content.js :)");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "take_fullpage_screenshot") {
    console.log("full page test");
    full_page_screenshot(request.selector);
  } else if (request.cmd === "onHeadersReceived") {
    console.log("On headers received :")
    console.log(request.details)

  }else if (request.cmd === "onBeforeSendHeaders") {
    console.log("On Before send headers received :")
    console.log(request.details)

  }
});

async function full_page_screenshot(selector) {
  try {
    console.log("Selector : " + selector);
    const node = $(selector).get(0);

    domtoimage
      .toBlob(node, {
        imagePlaceholder: "data:image/gif;base64,R0lGODlhyAAiALM...DfD0QAADs=",
      })
      .then(function (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          saveAs(reader.result, "ticketboat_fullpage_screenshot.png");
        };
      });
  } catch (e) {
    console.warn(e);
  }
}
