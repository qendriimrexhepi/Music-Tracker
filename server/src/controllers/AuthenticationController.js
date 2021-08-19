const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require ('../config/config')

function jwtSignUser (user){
const ONE_WEEK = 60 * 60 * 24 * 7
return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
})
}

module.exports = {
    async register (req, res) {
        try {
            const user = await User.create(req.body)
            res.send(user.toJSON())
        }catch (err) {
            res.status(400).send({
                error: 'Kjo email egziston.'
            })
        }
    },
    async login (req, res) {
        try {
            const {email, password}= req.body
            const user = await User.findOne({
                where: {
                email: email  
                }
            })  
            if (!user){
                return res.status(403).send({
                    error:'Informacioni per tu kyçur është gabim'
                })
            }
            const isPasswordValid = password === user.password
            if (!isPasswordValid){
                return res.status(403).send({
                    error:'Email gabim ose Fjalëkalimi'
                })
            }
             
            const userJson=user.toJSON()
            res.send({
                user:userJson,  
                token:jwtSignUser(userJson)
            })
            

            
        }catch (err) {
            res.status(500).send({
                error: 'Ka ndodhur një gabim për tu kyçur',
                
            })
        }
    }
}