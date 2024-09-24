const axios = require('axios')
const path = require('path')
const http = require('http')
const fs = require('fs')
const multer = require('multer')
const mime = require('mime')
const sharp = require('sharp')
const {PythonShell} = require('python-shell')

exports.uploadFile = (req, res, next) => {

    const directoryOrigin = path.join(process.cwd(), 'public/assets/asli/')
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, directoryOrigin)
        },
        filename: function(req, file, callback) {  
            const imageName = Date.now() +'-'+ file.originalname
            callback(null, imageName)
        }
    })
    
    let upload = multer({ storage : storage }).array('file', 30)
    let listdata = []

    upload(req,res,function(err) {
        if(err) {
            return res.end(err.message)
        }

        let countCompress = req.files.length - 1

        const compressKecilin = path.join(__dirname + '/librarys/compress.py')
        const fileCompress = path.join(__dirname + '/../public/assets/compress')
        
        for(let datafile in req.files){
            let dataname = req.files[datafile].filename
            let fileOriginal = path.join(__dirname + '/../public/assets/asli/'+ dataname)
            let datatype = req.files[datafile].mimetype
            
            let content = { 
                directory: fileCompress, 
                filename: dataname,
                fileorigin: fileOriginal,
                filetypedata: datatype
            }
            
            let options = {
                mode: 'text',
                pythonOptions: ['-u'],
                args: JSON.stringify(content)
            }
            
            if(datatype === 'image/jpeg' || datatype === 'application/sql' || datatype === 'application/pdf'){
                PythonShell.run(compressKecilin, options, async (err, resdata) => {
                    if(resdata){
                        let respons = JSON.parse(resdata)
                        let filename = respons.filename
                        let filetype = respons.filetype

                        let filechange = path.join(__dirname + '/../public/assets/compress/'+dataname)

                         // Change file name
                        fs.rename(respons.filepath, filechange, (err) => {
                            if ( err ) console.log('ERROR: ' + err)

                            // Rename File
                            let namechange = filename.split("-")
                            namechange = filename.replace(namechange[0], "")
                            namechange = namechange.substring(1)

                            listdata.push({name: namechange, dataname})
                            
                            if(0 === Number(datafile)){
                                res.send(listdata)
                            }
                        })
                    }
                })
            }
        }

    });
}

exports.downlaodFile = (req, res, next) => {
    const fileCompress = path.join(process.cwd(), 'public/assets/compress/' + req.params.file)

    let filename = path.basename(fileCompress)
    let mimeType = mime.getType(fileCompress)

    let namechange = filename.split("-")
    namechange = filename.replace(namechange[0], "")
    namechange = namechange.substring(1)

    res.setHeader('Content-disposition', 'attachment; filename=kecilin-'+ namechange)
    res.setHeader('Content-type', mimeType)

    fileStream = fs.createReadStream(fileCompress)
    fileStream.pipe(res)
}
