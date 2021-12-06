var express = require('express');
var oauth2 = require('../models/oauth2');
var accounts = require('../models/accounts');
 
var router = express.Router();
 
// oauth2.accessControl 定義在這，對 Web API 的所有 CRUD 確認權限
/*
router.use(oauth2.accessControl, function (req, res, next) {
    // 無權限
    if (res.customError) {
        res.status(res.customStatus).json(res.customError);
        return;
    }
 
    next();
});
*/
// 獲取 /accounts 請求
router.route('/')
    // 取得所有資源
    // oauth2.accessControl 定義在這，可針對 Web API 的 CRUD 個別確認權限
    .get(oauth2.accessControl, function (req, res) {
        // 無權限
        if (res.customError) {
            res.status(res.customStatus).json(res.customError);
            return;
        }
 
        accounts.users(req, function (err, results, fields) {                   //成功
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            // 沒有找到指定的資源
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
 
            res.json({'data':results});
        });
    })

router.route('/User')                                                            //成功
    // 新增一筆資源
    .post(function (req, res) {
        accounts.addUser(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            // 新的資源已建立 (回應新增資源的 id)
            res.status(201).json(results.insertId);
        });
    });

router.route('/Item')                                                               //成功
    .post(function (req, res) {
        accounts.addItem(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            // 新的資源已建立 (回應新增資源的 id)
            res.status(201).json(results.insertId);
        });
    })
    .patch(oauth2.accessControl,function (req, res) {                                                                            
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        accounts.patchItem(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
             
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }
             
            // response 被更新的資源欄位，但因 request 主體的欄位不包含 id，因此需自行加入
            req.body.id = req.params.id;
            res.json([req.body]);
        });
    });

router.route('/Hint')                                                                //成功
    .post(function (req, res) {
        accounts.addHint(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            // 新的資源已建立 (回應新增資源的 id)
            res.status(201).json(results.insertId);
        });
    })
    .patch(oauth2.accessControl,function (req, res) {                                                                            
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        accounts.patchHint(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
             
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }
             
            // response 被更新的資源欄位，但因 request 主體的欄位不包含 id，因此需自行加入
            req.body.id = req.params.id;
            res.json([req.body]);
        });
    });
 
// 獲取如 /accounts/1 請求
router.route('/User/:id')                                                           //成功
    // 取得指定的一筆資源
    .get(function (req, res) {
        accounts.user(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
 
            res.json(results);
        });
       /* accounts.item(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
 
            res.json(results);
        });*/
    })
    // 刪除指定的一筆資源
    .delete(oauth2.accessControl,function (req, res) {                                                    //成功
        accounts.delete(req, function (err, results, fields) {
            
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            // 指定的資源已不存在
            // SQL DELETE 成功 results.affectedRows 會返回 1，反之 0
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }
 
            // 沒有內容 (成功)
            res.sendStatus(204);
        });
    })
    // 覆蓋指定的一筆資源
 /*   .put(function (req, res) {
        accounts.put(req, function (err, results) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            if (results === 410) {
                res.sendStatus(410);
                return;
            }
             
            accounts.item(req, function (err, results, fields) {
                res.json(results);
            });
        });
    })*/
    // 更新指定的一筆資源 (部份更新)
    .patch(oauth2.accessControl,function (req, res) {                                                                            //成功
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        accounts.patchUser(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
             
            if (!results.affectedRows) {
                res.sendStatus(410);
                return;
            }
             
            // response 被更新的資源欄位，但因 request 主體的欄位不包含 id，因此需自行加入
            req.body.id = req.params.id;
            res.json([req.body]);
        });
    });

router.route('/Item/:id')                                                                                   //成功
    .get(function (req, res) {
        accounts.item(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            if (!results.length) {
                res.sendStatus(404);
                return;
            }
 
            res.json(results);
        });
    });
router.route('/CheckUserLoIn')  
    .get(function (req, res) {
        accounts.CheckUserLoIn(req, function (err, results, fields) {
            if (err) {
                res.sendStatus(500);
                return console.error(err);
            }
 
            if (!results.length) {
                //res.sendStatus(404);
                res.json('帳號密碼錯誤');
                return;
            }
 
            res.json(results);
        });
        
    });
module.exports = router;