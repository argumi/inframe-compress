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

exports.store_people_counting = (req, res) => {
  try {
    const directoryOrigin = path.join(
      process.cwd(),
      "public/assets/people_counting/"
    );
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, directoryOrigin);
      },
      filename: function (req, file, callback) {
        const imageName = Date.now() + "-" + file.originalname;
        callback(null, imageName);
      },
    });

    let upload = multer({ storage: storage }).array("image", 1);

    upload(req, res, function (err) {
      if (err) {
        return res.end(err.message);
      }
      console.log(req.files);
    });

    let image = req.body.image;
    let formData = new FormData();
    formData.append("image", image);

    axios
      .post(process.env.URL_API_BACKEND + "/api/v1/people_counting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status == 201) {
          res.send({ status: 200, message: "Success send data!" });
        } else {
          res.send({ status: 400, message: "Error in Proccess!" });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

exports.about = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("kecilin.id/about", { lang: lang, menu: "about" });
};

exports.enterprise = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "";
  res.render("kecilin.id/enterprise", { lang: lang, menu: "enterprise" });
};

exports.vpnPage = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "";
  res.render("kecilin.id/vpn", { lang: lang, menu: "vpnplus" });
};

exports.cloud = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "";
  res.render("kecilin.id/cloud", { lang: lang, menu: "cloud" });
};

exports.cctv = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "";
  res.render("kecilin.id/cctv", { lang: lang, menu: "cctv" });
};

exports.tnc = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/tnc", { lang: lang, menu: "tnc" });
};

exports.privacyPolicy = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/policy", { lang: lang, menu: "privacyPolicy" });
};

exports.imageCompression = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang : "";
  res.render("imagecompression", { lang: lang, menu: "imagecompression" });
};

exports.downloadbooster = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "";
  res.render("downloadbooster", { lang: lang, menu: "downloadbooster" });
};

exports.total_data = (req, res) => {
  axios.get("http://103.28.52.229:3118/data/total_data").then((resp) => {
    res.send(resp.data);
  });
};

//route for kloud.kecilin.id
exports.kloudIndex = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("kloud.kecilin.id/landing", { lang: lang, menu: "/" });
};

exports.kloudFeature = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("kloud.kecilin.id/feature", { lang: lang, menu: "/" });
};

exports.kloudTerms = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("kloud.kecilin.id/terms", { lang: lang, menu: "/" });
};

exports.revampIndex = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/index", { lang: lang, menu: "/" });
};

exports.revampAbout = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/our-company", { lang: lang, menu: "/our-company" });
};

exports.revampLivestream = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/livestream", { lang: lang, menu: "/livestream" });
};

exports.revampDataoptimizer = (req, res) => {
  let lang = req.params.lang;
  lang = lang ? lang + "/" : "en/";
  res.render("revamp/data-optimizer", { lang: lang, menu: "/dataoptimizer" });
};
