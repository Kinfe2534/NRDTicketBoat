$(window).on("load", function () {
  console.log("Hi, I am Ticketboat content.js :)");
});
var tm_fetch_confirmation_page = true;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === "take_fullpage_screenshot") {
    take_fullpage_screenshot();
  } else if (request.cmd === "from_webRequest_onBeforeSendHeaders") {
    if (tm_fetch_confirmation_page) {
      tm_get_confirmation_data(request.details);
    }
  }
});

async function take_fullpage_screenshot() {
  try {
    let result = null;
    if (window.location.origin === "https://checkout.ticketmaster.com" || window.location.origin === "https://www.ticketmaster.com") {
      result = await chrome.storage.local.get(["tm_fullpage_screenshot_selector"]);
    } else {
    }
    const node = $(result["tm_fullpage_screenshot_selector"]).get(0);

    domtoimage
      .toBlob(node, {
        imagePlaceholder: "data:image/gif;base64,R0lGODlhyAAiALM...DfD0QAADs=",
      })
      .then(function (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          saveAs(reader.result, "pt_tm_fullpage_screenshot.png");
        };
      });
  } catch (e) {
    console.log("Error in take_fullpage_screenshot");
    console.warn(e);
  }
}

// fetch ticketmaster_confirmation_page
async function tm_get_confirmation_data(details) {
  try {
    const Request_Name = details["requestHeaders"].find((header) => {
      return header.name == "request-name";
    });
    // if the request name is not purchase status, abort
    if (!Request_Name) {
      return;
    } else if (Request_Name.value !== "purchaseStatus") {
      return;
    } else {
      fetch_confirmation_page = false;
    }

    const Fastly_Client_Ip = details["requestHeaders"].find((header) => {
      return header.name == "fastly-client-ip";
    });

    const Ot_Tracer_Sampled = details["requestHeaders"].find((header) => {
      return header.name == "ot-tracer-sampled";
    });

    const Ot_Tracer_Spanid = details["requestHeaders"].find((header) => {
      return header.name == "ot-tracer-spanid";
    });
    const Ot_Tracer_Traceid = details["requestHeaders"].find((header) => {
      return header.name == "ot-tracer-traceid";
    });

    const Tmps_Correlation_Id = details["requestHeaders"].find((header) => {
      return header.name == "TMPS-Correlation-Id";
    });

    const Tmps_Monetate_Id = details["requestHeaders"].find((header) => {
      return header.name == "tmps-monetate-id";
    });
    const Tmps_Session_Id = details["requestHeaders"].find((header) => {
      return header.name == "tmps-session-id";
    });
    const X_Cmd = details["requestHeaders"].find((header) => {
      return header.name == "x-cmd";
    });
    const X_Eid = details["requestHeaders"].find((header) => {
      return header.name == "x-eid";
    });
    const X_Environment_Tag = details["requestHeaders"].find((header) => {
      return header.name == "x-environment-tag";
    });
    const X_Tm_Bid = details["requestHeaders"].find((header) => {
      return header.name == "x-tm-bid";
    });
    const X_Tm_Domain = details["requestHeaders"].find((header) => {
      return header.name == "x-tm-domain";
    });
    const Referer = details["requestHeaders"].find((header) => {
      return header.name == "Referer";
    });

    const response = await fetch(details.url, {
      //credentials: "include",
      method: "POST",
      headers: {
        Accept: "/",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Content-Type": "text/plain;charset=UTF-8",
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

      body: JSON.stringify({
        query: tm_query,
        variables: { getSessionStatusInput: { requestId: Referer.value.split("?")[0].split("/")[4] } },
      }),
    });

    if (response.status === 200) {
      // logic for successful response

      const res = await response.json();
      console.log("Purchase Tracker tm_get_confirmation_data Response : ");
      console.log(res);

      const tm_confirmation_res = {
        id: res.data.getSessionStatus.requestId,
        created: new Date(),
        type: "tm_purchase_confirmation",
        data: res,
      };
      // add buyer email
      let result = await chrome.storage.local.get(["buyer_email"]);
      tm_confirmation_res.email = result["buyer_email"];
      // send message to popup and sidepanel
      chrome.runtime.sendMessage({ cmd: "tm_get_confirmation_data", tm_confirmation_res: tm_confirmation_res });
      chrome.runtime.sendMessage({ cmd: "tm_add_indexeddb_record", tm_confirmation_res: tm_confirmation_res });

      tm_post_confirmation_data(tm_confirmation_res);
    } else {
      // display any fetch status with jquery toast

      chrome.runtime.sendMessage({ cmd: "tm_get_confirmation_data_unknown_response", content: response.status });
    }
  } catch (err) {
    console.warn({ where: "Error in  tm_get_confirmation_data", e: err });
  }
}
async function tm_post_confirmation_data(tm_confirmation_res) {
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

      body: JSON.stringify(tm_confirmation_res),
    });

    if (response.status === 200) {
      // logic for successful response

      const res = await response.json();
      console.log("Purchase Tracker tm_post_confirmation_data Response : ");
      console.log(res);

      // send message to popup and sidepanel
      chrome.runtime.sendMessage({ cmd: "tm_post_confirmation_data", content: res });
    } else {
      // display any fetch status with jquery toast

      chrome.runtime.sendMessage({ cmd: "tm_post_confirmation_data_unknown_response", content: response.status });
    }
  } catch (err) {
    console.warn({ where: "Error in tm_post_confirmation_data", e: err });
  }
}
var tm_query = `
query purchaseStatusQuery($getSessionStatusInput: GetSessionStatusInput!) {
  getSessionStatus(getSessionStatusInput: $getSessionStatusInput) {
    errors {
      code
      message
    }
    requestId
    status
    purchaseStatusResponse {
      clubSiteId
      deliveryData {
        deliveryMethod
        deliveryTax {
          value
          subCurrencyValue
          currencyCode
        }
        description: longDescription
        id
        isETicket
        name: shortDescription
        price: ticketPrice {
          value
          subCurrencyValue
          currencyCode
        }
        subDeliveryOptions: subDeliveries {
          id
          name: shortDescription
          description: longDescription
        }
        type: serviceLevel
      }
      encryptedMemberOrderNumber
      errors {
        code
        message
        data {
          failedReferenceIds
          key
          value
        }
      }
      eventData {
        actOverrideId
        eventDate
        eventEndDate
        eventId
        eventType
        hasStaticMap
        healthCheckMessage {
          description
          largeIconUrl
          learnMoreUrl
          provider
          smallIconUrl
          summary
        }
        id
        image
        isFanToFanExchange
        isResaleEligible
        isSpanMultipleDays
        localDate
        localTime
        name
        onsaleDate
        primaryAttraction {
          id
          legacyId
          imageHref
          name
          organizationId
        }
        primaryCategory {
          classification
          hostId
          id
          name
        }
        promoter
        promoterCategory
        promoterId
        promoterIds
        quaternaryCategory {
          id
          name
          classification
        }
        quinaryCategory {
          id
          name
          classification
        }
        secondaryAttraction {
          id
          legacyId
          imageHref
          name
        }
        subCategory {
          classification
          hostId
          hostName
          id
          name
        }
        tertiaryCategory {
          id
          name
          classification
        }
        transferable
        url
        venue {
          address {
            city
            country
            countryCode
            postCode
            region
            regionCode
            streetAddress
          }
          dmaId
          id
          name
          timezone
          tmId
        }
      }
      hostUpsellEvents {
        eventId
        ticketTypes {
          description
          id
          priceDetails {
            facilityCharges {
              currencyCode
              subCurrencyValue
            }
            price {
              currencyCode
              subCurrencyValue
            }
            processingFee {
              currencyCode
              subCurrencyValue
            }
            serviceCharges {
              currencyCode
              subCurrencyValue
            }
            taxes {
              currencyCode
              subCurrencyValue
            }
            taxDetails {
              faceValueTax {
                currencyCode
                subCurrencyValue
              }
              serviceChargeTax {
                currencyCode
                subCurrencyValue
              }
              serviceChargeTax2 {
                currencyCode
                subCurrencyValue
              }
            }
          }
          quantity
        }
        type: upsellType
      }
      locale
      orderFees {
        currencyCode
        subCurrencyValue
      }
      orderNumber
      parkingConfirmationUrl
      paymentMethods {
        ccLast4Digits
        chargeableAmount {
          currencyCode
          subCurrencyValue
        }
        fundingMethod
        fundingSource
      }
      sellerNotes
      status
      ticketOrderItems {
        adaTypes
        endSeat
        inventoryDetail {
          type
          resaleDetail {
            cartSessionId
            offerVersionId
          }
        }
        isGeneralAdmission
        quantityAvailable
        row
        seatNames
        section
        startSeat
        ticketTypes {
          description
          id
          priceDetails {
            facilityCharges {
              currencyCode
              value
            }
            price {
              currencyCode
              value
            }
            serviceCharges {
              currencyCode
              value
            }
            taxDetails {
              faceValueTax {
                currencyCode
                value
              }
              serviceChargeTax {
                currencyCode
                value
              }
              serviceChargeTax2 {
                currencyCode
                value
              }
            }
            taxes {
              currencyCode
              value
            }
          }
          quantity
        }
      }
    }
  }
}
`;
