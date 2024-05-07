$(window).on("load", async function () {
  let result_0 = await chrome.storage.local.get(["tm_fullpage_screenshot_selector"]);
  $("#tm_fullpage_screenshot_selector").val(result_0['tm_fullpage_screenshot_selector']);
  let result_1 = await chrome.storage.local.get(["buyer_email"]);
  $("#buyer_email").val(result_1['buyer_email']);
});

$("#tm_fullpage_screenshot_selector_save").on("click", async function () {
  try {
    let val = $("#tm_fullpage_screenshot_selector").val();
    await chrome.storage.local.set({
      ["tm_fullpage_screenshot_selector"]: val,
    });
  } catch (err) {
    console.warn({ where: "Error in options save_tm_fullpage_screenshot_selector", e: err });
  }
});

$("#tm_fullpage_screenshot_selector_reset").on("click", async function () {
  try {
    //await chrome.storage.local.remove("purchase_tracker_config");
    await chrome.storage.local.set({
      ["tm_fullpage_screenshot_selector"]: "#__next",
    });
    let result = await chrome.storage.local.get(["tm_fullpage_screenshot_selector"]);
    $("#tm_fullpage_screenshot_selector").val(result['tm_fullpage_screenshot_selector']);
  } catch (err) {
    console.warn({ where: "Error in options tm_fullpage_screenshot_selector_reset", e: err });
  }
});
$("#buyer_email_save").on("click", async function () {
  try {
    let val = $("#buyer_email").val();
    await chrome.storage.local.set({
      ["buyer_email"]: val,
    });
  } catch (err) {
    console.warn({ where: "Error in options buyer_email_save", e: err });
  }
});

$("#buyer_email_reset").on("click", async function () {
  try {
    //await chrome.storage.local.remove("purchase_tracker_config");
    await chrome.storage.local.set({
      ["buyer_email"]: "john.doe@ticketboat.com",
    });
    let result = await chrome.storage.local.get(["buyer_email"]);
    $("#buyer_email").val(result['buyer_email']);
  } catch (err) {
    console.warn({ where: "Error in options buyer_email_reset", e: err });
  }
});
