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
async function take_screenshot(){
    console.log("Screenshot Taken from popup :)...dummy test")
}