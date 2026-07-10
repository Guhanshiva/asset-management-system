$(document).ready(function () {
  // Category List DataTable
  if ($("#categoryTable").length) {
    $("#categoryTable").DataTable({
      processing: true,
      serverSide: false,
      ajax: {
        url: "/category/getList",
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
        { data: "categoryName" },
        { data: "description" },
        { data: "status" },
        {
          data: null,
          orderable: false,
          searchable: false,

          render: function (data) {
            return `
        <a href="/category/view/${data.id}" class="btn btn-info btn-sm">View</a>
        <a href="/category/edit/${data.id}" class="btn btn-warning btn-sm ms-1">Edit</a>
      `;
          },
        },
      ],
    });
  }
  $("#statusFilter").change(function () {
    $("#categoryTable").DataTable().ajax.reload();
  });
});

// category add
$("#categoryForm").on("submit", function (e) {
  e.preventDefault();

  const payload = {
    id: $("#id").val(),
    categoryName: $("input[name='categoryName']").val(),
    description: $("input[name='description']").val(),
    status: $("select[name='status']").val(),
  };

  $.ajax({
    url: "/category/create",
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
        window.location.href = "/category";
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

//   view
if (typeof categoryId !== "undefined") {
  $.ajax({
    url: "/category/detail/" + categoryId,
    type: "GET",
    success: function (res) {
      $("#categoryName").text(res.data.categoryName);
      $("#description").text(res.data.description);
      $("#status").text(res.data.status);
    },
  });
  // edit
  if (typeof categoryId !== "undefined" && $("#categoryForm").length) {
    $.ajax({
      url: "/category/detail/" + categoryId,
      type: "GET",
      success: function (res) {
        $("#id").val(res.data.id);
        $("input[name='categoryName']").val(res.data.categoryName);
        $("input[name='description']").val(res.data.description);
        $("select[name='status']").val(res.data.status);
      },
    });
  }
}
