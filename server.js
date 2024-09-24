"use strict";
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require("http");
const path = require("path");
const cors = require("cors");
const flash = require("express-flash");
const lang_params = require("./src/lang_params");

const app = express();
const PORT = process.env.PORT || 8100;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set("views", path.join(__dirname, "src/pagesv2"));
app.set("view engine", "ejs");
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "k3cilin",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static("public"));
app.use(flash());
app.use((req, res, next) => {
  const successFlashMessageArr = req.flash("success");
  const errorFlashMessageArr = req.flash("errors");
  const failedFlashMessageArr = req.flash("failed");
  res.locals.successFlashMessage = successFlashMessageArr[0];
  res.locals.errorFlashMessage = errorFlashMessageArr;
  res.locals.failedFlashMessage = failedFlashMessageArr[0];
  next();
});

const indexPage = require("./src/index");
const uploadPage = require("./src/new_upload");

const report = require("./src/report");
const uploadfile = require("./src/upload");

app.get("/report", report.reportGet);
app.get("/report/data", report.reportDev);
app.post("/upload-file", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/config/upload-file.php"));
});

app.post("/upload", uploadfile.uploadFile);
app.get("/download/:file", uploadfile.downlaodFile);

app.post("/api/send_user", indexPage.store_user_compression);
app.post("/api/send_wa", indexPage.store_wa);

// Compressing
app.post("/api/upload_compress", uploadPage.uploadFileCompress);
app.get("/api/upload_compress/:filename", uploadPage.show_image_compress);

// NEW  REVAMP 2023
app.get("/", lang_params, indexPage.revampIndex);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
