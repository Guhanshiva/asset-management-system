$("#issueAssetTable").DataTable({
  processing: true,
  serverSide: false,
  ajax: {
    url: "/issue/getList",
    type: "POST",
    dataSrc: "data",
  },
  columns: [
    { data: "Employee.empCode" },
    { data: "Employee.name" },
    { data: "Employee.department" },
    { data: "Asset.assetCode" },
    { data: "Asset.assetName" },
    { data: "Asset.make" },
    { data: "Asset.model" },
    { data: "issueDate" },
    { data: "status" },
    {
      data: null,
      orderable: false,
      searchable: false,
      render: function (data) {
        return `
          <a href="/issue/view/${data.id}" class="btn btn-info btn-sm">View</a>
          <a href="/issue/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
        `;
      },
    },
  ],
});

// employee dropdown
$.ajax({
  url: "/employees/getList",
  type: "POST",
  success: function (res) {
    let option = '<option value="">Select Employee</option>';

    res.data.forEach(function (item) {
      option += `<option value="${item.id}">
        ${item.empCode} - ${item.name}
      </option>`;
    });

    $("#employeeId").html(option);
  },
});

// asset dropdown

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

// Add Issue Asset
$("#issueAssetForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#id").val(),
    employeeId: $("#employeeId").val(),
    assetId: $("#assetId").val(),
    issueDate: $("input[name='issueDate']").val(),
  };

  $.ajax({
    url: "/issue/create",
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
        window.location.href = "/issue";
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
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `);
    },
  });
});

// View Issue Asset
if (typeof issueId !== "undefined" && $("#empCode").length) {
  $.ajax({
    url: "/issue/detail/" + issueId,
    type: "GET",

    success: function (res) {
      $("#empCode").text(res.data.Employee.empCode);
      $("#employeeName").text(res.data.Employee.name);
      $("#department").text(res.data.Employee.department);
      $("#designation").text(res.data.Employee.designation);

      $("#assetCode").text(res.data.Asset.assetCode);
      $("#assetName").text(res.data.Asset.assetName);
      $("#serialNumber").text(res.data.Asset.serialNumber);
      $("#make").text(res.data.Asset.make);
      $("#model").text(res.data.Asset.model);

      $("#issueDate").text(res.data.issueDate);
      $("#status").text(res.data.status);
    },
  });
}

// Edit Issue Asset
if (typeof issueId !== "undefined" && $("#issueAssetForm").length) {
  // Load Employees
  $.ajax({
    url: "/employees/getList",
    type: "POST",
    success: function (empRes) {
      let empOption = '<option value="">Select Employee</option>';

      empRes.data.forEach(function (item) {
        empOption += `<option value="${item.id}">
          ${item.empCode} - ${item.name}
        </option>`;
      });

      $("#employeeId").html(empOption);

      // Load Assets
      $.ajax({
        url: "/asset/getList",
        type: "POST",
        success: function (assetRes) {
          let assetOption = '<option value="">Select Asset</option>';

          assetRes.data.forEach(function (item) {
            assetOption += `<option value="${item.id}">
              ${item.assetCode} - ${item.assetName}
            </option>`;
          });

          $("#assetId").html(assetOption);

          // Load Issue Details
          $.ajax({
            url: "/issue/detail/" + issueId,
            type: "GET",

            success: function (res) {
              $("#id").val(res.data.id);
              $("#employeeId").val(res.data.employeeId);
              $("#assetId").val(res.data.assetId);
              $("input[name='issueDate']").val(res.data.issueDate);
              $("select[name='status']").val(res.data.status);
            },
          });
        },
      });
    },
  });
}
