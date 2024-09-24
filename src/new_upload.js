const path = require("path");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require('form-data');
const mime = require('mime-types');
const mimeCheck = require('mime')

exports.uploadFile = (req, res, next) => {
  const directoryOrigin = path.join(
    process.cwd(),
    "public/people_counting/"
  );
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, path.join(__dirname, "../public/people_counting"));
    },
    filename: function (req, file, callback) {
      const imageName = Date.now() + "-" + file.originalname;
      callback(null, imageName);
    },
  });
  
  let upload = multer({ storage: storage }).single("file");
  let listdata = [];
  
  upload(req, res, async function (err) {
    if (err) {
      return res.end(err.message);
    }

    if(req.file === undefined) {
      return res.status(422).send({
        status: 422,
        message: "The file field cannot be empty",
      })
    }

    const formData = new FormData()
    formData.append('image', fs.createReadStream(req.file.path))
  
    const config = {
      method: 'post',
      url: process.env.URL_API_BACKEND + "/api/v1/people_counting", 
      headers: {
        ...formData.getHeaders()
      },
      data: formData,
      maxContentLength: 20 * 1024 * 1024,
      maxBodyLength: 20 * 1024 * 1024
    };
    await axios(config)
    .then(resp => {
        if(resp.data.status === 200) {
          res.send({
            status: 200,
            message: "Upload data successfully",
            data: {
              count: resp.data.result.data.count,
              filename: resp.data.result.data.filename,
              link: "/api/upload_people_counting/"+resp.data.result.data.filename
            }
          })
        } 
    })
    .catch(err => {
      if(err.response) {
        if(err.response.data.status === 400) {
          return res.status(err.response.data.status).send({
            status: err.response.data.status,
            message: err.response.data.message,
          })
        }
      }
      if(err.message === "Request body larger than maxBodyLength limit") {
        return res.status(422).send({
          status: 422,
          message: "File size exceeds the maximum limit",
        })
      }

      return res.status(500).send({
        status: 500,
        message: err.message,
      })
    })

  })
};

exports.show_image = (req, res, next) => {
  try {
    const filename = req.params.filename
    
    axios.get(process.env.URL_API_BACKEND + "/api/v1/people_counting/image/"+filename, { responseType: 'stream' })
    .then(resp => {
      res.set('Content-Type', resp.headers['content-type']);

      resp.data.pipe(res);
    })
    .catch(err => {
      if(err.response.status === 404) {
        return res.status(404).send();
      }
      return res.status(500).send();
    })
  } catch (error) {
    return res.status(500).send();
  }
}

exports.uploadFileCompress = async (req, res) => {
  if (parseInt(req.headers['content-length'], 10) > 209715200) {
    return res.status(422).send({
      status: 422,
      message: "Max size file upload 200MB",
    })
  }
  const directoryOrigin = path.join(
    process.cwd(),
    "public/compressing/"
  );
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      const allowFormat = ['image/jpg', 'image/jpeg', 'image/png']
      if(!allowFormat.includes(file.mimetype)) {
        return res.status(422).send({ status: 422, message: "Invalid file format"})
      }
      callback(null, directoryOrigin);
    },
    filename: function (req, file, callback) {
      const imageName = Date.now() + "-" + file.originalname;
      callback(null, imageName);
    },
  });
  
  let upload = multer({ storage: storage }).single("file");
  let listdata = [];
  
  upload(req, res, async function (err) {
    if (err) {
      return res.end(err.message);
    }

    const formData = new FormData()
    formData.append('file', fs.createReadStream(req.file.path))

    const config = {
      method: 'post',
      url: process.env.URL_API_COMPRESS + "/api/post/compress", 
      headers: {
        ...formData.getHeaders(),
      },
      responseType: 'stream',
      data: formData,
      maxContentLength: 200 * 1024 * 1024,
      maxBodyLength: 200 * 1024 * 1024
    };
    const size_old = req.file.size
 
    await axios(config)
    .then(resp => {
        const fileExtension = mime.extension(resp.headers['content-type'])
        const filename_new = Date.now() + Math.floor(Math.random() * (1000 - 1 + 1)) + 1 + "."+fileExtension
        
        const outPath = path.join(process.cwd(), "public/compressing_out/"+filename_new)
        resp.data.pipe(fs.createWriteStream(outPath))

        res.send({
          status: 200,
          message: "Upload data successfully",
          data: {
            size_ori: size_old,
            compress_size: parseInt(resp.headers['content-length'], 10),
            filename: filename_new,
            link: "/api/upload_compress/"+filename_new
          }
        })
    })
    .catch(err => {
      res.send({
        status: 500,
        message: err.message,
      })
    })

  })
}

exports.show_image_compress = async (req, res, next) => {
  try {
    const filename = req.params.filename
    const outPath = path.join(process.cwd(), "public/compressing_out/"+filename)
    fs.stat(outPath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send();
        } else {
            return res.status(500).send();
        }
      }

      let mimeType = mimeCheck.getType(outPath)
      res.setHeader('Content-type', mimeType)
      const file = fs.createReadStream(outPath)
      file.pipe(res)
      return
    })
  } catch (error) {
    return res.status(500).send();
  }
}