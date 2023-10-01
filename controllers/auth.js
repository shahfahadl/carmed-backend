const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");

const validate = async (req, res, next) => {

    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        const error = new Error("Not authorized");
        error.status = 401;
        error.code = "not_authorized";
        throw error;
      } else {
        const decoded = jwt.verify(authorization, process.env.TOKEN_SECRET)
        const id =  decoded?.id;
        const type = req.headers.type;
        let account = {};
        if(type === 'user'){
          account = await prisma.user.findFirst({
            where: {
              id
            }
          });
        } else {
          account = await prisma.vendor.findFirst({
            where: {
              id
            }
          })
        }
        if(!!account?.blocked){
          const error = new Error("User Blocked");
          error.status = 405;
          error.code = "blocked";
          throw error;
        }
      }
    next();
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  validate
}