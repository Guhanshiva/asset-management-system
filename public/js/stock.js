$(document).ready(function () {
  if ($("#stockTable").length) {
    $("#stockTable").DataTable({
      processing: true,
      serverSide: false,

      ajax: {
        url: "/stock/getList",
        type: "POST",

        dataSrc: function (res) {
          $("#totalAssets").text(res.totalAssets);
          $("#totalValue").text(res.totalValue);

          $("#footerTotalAssets").text(res.totalAssets);
          $("#footerTotalValue").text("₹ " + res.totalValue);

          let rows = "";

          Object.keys(res.branchSummary).forEach(function (branch) {
            rows += `
              <tr>
                <td>${branch}</td>
                <td>${res.branchSummary[branch].totalAssets}</td>
                <td>₹ ${res.branchSummary[branch].totalValue}</td>
              </tr>
            `;
          });

          $("#branchSummary").html(rows);

          return res.data;
        },
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
      ],
    });
  }
});
