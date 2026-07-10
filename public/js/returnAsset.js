$("#returnAssetTable").DataTable({
  processing: true,
  serverSide: false,
  ajax: {
    url: "/return/getList",
    type: "POST",
    dataSrc: "data",
  },
  columns: [
    { data: "IssueAsset.Employee.empCode" },
    { data: "IssueAsset.Employee.name" },
    { data: "IssueAsset.Employee.department" },
    { data: "IssueAsset.Asset.assetCode" },
    { data: "IssueAsset.Asset.assetName" },
    { data: "IssueAsset.Asset.serialNumber" },
    { data: "IssueAsset.Asset.make" },
    { data: "IssueAsset.Asset.model" },
    { data: "IssueAsset.issueDate" },
    { data: "returnDate" },
    { data: "reason" },
    { data: "IssueAsset.status" },
    {
      data: null,
      orderable: false,
      searchable: false,
      render: function (data) {
        return `
          <a href="/return/view/${data.id}" class="btn btn-info btn-sm">View</a>
          <a href="/return/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
        `;
      },
    },
  ],
});

// add
// Load Issued Assets
$.ajax({
  url: "/issue/getList",
  type: "POST",
  success: function (res) {
    let option = '<option value="">Select Issued Asset</option>';

    res.data.forEach(function (item) {
      option += `<option value="${item.id}">
        ${item.Employee.empCode} - ${item.Employee.name} | ${item.Asset.assetCode} - ${item.Asset.assetName}
      </option>`;
    });

    $("#issueAssetId").html(option);
  },
});

// add submit
$("#returnAssetForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#id").val(),
    issueAssetId: $("#issueAssetId").val(),
    returnDate: $("input[name='returnDate']").val(),
    reason: $("select[name='reason']").val(),
  };

  $.ajax({
    url: "/return/create",
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
        window.location.href = "/return";
      }, 1500);
    },

    error: function (err) {
      let message = "";

      if (err.responseJSON?.message) {
        message = err.responseJSON.message;
      } else if (err.responseJSON?.errors) {
        message = Object.values(err.responseJSON.errors)
          .map((item) => item.message)
          .join("<br>");
      }

      $("#message").html(`
        <div class="alert alert-danger alert-dismissible fade show">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `);
    },
  });
});

// View Return Asset
if (typeof returnId !== "undefined" && $("#empCode").length) {
  $.ajax({
    url: "/return/detail/" + returnId,
    type: "GET",

    success: function (res) {
      $("#empCode").text(res.data.IssueAsset.Employee.empCode);
      $("#employeeName").text(res.data.IssueAsset.Employee.name);
      $("#department").text(res.data.IssueAsset.Employee.department);

      $("#assetCode").text(res.data.IssueAsset.Asset.assetCode);
      $("#assetName").text(res.data.IssueAsset.Asset.assetName);
      $("#serialNumber").text(res.data.IssueAsset.Asset.serialNumber);
      $("#make").text(res.data.IssueAsset.Asset.make);
      $("#model").text(res.data.IssueAsset.Asset.model);

      $("#issueDate").text(res.data.IssueAsset.issueDate);
      $("#returnDate").text(res.data.returnDate);
      $("#reason").text(res.data.reason);
      $("#status").text(res.data.IssueAsset.status);
    },
  });
}

// Edit Return Asset
if (typeof returnId !== "undefined" && $("#returnAssetForm").length) {
  // Load Issued Asset Dropdown
  $.ajax({
    url: "/issue/getList",
    type: "POST",
    success: function (issueRes) {
      let option = '<option value="">Select Issued Asset</option>';

      issueRes.data.forEach(function (item) {
        option += `
          <option value="${item.id}">
            ${item.Employee.empCode} - ${item.Employee.name} | ${item.Asset.assetCode} - ${item.Asset.assetName}
          </option>
        `;
      });

      $("#issueAssetId").html(option);

      // Load Return Asset Details
      $.ajax({
        url: "/return/detail/" + returnId,
        type: "GET",

        success: function (res) {
          $("#id").val(res.data.id);
          $("#issueAssetId").val(res.data.issueAssetId);
          $("input[name='returnDate']").val(res.data.returnDate);
          $("select[name='reason']").val(res.data.reason);
        },
      });
    },
  });
}
