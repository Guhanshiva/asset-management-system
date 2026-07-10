$(document).ready(function () {
  const table = $("#assetTable").DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: "/asset/getList",
      type: "POST",
      data: function () {
        return {
          status: $("#statusFilter").val(),
          categoryId: $("#categoryFilter").val(),
          make: $("#makeFilter").val(),
          model: $("#modelFilter").val(),
        };
      },
      dataSrc: "data",
    },
    columns: [
      { data: "assetCode" },
      { data: "assetName" },
      { data: "serialNumber" },
      { data: "AssetCategory.categoryName" },
      { data: "make" },
      { data: "model" },
      { data: "branch" },
      { data: "purchasePrice" },
      { data: "status" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data) {
          return `
            <a href="/asset/view/${data.id}" class="btn btn-info btn-sm">View</a>
            <a href="/asset/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
          `;
        },
      },
    ],
  });

  $("#statusFilter,#categoryFilter").change(function () {
    table.ajax.reload();
  });

  $("#makeFilter,#modelFilter").keyup(function () {
    table.ajax.reload();
  });
});
$.ajax({
  url: "/category/getList",
  type: "POST",
  success: function (res) {
    let option = '<option value="">All Categories</option>';

    res.data.forEach(function (item) {
      option += `<option value="${item.id}">
        ${item.categoryName}
      </option>`;
    });

    $("#categoryFilter").html(option);
  },
});
// Category Dropdown
$.ajax({
  url: "/category/getList",
  type: "POST",
  success: function (res) {
    let option = '<option value="">Select Category</option>';

    res.data.forEach(function (item) {
      option += `<option value="${item.id}">${item.categoryName}</option>`;
    });

    $("#categoryId").html(option);
  },
});

// add
$("#assetForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#id").val(),
    assetCode: $("input[name='assetCode']").val(),
    assetName: $("input[name='assetName']").val(),
    serialNumber: $("input[name='serialNumber']").val(),
    categoryId: $("#categoryId").val(),
    make: $("input[name='make']").val(),
    model: $("input[name='model']").val(),
    branch: $("select[name='branch']").val(),
    purchasePrice: $("input[name='purchasePrice']").val(),
    status: $("select[name='status']").val(),
  };

  $.ajax({
    url: "/asset/create",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),

    success: function (res) {
      $("#message").html(`
        <div class="alert alert-success alert-dismissible fade show">
          ${res.message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `);

      setTimeout(function () {
        window.location.href = "/asset";
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

// Edit Asset
if (typeof assetId !== "undefined" && $("#assetForm").length) {
  // Load Category Dropdown
  $.ajax({
    url: "/category/getList",
    type: "POST",
    success: function (catRes) {
      let option = '<option value="">Select Category</option>';

      catRes.data.forEach(function (item) {
        option += `<option value="${item.id}">${item.categoryName}</option>`;
      });

      $("#categoryId").html(option);

      // Load Asset Details
      $.ajax({
        url: "/asset/detail/" + assetId,
        type: "GET",

        success: function (res) {
          $("#id").val(res.data.id);
          $("input[name='assetCode']").val(res.data.assetCode);
          $("input[name='assetName']").val(res.data.assetName);
          $("input[name='serialNumber']").val(res.data.serialNumber);
          $("#categoryId").val(res.data.categoryId);
          $("input[name='make']").val(res.data.make);
          $("input[name='model']").val(res.data.model);
          $("select[name='status']").val(res.data.status);
        },
      });
    },
  });
}

// View Asset
if (typeof assetId !== "undefined" && $("#assetCode").length) {
  $.ajax({
    url: "/asset/detail/" + assetId,
    type: "GET",

    success: function (res) {
      $("#assetCode").text(res.data.assetCode);
      $("#assetName").text(res.data.assetName);
      $("#serialNumber").text(res.data.serialNumber);
      $("#categoryName").text(res.data.AssetCategory.categoryName);
      $("#make").text(res.data.make);
      $("#model").text(res.data.model);
      $("#status").text(res.data.status);
    },
  });
}
