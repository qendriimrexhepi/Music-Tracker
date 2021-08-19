const Joi = require ('joi')
module.exports = {
    register (req, res, next){
        const schema = {
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            )
        }
        const {error, value} = Joi.validate(req.body,  schema)

        if (error) {
          switch (error.details[0].context.key){
              case 'email':
                  res.status(400).send({
                      error: 'Shkruja email valid'
                  })
                  break
                  case 'password':
                      res.status(400).send({
                          error:`Fjalkalimi deshtoi sepse nuk ju pershtat rregullave:
                           <br>
                           1.Dueht te permbaj keto karaktere: shkronj e madhe e vogel,numra,por jo simbole sikur (!@£),
                           <br>
                           2.Duhe te jet se paku 8 karaktere deri ne 32.
                          `
                      })
                      break
                      default:
                          res.status(400).send({
                              error:'Regjistrimi invalid'
                          })
                }
              }

                 else{
            next()
        }
    }
}