$(window).on("load", function () {

    console.log("Hi, I am Ticketboat sidepanel.js :)")
})

$('#take_screenshot').on('click', function () {
    try {
        take_screenshot()
    }
    catch (err) {
        console.warn({ where: "Error in take sidepanel Screenshot", e: err });
    }

});

async function take_screenshot() {
    console.log("Screenshot Taken from Sidepanel:)...dummy test")
}