var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});
var router=express.Router();
router.post('/',function(request,response){
    let course=request.session.courses;
    for(let i=0;i<5;i++){
        let desc=`request.body.co`+i;
    connection.query(' update  '+course+' set Description=? where CO='+i,[desc] ,function(error, results, fields) {});
    }
    
});
module.exports=router;
