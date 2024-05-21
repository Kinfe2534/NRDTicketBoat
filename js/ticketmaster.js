$(window).on("load", function () {
  console.log("Hi, I am Ticketmaster.js :)");
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.cmd === "from_webRequest_onBeforeSendHeaders_tm") {
    get_confirmation_data_tm(request.details);
  } else if (request.cmd === "save_confirmation_capture_tm") {
    save_confirmation_capture_tm(request.image);
  }
});

// fetch ticketmaster_confirmation_page
async function get_confirmation_data_tm(details) {
  try {
    const Request_Name = details["requestHeaders"].find((header) => {
      return header.name == "request-name";
    });
    // if the request name is not purchase status, abort
    if (!Request_Name) {
      return;
    }
    if (!Request_Name.value) {
      return;
    }
    if (Request_Name.value !== "purchaseStatus") {
      return;
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
      console.log("Purchase Tracker get_confirmation_data_tm Response : Success");
      console.log(res);

      const confirmation_res_tm = {
        id: res.data.getSessionStatus.requestId,
        created: new Date(),
        type: "purchase_confirmation_tm",
        data: res,
        email: null,
      };
      // add  email
      let result = await chrome.storage.local.get(["email"]);
      confirmation_res_tm.email = result["email"];
      // send message to dashboard

      chrome.runtime.sendMessage({ cmd: "add_indexeddb_record_tm", confirmation_res_tm: confirmation_res_tm });
      // automaically take confirmation page screenshot
      chrome.runtime.sendMessage({ cmd: "confirmation_capture_tm"});
      // post confirmation data to db
      post_confirmation_data_tm(confirmation_res_tm);
    } else {
    }
  } catch (err) {
    console.warn({ where: "Error in  tm_get_confirmation_data", e: err });
  }
}
async function post_confirmation_data_tm(confirmation_res_tm) {
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

      body: JSON.stringify(confirmation_res_tm),
    });

    if (response.status === 200) {
      // logic for successful response

      const res = await response.json();
      console.log("Purchase Tracker post_confirmation_data_tm Response : Success");
      console.log(res);
    } else {
    }
  } catch (err) {
    console.warn({ where: "Error in post_confirmation_data_tm", e: err });
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
function save_confirmation_capture_tm(image) {
  let a = document.createElement("a");
  a.download = "capture_confirmation_tm.png";
  a.href = image;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
