// Authorization middleware
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader
    console.log(authHeader)
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

module.exports = {authenticateToken}