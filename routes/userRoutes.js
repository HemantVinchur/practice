const router = require('express').Router();
const validator = require('../validator');
const userModel = require('../models/User');
const celebrate = require('celebrate');
const mongodb = require('mongodb');
const functions = require('../functions');
const jwt = require('jsonwebtoken')
//Register
router.post('/register', validator.userValidator.registerReqValidator, (req, res) => {

    let payload = req.body;
    userModel.findOne({ email: payload.email })
        .then((donardata) => {
            if (donardata) {
                return res.status(200).json({
                    statuscode: 400,
                    message: "User already exits",
                    data: {}
                })
            }
            let hashObj = functions.hashPassword(payload.password);
            console.log(hashObj)
            delete payload.password
            payload.salt = hashObj.salt;
            payload.password = hashObj.hash;

            userModel.create(payload)
                .then((data) => {
                    return res.status(200).json({
                        statuscode: 200,
                        message: "Success",
                        data: data
                    })
                }).catch((error) => {
                    console.error(error);
                    return res.status(200).json({
                        statusCode: 400,
                        message: "Something went wrong",
                        data: {}
                    })
                })
        }).catch((error) => {
            console.error(error);
            return res.status(200).json({
                statusCode: 400,
                message: "Something went wrong",
                data: {}
            })
        })
});

//Login
router.post('/login', (req, res) => {
    try {
        let payload = req.body;
        userModel.findOne({ email: payload.email }, (error, data) => {
            if (error) {
                console.error(error);
                return res.json({
                    statusCode: 400,
                    message: "Something went wrong",
                    data: {}
                })
            }
            if (!data) {
                return res.status(200).json({
                    statusCode: 400,
                    message: "User not found",
                    data: {}
                })
            }
              let isPasswordValidate = functions.validatePassword(data.salt, payload.password, data.password);
              console.log(isPasswordValidate);
              if (!isPasswordValidate) {
                  return res.status(200).json({
                      statusCode: 400,
                      message: "Invalid email or password",
                      data: {}
                  })
              }

             let token = jwt.sign({ email: payload.email },'s3cr3t');
             console.log(token)
             return res.status(200).json({
                 statusCode: 200,
                 message: "Login successful",
                 data: data
             })
     })
    } catch (error) {
        res.json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})

//Tokens

router.get('/', (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, 's3cr3t', (error, decoded) => {
        if (error) {
            throw error;
        }
        console.log(decoded);
    })
    return res.json({
        statusCode:200,
        message:"Hello",
        data:token
})
})
router.put('/update/:id', (req, res) => {
    let payload = req.body;
    try {
        userModel.findOne({ email: payload.email }, (error, data) => {
            userModel.updateOne(
                {
                    email: payload.email
                },
                {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    countryCode: payload.countryCode,
                    contactNo: payload.contactNo,
                    password: payload.password

                },
                (error, data) => {
                    if (error) {
                        res.status(400).json({
                            statusCode: 400,
                            message: "user not found",
                            data: {}
                        })
                    }
                    return res.status(200).json({
                        statusCode: 200,
                        message: "Successful",
                        data: data
                    })
                })
        })
    } catch (error) {

        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong"
        })
    }
})

router.delete('/delete', (req, res) => {
    let payload = req.body;
    try {
        userModel.remove({ email: payload.email }, (error, results) => {
            if (error) {
                return next(error)
                res.send(results)
            }
            else {
                res.send("Successfully deleted")
            }
        })
    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "Something went wrong",
            data: {}
        })
    }
})
module.exports = router; 