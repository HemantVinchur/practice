const functions = require('../functions');
const mongoose = require('mongoose');
const register = require('../models/user');
const validator = require('../validator/userValidator');
const jwt = require('jsonwebtoken');

//registration
const userRegister = async (req, res) => {
    try {
        let payLoad = req.body;
        console.log(payLoad);
        let findData = await register.findOne({ email: payLoad.email });
        if (findData) {
            return res.status(200).json({
                statusCode: 400,
                message: "user already exist",
                data: {}
            })

        }
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password

        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash

        let userData = await register.create(payLoad);
        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: userData
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })

    }


}
//login
const userLogin = async (req, res) => {
    try {
        let payLoad = req.body;
        console.log(payLoad)
        let data = await register.findOne({ email: payLoad.email });
        console.log(data)
        if (!data) {
            return res.status(200).json({
                statusCode: 401,
                message: "user not found",
                data: {}
            })

        }
        let isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(200).json({
                statusCode: 400,
                message: "invalid email and password",
                data: {}
            })
        }

        let token = jwt.sign({ email: payLoad.email }, 's3cr3t');
        console.log(token)
        // data.accessToken = token;
        //delete data.password;
        //   delete data.salt;

        return res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: data

        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong2",
            data: {}
        })
    }

}


//delete


const userDelete = async (req, res) => {
    try {
        let payLoad = req.body;
        let findData = await register.findOne({ email: payLoad.email });
        if (!findData) {
            return res.status(200).json({
                statusCode: 400,
                message: "user not exist",
                data: {}
            })

        }
        let dataDelete = await register.remove(payLoad);
        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: dataDelete
        })


    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })


    }
}


//get data
const userGet = async (req, res) => {
    try {
        let payLoad = req.params;
        let dataGet = await register.find(payLoad);
        return res.status(200).json({
            statusCode: 200,
            message: "sucess",
            data: dataGet
        })

    } catch (error) {
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })

    }
}


//update
const userUpdate = async (req, res) => {
    // let payLoad = req.body;
    try {
        let payLoad = req.body;
        if (!req.headers.authorization) {
            return res.status(200).json({
                statusCode: 400,
                message: "Access Token not found",
                data: {}
            })
        }
        let token = req.headers.authorization.split(' ')[1];

        let decodedData = await functions.authenticate(token);

        if (!decodedData) {
            return res.status(200).json({
                statusCode: 400,
                message: "Something went wrong",
                data: {}

            })

        }

        payLoad.email = decodedData.email;

        /*        console.log(payLoad);
                let dataFind = await register.findOne({ email: payLoad.email });
                if (!dataFind) {
                    res.status(200).json({
                        statusCode: 400,
                        message: "data not found",
                        data: {}
                    })
        
                }*/
        let dataUpdata = await register.updateOne({ email: payLoad.email },
            {
                    email: payLoad.email,
                    firstName: payLoad.firstName,
                    lastName: payLoad.lastName,
                    countryCode: payLoad.countryCode,
                    contact: payLoad.contact,
                    password: payLoad.password
            });
            return res.status(200).json({
                statusCode: 200,
                message: "sucess",
                data: dataUpdata
            })



    } catch (error) {
        console.log(error)
        res.status(200).json({
            statusCode: 400,
            message: "somthing went wrong",
            data: {}
        })


    }


}


module.exports = { userRegister, userLogin, userUpdate, userDelete, userGet };