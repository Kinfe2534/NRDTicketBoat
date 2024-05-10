$(window).on("load", async function () {
  let result = await chrome.storage.local.get(["email"]);
  $("#email").val(result["email"]);
});

$("#save").on("click", async function () {
  try {
    let val = $("#email").val();
    await chrome.storage.local.set({
      ["email"]: val,
    });
  } catch (err) {
    console.warn({ where: "Error in options save", e: err });
  }
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "email_updated") {
    let result = await chrome.storage.local.get(["email"]);
    $("#email").val(result["email"]);
  }
});
