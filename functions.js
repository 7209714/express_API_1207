var crypto = require('crypto'); // 加解密軟體 (內建模組)
var conf = require('./conf');
 
module.exports = {
    // 將明文密碼加密
    passwdCrypto: function (req, res, next) {
        if (req.body.password) {
            req.body.password = crypto.createHash('md5')
                                .update(req.body.password + conf.salt)
                                .digest('hex');
        }
 
        next();
    }
};