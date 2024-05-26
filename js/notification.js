$(document).ready(async function () {
  console.log("Hi, I am notification.js");
  // dont add modal on tickets page
  const url = window.location.pathname.split("/");
  if (url.includes("event")) {
    return;
  }
  // apend modal container and modal html
  $("body").append('<div id="modal_container"></div>');
  let result = await chrome.runtime.getURL("html/notification.html");
  $("#modal_container").load(result);

  var clear_interval = setInterval(async () => {
    if (document.getElementById("staticBackdrop")) {
      // clear interval for that checks if modal container is available
      clearInterval(clear_interval);

      // get stored email
      await chrome.runtime.sendMessage({ cmd: "get_email", content: "" });
      let result = await chrome.storage.local.get(["email"]);
      console.log("returned email :", result["email"]);
      // create toast and show
      const my_toast = document.getElementById("my_toast");
      const toast = new bootstrap.Toast(my_toast, { autohide: false });
      $("#toast_email").text(result["email"]);
      toast.show();
      // check if the stored email is default email or set email
      if (result["email"] !== "john.doe@ticketboat.com") {
        return;
      }

      // create modal and show
      const my_modal = document.getElementById("staticBackdrop");
      const modal = new bootstrap.Modal(my_modal);
      modal.show();

      // modal event listeners
      my_modal.addEventListener("show.bs.modal", function () {
        console.log("modal show");
      });

      my_modal.addEventListener("shown.bs.modal", async function () {
        console.log("modal shown");
        await chrome.runtime.sendMessage({ cmd: "get_email", content: "" });
        let result = await chrome.storage.local.get(["email"]);
        console.log("returned email :", result["email"]);
        $("#email").attr("placeholder", "default : " + result["email"]);
        $("#save").on("click", async function () {
          try {
            let val = $("#email").val();
            await chrome.runtime.sendMessage({ cmd: "save_email", email: val });
            modal.toggle();
          } catch (err) {
            console.warn({ where: "Error in popup save", e: err });
          }
        });
      });

      my_modal.addEventListener("hide.bs.modal", function () {
        console.log("modal hide");
      });

      my_modal.addEventListener("hidden.bs.modal", function () {
        console.log("modal hidden");
      });
    }
  }, 500);
});
setInterval(async () => {
  await chrome.runtime.sendMessage({ cmd: "get_email", content: "" });
  let result = await chrome.storage.local.get(["email"]);
  $("#toast_email").text(result["email"]);
}, 1000);
