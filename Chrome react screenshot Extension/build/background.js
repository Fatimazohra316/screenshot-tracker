chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  let timerName = null;
  let time = 0;

  const apiURL = "https://zany-pink-chimpanzee-coat.cyclic.app/api/v1";
  let timersId;

  if (request.action === "startTimer") {
    const headers = {
      Authorization: "Bearer " + request.token,
    };
    const model = {
      projectId: "643fb528272a1877e4fcf30e",
      description: "Working on feature X",
    };

    try {
      const response = await fetch(`${apiURL}/timetrack/add`, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        method: "POST",
        mode: "cors",
        body: JSON.stringify(model),
      });

      if (response.ok) {
        const data = await response.json();
        const timeEntry = data.data.timeEntries.slice(-1);
        const timeEntryId = timeEntry.map((element) => element._id);
        chrome.storage.local.set({ timeid: timeEntryId }, function () {});
        console.log(data);
      } else {
        throw new Error("Failed to start the timer");
      }
    } catch (error) {
      console.error(error);
    }
    chrome.alarms.create("screenshotAlarm", { periodInMinutes: 0.5});
    chrome.alarms.onAlarm.addListener(function (alarm) {
      if (alarm.name === "screenshotAlarm") {
        captureAndDownloadScreenshot();
      }
    });
  }

  if (request.action === "stopTimer") {
    chrome.alarms.clear("screenshotAlarm");

    const headers = {
      Authorization: "Bearer " + request.token,
    };

    try {
      chrome.storage.local.get(["timeid"], async function (result) {
        try {
          const response = await fetch(
            `${apiURL}/timetrack/edit/${result.timeid}`,
            {
              headers: {
                "Content-Type": "application/json",
                ...headers,
              },
              method: "PATCH",
              mode: "cors",
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            sendResponse(data); // Send the response back to the browser extension
          } else {
            throw new Error("Failed to stop the timer");
          }
        } catch (error) {
          console.error(error);
          sendResponse({ error: "An error occurred" }); // Send an error response
        }
      });
    } catch (error) {
      console.error(error);
      sendResponse({ error: "An error occurred" }); // Send an error response
    }
    return true;
  }
  function captureAndDownloadScreenshot() {
    const headers = {
      Authorization: "Bearer " + request.token,
    };
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    chrome.tabs.captureVisibleTab({ format: "png" }, function (dataURL) {
      var filename = "screenshot_" + Date.now() + ".png";
      var file = dataURLtoFile(dataURL, filename);
      const data = new FormData();
      sendResponse({ imgSrc: dataURL });
      var base64Data = dataURL.split(",")[1];
      var byteCharacters = atob(base64Data);
      var byteArrays = new Uint8Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      var blob = new Blob([byteArrays], { type: "image/png" });
      
      // var reader = new FileReader();
      // reader.onloadend = function () {
      //   var dataUrl = reader.result;
      //   var downloadOptions = {
      //     url: dataUrl,
      //     filename: filename,
      //     saveAs: true,
      //   };

      //   chrome.downloads.download(downloadOptions);
      // };
      // reader.readAsDataURL(blob);

      chrome.storage.local.get(["timeid"], async function (result) {
        function logFormData(formData) {
          for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }
        }
        logFormData(data);

        const formData = new FormData();
        formData.append("file", file);
        const response = fetch(
          `${apiURL}/timetrack/time-entries/${result.timeid}/screenshots`,
          {
            headers,
            method: "PATCH",
            mode: "cors",
            body: formData,
          }
        ).then((response) => console.log("rerrrr", response.json()));
      });
    });
  }
});
