var mysql = require('mysql');
var conf = require('../conf');
 
var connection = mysql.createConnection(conf.db);
var tableName1 = '使用者';
var tableName2 = '背包';
var tableName3 = '學習紀錄';
var sql = '';
 
module.exports = {
    users: function (req, callback) {                                                                       //搜尋所有使用者
        sql = 'SELECT * FROM ' + tableName1;
        return connection.query(sql, callback);
    },
    user: function (req, callback) {                                                                        //搜尋單一使用者 
        sql = mysql.format('SELECT * FROM ' + tableName1 + ' WHERE 學號= ?', [req.params.id]);
        return connection.query(sql, callback);
    },
    item: function (req, callback) {                                                                        //搜尋單一使用者道具 
        sql = mysql.format('SELECT * FROM ' + tableName2 + ' WHERE 學號= ?', [req.params.id]);
        return connection.query(sql, callback);
    },

    addUser: function (req, callback) {  
        sql = mysql.format('INSERT INTO ' + tableName1 + ' SET ?', req.body);                               //新增使用者
        return connection.query(sql, callback);
    },
    addItem: function (req, callback) {  
        sql = mysql.format('INSERT INTO ' + tableName2 + ' SET ?', req.body);                               //新增背包
        return connection.query(sql, callback);
    },
    addHint: function (req, callback) {                                                                     //新增學習紀錄
        sql = mysql.format('INSERT INTO ' + tableName3 + ' SET ?', req.body);
        return connection.query(sql, callback);
    },

    delete: function (req, callback) {                                                                      //刪除使用者
        sql = mysql.format('DELETE FROM ' + tableName1 + ' WHERE ID= ?', [req.params.id]);
        return connection.query(sql, callback);
    },
    put: function (req, callback) {
        // 使用 SQL 交易功能實現資料回滾，因為是先刪除資料在新增，且 Key 值須相同，如刪除後發現要新增的資料有誤，則使用 rollback() 回滾
        connection.beginTransaction(function (err) {
            if (err) throw err;
             
            sql = mysql.format('DELETE FROM ' + tableName1 + ' WHERE id = ?', [req.params.id]);
 
            connection.query(sql, function (err, results, fields) {
                // SQL DELETE 成功 results.affectedRows 會返回 1，反之 0
                if (results.affectedRows) {
                    req.body.id = req.params.id;
                    sql = mysql.format('INSERT INTO ' + tableName1 + ' SET ?', req.body);
                     
                    connection.query(sql, function (err, results, fields) {
                        // 請求不正確
                        if (err) {
                            connection.rollback(function () {
                                callback(err, 400);
                            });
                        } else {
                            connection.commit(function (err) {
                                if (err) callback(err, 400);
     
                                callback(err, 200);
                            });
                        }                        
                    });
                } else {
                    // 指定的資源已不存在
                    callback(err, 410);
                }
            });
        });
    },
    patchUser: function (req, callback) {       
        sql = mysql.format('UPDATE ' + tableName1 + ' SET ? WHERE ID= ?', [req.body, req.params.id]);                        //修改使用者
        return connection.query(sql, callback);
    },
    patchItem: function (req, callback) {       
        sql = mysql.format('UPDATE ' + tableName2 + ' SET ? WHERE ID= ?', [req.body, req.params.id]);                        //修改背包
        return connection.query(sql, callback);
    },
    patchHint: function (req, callback) {       
        sql = mysql.format('UPDATE ' + tableName3 + ' SET ? WHERE ID= ?', [req.body, req.params.id]);                        //修改教學紀錄
        return connection.query(sql, callback);
    },
    CheckUserLoIn:function (req,callback) {
        var response = {
           "account":req.body.account,
           "password":req.body.password,
       };
       var selectSQL = "select * from 使用者 where 學號 = '"+req.body.account+"' and 密碼 = '"+req.body.password+"'";
       //var selectSQL = "select password from user where account='"+req.query.account+"'";
       var  addSqlParams = [req.query.account,req.query.password];
          connection.query(selectSQL,function (err, result) {
            if(err){
             console.log('[login ERROR] - ',err.message);
             return;
            }
            //console.log(result);
            if (result=="") {
                
                   // callback(err, 400);
                    console.log('error');
                    return "帳號密碼錯誤"
                
            } 
            else {
                
                    
                        console.log("ok");
                       // callback(err, 200);
                        return "帳號正確"
                    
                    
                
            }     
    });
       console.log(response);
       return connection.query(selectSQL, callback);
       //res.end(JSON.stringify(response));
    }
    
};