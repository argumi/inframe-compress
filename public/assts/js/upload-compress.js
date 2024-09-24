function getSelectedNavItemID() {
  var selectedNavItem = document.querySelector(".nav-link.active");
  var selectedNavItemID = selectedNavItem.getAttribute("id");
  return selectedNavItemID;
}
var selectedID = getSelectedNavItemID();

function formatSize(size) {
  if (size < 1024) {
    return size.toFixed(2) + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
}

$("#peopleCountingFormModal").on("hidden.bs.modal", function () {
  selectedID = getSelectedNavItemID();
  clearDropArea(selectedID);
});

$("#peopleCountingPreviewModal").on("hidden.bs.modal", function () {
  selectedID = getSelectedNavItemID();
  clearDropArea(selectedID);
});

$("#compressionPreviewModal").on("hidden.bs.modal", function () {
  selectedID = getSelectedNavItemID();
  clearDropArea(selectedID);
});

$(".btn-error-modal").click(function () {
  selectedID = getSelectedNavItemID();
  clearDropArea(selectedID);
});

function download_click(link, filename) {
  var selectedID = getSelectedNavItemID();
  let localCompany = localStorage.getItem("company");
  let localProblem = localStorage.getItem("problem");
  let localPhone = localStorage.getItem("phone");

  if (localCompany && localProblem && localPhone) {
    download(link, filename);
    $("#peopleCountingPreviewModal").modal("hide");
    $("#compressionPreviewModal").modal("hide");
    $("#peopleCountingFormModal").modal("hide");
    clearDropArea(selectedID);
  } else {
    $("#compressionPreviewModal").modal("hide");
    $("#peopleCountingPreviewModal").modal("hide");
    $("#peopleCountingFormModal").modal("show");
    $("#btnSendUser").click(function (e) {
      let company_data = $("#companyData").val();
      let problem = $("#problem").val();
      let phoneNumber = $("#phone").val();

      let valid_company;
      let valid_problem;
      let valid_phone;

      function isValidPhoneNumber(phoneNumber) {
        var regex = /^(\+62|0)8\d{8,13}$/;
        return regex.test(phoneNumber);
      }

      function isValidString(input) {
        // Memeriksa apakah input minimal memiliki satu huruf atau karakter
        if (!/[a-zA-Z]/.test(input)) {
          return false;
        }

        // Memeriksa apakah input hanya terdiri dari angka
        if (/^\d+$/.test(input)) {
          return false;
        }

        // Memeriksa apakah input hanya terdiri dari karakter alfanumerik dan spasi
        var regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(input);
      }

      if (!company_data) {
        $("#company-error").removeClass("d-none");
        $("#company-error").text("The field is required!");
        valid_company = false;
      } else if (company_data.length > 50) {
        $("#company-error").removeClass("d-none");
        $("#company-error").text(
          "Company field must not be greater than 50 characters long."
        );
        valid_company = false;
      } else if (company_data.length < 3) {
        $("#company-error").removeClass("d-none");
        $("#company-error").text(
          "Company field must not be less than 3 characters long."
        );
        valid_company = false;
      } else if (!isValidString(company_data)) {
        $("#company-error").removeClass("d-none");
        $("#company-error").text(
          "Please enter valid input without special characters and containing at least 1 alphabet."
        );
        valid_company = false;
      } else {
        $("#company-error").addClass("d-none");
        $("#company-error").text("");
        valid_company = true;
      }

      if (!problem) {
        $("#problem-error").removeClass("d-none");
        $("#problem-error").text("The field is required!");
        valid_problem = false;
      } else if (problem.length > 255) {
        $("#problem-error").removeClass("d-none");
        $("#problem-error").text(
          "Problem field must not be greater than 255 characters long."
        );
        valid_problem = false;
      } else if (problem.length < 3) {
        $("#problem-error").removeClass("d-none");
        $("#problem-error").text(
          "Problem field must not be less than 3 characters long."
        );
        valid_problem = false;
      } else if (!isValidString(problem)) {
        $("#problem-error").removeClass("d-none");
        $("#problem-error").text(
          "Please enter valid input without special characters and containing at least 1 alphabet."
        );
        valid_problem = false;
      } else {
        $("#problem-error").addClass("d-none");
        $("#problem-error").text("");
        valid_problem = true;
      }

      if (!phoneNumber) {
        $("#phone-error").removeClass("d-none");
        $("#phone-error").text("The field is required!");
        valid_phone = false;
      } else if (!isValidPhoneNumber(phoneNumber)) {
        $("#phone-error").removeClass("d-none");
        $("#phone-error").text("Please Input valid phone!");
        valid_phone = false;
      } else {
        $("#phone-error").addClass("d-none");
        $("#phone-error").text("");
        valid_phone = true;
      }

      if (
        company_data &&
        problem &&
        phoneNumber &&
        isValidPhoneNumber(phoneNumber) &&
        valid_phone &&
        valid_problem &&
        valid_company
      ) {
        let type =
          selectedID == "pills-people-tab" ? "people_counting" : "compression";
        $("#company-error").addClass("d-none");
        $("#company-error").text("");
        $("#problem-error").addClass("d-none");
        $("#problem-error").text("");
        $("#phone-error").addClass("d-none");
        $("#phone-error").text("");
        e.preventDefault();
        $.ajax({
          url: "/api/send_user",
          type: "POST",
          headers: {
            Accept: "application/json",
          },
          data: {
            companyData: company_data,
            problemEncountered: problem,
            phone: phoneNumber,
            type: type,
          },
          success: function (data, status) {
            if (data.status == 200) {
              $("#peopleCountingFormModal").modal("hide");
              $("#peopleCountingPreviewModal").modal("hide");
              $("#compressionPreviewModal").modal("hide");
              localStorage.setItem("company", company_data);
              localStorage.setItem("problem", problem);
              localStorage.setItem("phone", phoneNumber);

              download(link, filename);
              clearDropArea(selectedID);
            } else {
              alert("Error in Process!");
            }
          },
          error: function (xhr, status, errorThrown) {
            alert("Error in Process!");
          },
        });
      }
    });
  }
}

function download(link_img, filename) {
  var link = document.createElement("a");
  link.href = link_img;
  link.download = filename;
  link.click();
}

function clearDropArea(dropAreaSelector) {
  dropAreaSelector = dropAreaSelector.replace("-tab", "");
  const dropArea = document.querySelector(
      "#" + dropAreaSelector + " .drag-area"
    ),
    result_box = dropArea.querySelector(".result"),
    default_box = dropArea.querySelector(".default");

  if (dropArea) {
    default_box.classList.remove("d-none");
    result_box.classList.add("d-none");
  } else {
    console.error("dropArea is not found.");
  }
}

function initializeFileUpload(
  dropAreaSelector,
  fileInputId,
  progressBarId,
  progressTextId
) {
  const dropArea = document.querySelector(dropAreaSelector),
    dragText = dropArea.querySelector(".drop-text"),
    result_box = dropArea.querySelector(".result"),
    default_box = dropArea.querySelector(".default"),
    button = dropArea.querySelector(".btn-select"),
    iconTrial = dropArea.querySelector(".icon-trial"),
    input = dropArea.querySelector("#" + fileInputId);
  let file;
  var fileobj;

  function handleClick(event) {
    if (
      event.target.classList.contains("btn-select") ||
      event.target.classList.contains("icon-trial")
    ) {
      input.click();
    }
  }

  function handleInputChange() {
    fileobj = input.files[0];
    js_file_upload(fileobj);
  }

  dropArea.addEventListener("click", handleClick);

  input.addEventListener("change", handleInputChange);

  input.addEventListener("change", function () {
    file = this.files[0];
    dropArea.classList.add("active");
    showFile();
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "or drop image here to upload it";
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    showFile();
  });

  function upload_file(e) {
    e.preventDefault();
    fileobj = e.dataTransfer.files[0];
    js_file_upload(fileobj);
  }

  dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  dropArea.addEventListener("drop", upload_file);

  function validationFile(fileType) {
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

    if (validExtensions.includes(fileType)) {
      return true;
    } else {
      return false;
    }
  }

  function validationMaxSize(fileobj) {
    var selectedID = getSelectedNavItemID();
    if (selectedID == "pills-people-tab") {
      if (fileobj.size > 20 * 1024 * 1024) {
        return false;
      } else {
        return true;
      }
    } else {
      if (fileobj.size > 200 * 1024 * 1024) {
        return false;
      } else {
        return true;
      }
    }
  }

  function showFile() {
    var selectedID = getSelectedNavItemID();
    let fileType = file.type;

    if (checkUploadLimit(selectedID)) {
      return;
    }

    if (validationFile(fileType) == true && validationMaxSize(file)) {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        let fileURL = fileReader.result;

        let result = `
        <div class="box-img">
          <img class="image image-preview" src="${fileURL}" alt="Your Image">
          <div class="bg-overlay"></div>
          <div class="overlay">
            <img src="/assts/images/kecilin-v3/img-overlay.png" alt="Overlay Image">
          </div>
        </div>
      
        <h4  id="${progressTextId}"  class="progress-text pt-3">0%</h4>
        <span>Please wait...</span>
        <div  class="progress w-75" style="height: 8px;">
          <div id="${progressBarId}" class="progress-bar" role="progressbar" style="width: 0%; background-color: #0096D7;"
            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small class="pt-3 mb-3">Results will appear once this process is complete</small>`;
        result_box.innerHTML = result;
        default_box.classList.add("d-none");
        result_box.classList.remove("d-none");
        input.value = "";
      };
      fileReader.readAsDataURL(file);
    } else {
      // $("#compressionPreviewModal").modal("hide");
      // $("#peopleCountingPreviewModal").modal("hide");
      $("#errorModal").modal("show");
      if (validationFile(fileType) == false) {
        $(".error-message").html("Image Format must be jpg, jpeg, png!");
      } else {
        if (selectedID == "pills-people-tab") {
          $(".error-message").html(
            "The selected file exceeds the maximum allowed size of 20MB. Please choose a smaller file."
          );
        } else {
          $(".error-message").html(
            "The selected file exceeds the maximum allowed size of 200MB. Please choose a smaller file."
          );
        }
      }

      $(".btn-error-modal").html("Try again");
      dropArea.classList.remove("active");
      dragText.textContent = "or drop image here to upload it";
    }
  }

  function js_file_upload(file_obj, progressBarId) {
    var selectedID = getSelectedNavItemID();
    let fileType = fileobj.type;

    if (checkUploadLimit(selectedID)) {
      $("#errorLimitModal").modal("show");
      return;
    }

    if (file_obj != undefined) {
      if (validationFile(fileType) && validationMaxSize(file_obj)) {
        var form_data = new FormData();

        form_data.append("file", file_obj);

        var url =
          selectedID == "pills-people-tab"
            ? "/api/upload_people_counting"
            : "/api/upload_compress";

        axios
          .post(url, form_data, {
            onUploadProgress: function (progressEvent) {
              let selectedTab = selectedID.replace("-tab", "");
              var percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              document.querySelector(
                "#" + selectedTab + " .progress-bar"
              ).style.width = percent + "%";
              document.querySelector(
                "#" + selectedTab + " .progress-text"
              ).innerText = percent + "%";
              document
                .getElementById(progressBarId)
                .setAttribute("aria-valuenow", percent);
            },
          })
          .then(function (response) {
            if (response.status == 200) {
              if (response.data.status == 200) {
                if (selectedID == "pills-people-tab") {
                  $("#peopleCountingPreviewModal").modal("show");
                  $("#peopleCountingPreviewModal .result-img-container").html(
                    ""
                  );
                  $("#peopleCountingPreviewModal .result-img-container").html(
                    `<img class="pb-3 result-img" src="${response.data.data.link}" alt="Result Image">`
                  );

                  // $("#peopleCountingPreviewModal .result-img").attr(
                  //   "src",
                  //   response.data.data.link
                  // );
                  $("#peopleCountingPreviewModal .text-result span").html(
                    response.data.data.count
                  );

                  $(".modal-bottom-people").empty();
                  $(".modal-bottom-people")
                    .html(`<button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-download btn-download-step btn-download-people"
                    onclick="download_click('${response.data.data.link}', '${response.data.data.filename}')">Download</button>`);

                  incrementUploadCount(selectedID);
                } else {
                  let compress_size = response.data.data.compress_size;
                  let ori_size = response.data.data.size_ori;

                  let compress_size_formatted = formatSize(compress_size);
                  let ori_size_formatted = formatSize(ori_size);

                  $("#compressionPreviewModal").modal("show");

                  $("#compressionPreviewModal .result-img-container").html("");
                  $("#compressionPreviewModal .result-img-container").html(
                    `<img class="pb-3 result-img" src="${response.data.data.link}" alt="Result Image">`
                  );

                  $("#compressionPreviewModal .text-original span").html(
                    ori_size_formatted
                  );
                  $("#compressionPreviewModal .text-compress span").html(
                    compress_size_formatted
                  );

                  $(".modal-bottom-compress").empty();
                  $(".modal-bottom-compress")
                    .html(`<button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-download btn-download-step btn-download-compress"
                    onclick="download_click('${response.data.data.link}', '${response.data.data.filename}')">Download</button>`);

                  incrementUploadCount(selectedID);
                }
              } else {
                $("#errorModal").modal("show");
                $(".error-message").html(response.data.message);
                $(".btn-error-modal").html("Try again");
              }
            } else {
              $("#errorModal").modal("show");
              $(".error-message").html(response.statusText);
              $(".btn-error-modal").html("Try again");
            }
          })
          .catch(function (error) {
            $("#errorModal").modal("show");
            $(".error-message").html(
              "Sorry, an internal server error has occurred. Our team is currently working to fix it. Please wait a moment and try again later. Thank you for your understanding."
            );
            $(".btn-error-modal").html("Try again");
            // console.error("There was a problem with the request:", error);
          });
      }
    }
  }
}

