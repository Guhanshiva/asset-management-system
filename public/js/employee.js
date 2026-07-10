$(document).ready(function () {
  // Employee List DataTable
  if ($("#employeeTable").length) {
    $("#employeeTable").DataTable({
      processing: true,
      serverSide: false,
      ajax: {
        url: "/employees/getList",
        type: "POST",
        data: function () {
          return {
            page: 1,
            limit: 10,
            status: $("#statusFilter").val(),
          };
        },
        dataSrc: "data",
      },
      columns: [
        { data: "empCode" },
        { data: "name" },
        { data: "email" },
        { data: "department" },
        { data: "designation" },
        { data: "status" },
        {
          data: null,
          orderable: false,
          searchable: false,

          render: function (data) {
            return `
        <a href="/employees/view/${data.id}" class="btn btn-info btn-sm">View</a>
        <a href="/employees/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
      `;
          },
        },
      ],
    });
  }
  $("#statusFilter").change(function () {
    $("#employeeTable").DataTable().ajax.reload();
  });

  // Add Employee
  $("#employeeForm").on("submit", function (e) {
    e.preventDefault();

    const payload = {
      id: $("#id").val(),
      empCode: $("input[name='empCode']").val(),
      name: $("input[name='name']").val(),
      email: $("input[name='email']").val(),
      department: $("input[name='department']").val(),
      designation: $("input[name='designation']").val(),
      status: $("select[name='status']").val(),
    };

    $.ajax({
      url: "/employees/create",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),

      //   success: function (res) {
      //     alert(res.message);
      //     window.location.href = "/employees";
      //   },

      success: function (res) {
        $("#message").html(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ${res.message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `);

        setTimeout(function () {
          window.location.href = "/employees";
        }, 1500);
      },

      //   error: function (err) {
      //     alert(err.responseJSON.message);
      //   },

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

  //   view
  if (typeof employeeId !== "undefined") {
    $.ajax({
      url: "/employees/detail/" + employeeId,
      type: "GET",
      success: function (res) {
        $("#empCode").text(res.data.empCode);
        $("#name").text(res.data.name);
        $("#email").text(res.data.email);
        $("#department").text(res.data.department);
        $("#designation").text(res.data.designation);
        $("#status").text(res.data.status);
      },
    });
  }
  // edit
  if (typeof employeeId !== "undefined" && $("#employeeForm").length) {
    $.ajax({
      url: "/employees/detail/" + employeeId,
      type: "GET",

      success: function (res) {
        $("#id").val(res.data.id);
        $("input[name='empCode']").val(res.data.empCode);
        $("input[name='name']").val(res.data.name);
        $("input[name='email']").val(res.data.email);
        $("input[name='department']").val(res.data.department);
        $("input[name='designation']").val(res.data.designation);
        $("select[name='status']").val(res.data.status);
      },
    });
  }
});
