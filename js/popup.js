$(window).on("load", function () {

    console.log("Hi, I am Ticketboat popup.js :)")
})

$('#take_screenshot').on('click', function () {
    try {
        take_screenshot()
    }
    catch (err) {
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
  

$('#open_sidepanel').on('click', async function () {
    try {

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        await chrome.sidePanel.open({ tabId: tabs[0].id });
        await chrome.sidePanel.setOptions({
            tabId: tabs[0].id,
            path: 'html/sidepanel.html',
            enabled: true
        })
        const options = await chrome.sidePanel.getOptions({ tabId: tabs[0].id })
        console.log("Sidepanel Options")
        console.log(options)

    }
    catch (err) {
        console.warn({ where: "Error open_sidepanel", e: err });
    }

});
async function take_screenshot() {
    try {
        // take visible tab image
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.captureVisibleTab(tabs.windowId, { format: 'png' }, (image) => {
                // image is base64
                // download image with potrace

                let a = document.createElement("a");
                a.download = "ticketboat_capture.png";
                a.href = image;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        })


    }
    catch (e) {
        console.warn(e);
    }
    console.log("Screenshot Taken from popup :)...dummy test")
}

  async function full_page_screenshot() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { cmd: "take_fullpage_screenshot", selector:$("#selector").val() },
          function (response) {}
        );
      });
   
    } catch (e) {
      console.warn(e);
    }
  }
  