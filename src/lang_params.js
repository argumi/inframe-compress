const i18n = require('i18n')
const path = require('path')

// set up language
i18n.configure({
    locales: ['id', 'en'], 
    defaultLocale: 'en',
    directory: path.join(__dirname, 'languages')
})

module.exports = function(req, res, next) {
    let lang = req.params.lang
    i18n.init(req, res)
    lang = lang ? lang : 'en'
    i18n.setLocale(req, lang)
    return next()
}