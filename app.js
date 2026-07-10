const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/database");
const PORT = process.env.PORT || 3000;

const { employeeListPage } = require("./controller/employeeController");

app.use(express.json());
require("./routes")(app);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", employeeListPage);
app.use("/employees", require("./routes/employeeRoutes"));
app.use("/category", require("./routes/categoryRoutes"));
app.use("/asset", require("./routes/assetRoutes"));
app.use("/issue", require("./routes/issueAssetRoutes"));
app.use("/return", require("./routes/returnAssetRoutes"));
app.use("/stock", require("./routes/stockRoutes"));
app.use("/scrap", require("./routes/scrapRoutes"));

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.error(err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
