const http = require("http");
const path = require("path");
const axios = require("axios");
const { log } = require("console");

exports.index = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("kecilin.id/index", { lang: lang, menu: "/" });
};

exports.store_user_compression = (req, res) => {
  let phone = req.body.phone;
  let company = req.body.companyData;
  let problem = req.body.problemEncountered;
  let type = req.body.type;

  axios
    .post(process.env.URL_API_BACKEND + "/api/v1/user_compression", {
      companyData: company,
      problemEncountered: problem,
      phone: phone,
      type: type,
    })
    .then((response) => {
      if (response.status == 201) {
        res.send({ status: 200, message: "Success send data!" });
      } else {
        res.send({ status: 400, message: "Error in Proccess!" });
      }
    });
};

exports.store_wa = (req, res) => {
  let name = req.body.name;
  let phone = req.body.phone;

  axios
    .post(process.env.URL_API_BACKEND + "/api/v1/send_whatsapp", {
      name: name,
      phone: phone,
    })
    .then((response) => {
      if (response.status == 201) {
        res.send({ status: 200, message: "Success send data!" });
      } else {
        res.send({ status: 400, message: "Error in Proccess!" });
      }
    });
};

exports.revampIndex = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/index", { lang: lang, menu: "/" });
};