if (window.location.pathname == "/en/dataoptimizer") {
  initializeFileUpload(
    ".drag-area-compress",
    "file2",
    "progressBar2",
    "progressText2"
  );
} else if (window.location.pathname == "/en/livestream") {
  initializeFileUpload(
    ".drag-area-people",
    "file1",
    "progressBar1",
    "progressText1"
  );
} else {
  initializeFileUpload(
    ".drag-area-people",
    "file1",
    "progressBar1",
    "progressText1"
  );
  initializeFileUpload(
    ".drag-area-compress",
    "file2",
    "progressBar2",
    "progressText2"
  );
}

// MAX UPLOAD 10/days

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const parts = dateString.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function checkUploadLimit(tabActive) {
  const today = getTodayDate();
  let uploadCount = 0;
  if (tabActive == "pills-people-tab") {
    uploadCount = localStorage.getItem("upload_count_people") ?? 0;
  } else {
    uploadCount = localStorage.getItem("upload_count_compress") ?? 0;
  }
  return uploadCount >= 10;
}

function incrementUploadCount(tabActive) {
  const today = getTodayDate();
  if (tabActive == "pills-people-tab") {
    let uploadCountPeople = localStorage.getItem("upload_count_people") ?? 0;
    uploadCountPeople++;
    localStorage.setItem("upload_count_people", uploadCountPeople);
  } else {
    let uploadCountCompress =
      localStorage.getItem("upload_count_compress") ?? 0;
    uploadCountCompress++;
    localStorage.setItem("upload_count_compress", uploadCountCompress);
  }
}

// Fungsi untuk memeriksa apakah sudah terjadi reset hari ini
function isResetNeeded() {
  const today = new Date().toLocaleDateString();

  const lastReset = localStorage.getItem("lastReset");

  return !lastReset || lastReset !== today;
}

// Fungsi untuk mereset item spesifik dalam local storage
function resetSpecificItem() {
  localStorage.setItem("upload_count_people", 0);
  localStorage.setItem("upload_count_compress", 0);
}

// Fungsi untuk menandai bahwa reset sudah dilakukan hari ini
function markResetDone() {
  const today = new Date().toLocaleDateString();

  localStorage.setItem("lastReset", today);
}

// Fungsi untuk memulai reset jika diperlukan
function startResetIfNeeded() {
  if (isResetNeeded()) {
    resetSpecificItem();
    markResetDone();
  }
}

// Panggil fungsi untuk memulai reset saat halaman dimuat
startResetIfNeeded();

var gambarList = document.querySelectorAll(".result-img-container");
gambarList.forEach(function (gambar) {
  gambar.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
});
