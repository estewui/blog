const jwt = require("jsonwebtoken");

exports.addUser = function (req, res, next) {
    const token = req.header('Authorization');

    try {
        const clearToken = token.startsWith('Bearer ') && token.slice(7, token.length).trimLeft();
        const verified = jwt.verify(clearToken, process.env.JWT_SECRET); 
        req.user = verified;
        next();
    }
    catch (err) {
        next();
    }
}

exports.loggedIn = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send();
    }

    try {
        const clearToken = token.startsWith('Bearer ') && token.slice(7, token.length).trimLeft();
        const verified = jwt.verify(clearToken, process.env.JWT_SECRET); 
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(401).send();
    }
}