$(document).ready(function () {
  if ($("#scrapTable").length) {
    $("#scrapTable").DataTable({
      processing: true,
      serverSide: false,

      ajax: {
        url: "/scrap/getList",
        type: "POST",
      },

      columns: [
        { data: "Asset.assetName" },
        { data: "Asset.serialNumber" },
        { data: "scrapDate" },
        { data: "Asset.purchasePrice" },
        { data: "reason" },
        {
          data: null,
          orderable: false,
          searchable: false,

          render: function (data) {
            return `
        <a href="/scrap/view/${data.id}" class="btn btn-info btn-sm">View</a>
        <a href="/scrap/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
      `;
          },
        },
      ],
    });
  }
});

// Load Issued Assets
$.ajax({
  url: "/asset/getList",
  type: "POST",
  success: function (res) {
    let option = '<option value="">Select Asset</option>';

    res.data.forEach(function (item) {
      option += `<option value="${item.id}">
     ${item.assetCode} - ${item.assetName}
      </option>`;
    });

    $("#assetId").html(option);
  },
});

// Add
$("#scrapForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#id").val(),
    assetId: $("#assetId").val(),
    scrapDate: $("input[name='scrapDate']").val(),
    reason: $("input[name='reason']").val(),
  };

  $.ajax({
    url: "/scrap/create",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),

    success: function (res) {
      $("#message").html(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${res.message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);

      setTimeout(function () {
        window.location.href = "/scrap";
      }, 1500);
    },

    error: function (err) {
      let message = "";

      if (err.responseJSON.message) {
        message = err.responseJSON.message;
      } else if (err.responseJSON.errors) {
        message = Object.values(err.responseJSON.errors)
          .map((item) => item.message)
          .join("<br>");
      }

      $("#message").html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);
    },
  });
});

// View
if (typeof scrapId !== "undefined" && $("#assetName").length) {
  $.ajax({
    url: "/scrap/detail/" + scrapId,
    type: "GET",

    success: function (res) {
      $("#assetName").text(res.data.Asset.assetName);
      $("#serialNumber").text(res.data.Asset.serialNumber);
      $("#scrapDate").text(res.data.scrapDate);
      $("#reason").text(res.data.reason);
    },
  });
}

// Edit
if (typeof scrapId !== "undefined" && $("#scrapForm").length) {
  //  Dropdown
  $.ajax({
    url: "/asset/getList",
    type: "POST",
    success: function (issueRes) {
      let option = '<option value="">Select Scrap Asset</option>';

      issueRes.data.forEach(function (item) {
        option += `
          <option value="${item.id}">
            ${item.assetCode} - ${item.assetName}
          </option>
        `;
      });

      $("#scrapId").html(option);

      // Load scrap  Details
      $.ajax({
        url: "/scrap/detail/" + scrapId,
        type: "GET",

        success: function (res) {
          console.log(res);
          $("#id").val(res.data.id);
          $("#assetId").val(res.data.assetId);
          $("input[name='scrapDate']").val(res.data.scrapDate);
          $("input[name='reason']").val(res.data.reason);
        },
      });
    },
  });
}
