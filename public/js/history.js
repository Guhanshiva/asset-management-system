$(document).ready(function () {
  if ($("#historyTable").length) {
    $("#historyTable").DataTable({
      processing: true,
      serverSide: false,

      ajax: {
        url: "/stock/getListHistory",
        type: "POST",
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
              <a href="/stock/history/view/${data.id}" class="btn btn-info btn-sm">
                View
              </a>
            `;
          },
        },
      ],
    });
  }
});

// View Asset History
if (typeof assetId !== "undefined" && $("#assetCode").length) {
  $.ajax({
    url: "/stock/detail/" + assetId,
    type: "GET",

    success: function (res) {
      const asset = res.data.asset;

      $("#assetCode").text(asset.assetCode);
      $("#assetName").text(asset.assetName);
      $("#serialNumber").text(asset.serialNumber);
      $("#categoryName").text(asset.AssetCategory.categoryName);
      $("#make").text(asset.make);
      $("#model").text(asset.model);
      $("#branch").text(asset.branch);
      $("#purchasePrice").text(asset.purchasePrice);
      $("#status").text(asset.status);

      let rows = "";

      res.data.issueHistory.forEach(function (item) {
        rows += `
          <tr>
            <td>${item.Employee.empCode}</td>
            <td>${item.Employee.name}</td>
            <td>${item.Employee.department}</td>
            <td>${item.issueDate}</td>
            <td>${item.ReturnAsset ? item.ReturnAsset.returnDate : "-"}</td>
            <td>${item.ReturnAsset ? item.ReturnAsset.reason : "-"}</td>
            <td>${item.status}</td>
          </tr>
        `;
      });

      $("#historyBody").html(rows);
    },
  });
}
