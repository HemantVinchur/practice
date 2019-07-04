const { Joi, celebrate } = require('celebrate')
const registerReqValidator = celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        countryCode: Joi.string().required(),
        contactNo: Joi.string().required(),
        password: Joi.string().required(),
    })
})

module.exports = {
    registerReqValidator
}