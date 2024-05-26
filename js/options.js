$(window).on("load", async function () {
  await chrome.runtime.sendMessage({ cmd: "get_email", content: "" });
  let result = await chrome.storage.local.get(["email"]);
  $("#email").attr("placeholder", result["email"]);
});

$("#save").on("click", async function () {
  try {
    let val = $("#email").val();
    await update({ key: "buyer_email", email: val }, "config");
  } catch (err) {
    console.warn({ where: "Error in options save", e: err });
  }
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "email_updated") {
    let result = await read("buyer_email", "config");
    $("#email").attr("placeholder", result["email"]);
  }
});
