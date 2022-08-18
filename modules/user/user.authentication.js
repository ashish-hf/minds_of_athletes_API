var jwt = require('jsonwebtoken');
class AuthenticateUser {
    //verify token
    static async verifyToken(req, res, next) {
        const token = req.headers.authorization;
        if (token) {
            try {
                let decoded = jwt.verify(token, 'secret')
                req.id = decoded.id;
                next();
            } catch (err) {
                console.log(err)
                return res.sendStatus(401);
            }
        }
        else {
            return res.send("not authorized")
        }
    }
}
module.exports = AuthenticateUser