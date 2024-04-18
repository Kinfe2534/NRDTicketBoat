$(window).on("load", function () {
  console.log("Hi, I am Ticketboat content.js :)");
});
var fetch_confirmation_page = true;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "take_fullpage_screenshot") {
    console.log("full page test");
    full_page_screenshot(request.selector);
  } else if (request.cmd === "from_webRequest_onBeforeSendHeaders") {
    console.log("On Before send headers received :");
    console.log(request.details);
    if (fetch_confirmation_page) {
      get_ticketmaster_confirmation_page(request.details);
    }
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

// fetch ticketmaster_confirmation_page
async function get_ticketmaster_confirmation_page(details) {
  try {
    const Request_Name = details["requestHeaders"].find((header) => {
      return header.name == "Request-Name";
    });
    // if the request name is not purchase status, abort
    if (Request_Name !== "purchaseStatus") {
      return;
    } else {
      fetch_confirmation_page = false;
    }

    const Fastly_Client_Ip = details["requestHeaders"].find((header) => {
      return header.name == "Fastly-Client-Ip";
    });

    const Ot_Tracer_Sampled = details["requestHeaders"].find((header) => {
      return header.name == "Ot-Tracer-Sampled";
    });

    const Ot_Tracer_Spanid = details["requestHeaders"].find((header) => {
      return header.name == "Ot-Tracer-Spanid";
    });
    const Ot_Tracer_Traceid = details["requestHeaders"].find((header) => {
      return header.name == "Ot-Tracer-Traceid";
    });

    const Tmps_Correlation_Id = details["requestHeaders"].find((header) => {
      return header.name == "Tmps-Correlation-Id";
    });

    const Tmps_Monetate_Id = details["requestHeaders"].find((header) => {
      return header.name == "Tmps-Monetate-Id";
    });
    const Tmps_Session_Id = details["requestHeaders"].find((header) => {
      return header.name == "Tmps-Session-Id";
    });
    const X_Cmd = details["requestHeaders"].find((header) => {
      return header.name == "X-Cmd";
    });
    const X_Eid = details["requestHeaders"].find((header) => {
      return header.name == "X-Eid";
    });
    const X_Environment_Tag = details["requestHeaders"].find((header) => {
      return header.name == "X-Environment-Tag";
    });
    const X_Tm_Bid = details["requestHeaders"].find((header) => {
      return header.name == "X-Tm-Bid";
    });
    const X_Tm_Domain = details["requestHeaders"].find((header) => {
      return header.name == "X-Tm-Domain";
    });
    const Referer = details["requestHeaders"].find((header) => {
      return header.name == "Referer";
    });

    const response = await fetch(details.url, {
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",

        "Fastly-Client-Ip": Fastly_Client_Ip.value,
        "Ot-Tracer-Sampled": Ot_Tracer_Sampled.value,
        "Ot-Tracer-Spanid": Ot_Tracer_Spanid.value,
        "Ot-Tracer-Traceid": Ot_Tracer_Traceid.value,
        "Request-Name": Request_Name.value,
        "Tmps-Correlation-Id": Tmps_Correlation_Id.value,
        "Tmps-Monetate-Id": Tmps_Monetate_Id.value,
        "Tmps-Session-Id": Tmps_Session_Id.value,
        "X-Cmd": X_Cmd.value,
        "X-Eid": X_Eid.value,
        "X-Environment-Tag": X_Environment_Tag.value,
        "X-Tm-Bid": X_Tm_Bid.value,
        "X-Tm-Domain": X_Tm_Domain.value,
      },

      body: { variables: { getSessionStatusInput: { requestId: Referer.split("/")[4] } } },
      method: "POST",
      mode: "cors",
    });

    if (response.status === 200) {
      // logic for successful response
      $.toast(toast.scrap_success);
      const res = await response.json();
      console.log("Purchase Tracker Response : ");
      console.log(res);

      // send message to popup and sidepanel
      chrome.runtime.sendMessage({ cmd: "confirmation_response", content: res });
    } else if (response.status === 440) {
      // display price and special offers fetch status with jquery toast
      $.toast(toast.scrap_error);

      chrome.runtime.sendMessage({ cmd: "login_time_out", content: "" });
    } else {
      // display any fetch status with jquery toast
      $.toast(toast.scrap_error);

      chrome.runtime.sendMessage({ cmd: "unknown_response", content: response.status });
    }
  } catch (err) {
    console.warn({ where: "Error in  get_ticketmaster_confirmation_page", e: err });
    $.toast(toast.all_error);
  }
}
// toast configs
const toast = {
  scrap_success: {
    heading: "Scrap Success",
    text: "Purchase Tracker Extension was able to scrap data!",
    showHideTransition: "slide",
    position: "mid-center",
    icon: "success",
    allowToastClose: true,
    hideAfter: 1000 * 5, // hide after 5 sec
  },
  scrap_error: {
    heading: "Scrap Error",
    text: "Purchase Tracker Extension was unable to scrap data!",
    showHideTransition: "fade",
    position: "mid-center",
    icon: "error",
    allowToastClose: true,
    hideAfter: 1000 * 5, // hide after 5 sec
  },
  post_success: {
    heading: "Post Success",
    text: "Purchase Tracker Extension was successful to post scrap data!",
    showHideTransition: "slide",
    position: "mid-center",
    icon: "success",
    allowToastClose: true,
    hideAfter: 1000 * 5, // hide after 5 sec
  },
  post_error: {
    heading: "Post Error",
    text: "Purchase Tracker Extension was unsuccessful to post scrap data!",
    showHideTransition: "fade",
    position: "mid-center",
    icon: "error",
    allowToastClose: true,
    hideAfter: 1000 * 5, // hide after 5 sec
  },
  post_info: {
    heading: "Post Information",
    text: "Purchase Tracker Extension can not proceed with Posting cause Scrapping failed.",
    showHideTransition: "fade",
    position: "mid-center",
    icon: "info",
    allowToastClose: true,
    hideAfter: 1000 * 5, // hide after 5 sec
  },
  all_error: {
    heading: "Scrapping and Posting Error",
    text: "Purchase Tracker Extension was unable to Scrap or Post data!",
    showHideTransition: "plain",
    position: "mid-center",
    icon: "error",
    allowToastClose: true,
    hideAfter: false,
  },
  get_event_id_error: {
    heading: "Get Event Id Error",
    text: "Purchase Tracker Extension was unable to Get Event Id!",
    showHideTransition: "plain",
    position: "mid-center",
    icon: "error",
    allowToastClose: true,
    hideAfter: false,
  },
};
