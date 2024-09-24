const axios = require('axios')
const math = require('mathjs')
require('dotenv').config()

exports.reportGet = (req, res, next) => {

    axios.get(process.env.URL_API+'report')
    .then(data_res => {
        let data = data_res.data.data
        let total_saved = 0
        let total_processed = 0
        let response = 0
        for(let i in data){
            if(data[i].content === 'saved-bytes'){
                total_saved = data[i].number + total_saved
            }
            if(data[i].content === 'processed-bytes'){
                total_processed = data[i].number + total_processed
            }
        }

        if(req.query.type === "process"){
            response = math.round((total_processed/1073741824),2)+" GB"
        }else if (req.query.type === "save"){
            response = math.round(((total_saved*100)/total_processed),2)+" %"
        }
    
        res.send(response)
    })
    .catch(err => {
        res.status(500).send(err.message)
        console.log(err.message)
    })

}

exports.reportDev = (req, res) => {
    axios.get('https://dev.haboplatform.id/data/total_data')
    .then(data => {
        res.send({
            data: {
                total_inbound: data.data.data.total_inbound,
                total_outbound: data.data.data.total_outbound,
                total_ratio: data.data.data.total_rasio
            }
        })
    })
    .catch(err => {
        console.log(err.message)
    })
}