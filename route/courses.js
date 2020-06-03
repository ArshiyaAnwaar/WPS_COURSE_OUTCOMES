var express = require('express');
   var path = require('path');
   var mysql = require('mysql');
   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'root',
       password : '',
       database : 'project'
   });
   
 
  var router = express.Router();

  router.get('/', function(req, res){ 
    var username=req.session.username;
    connection.query('SELECT course FROM courses WHERE Name=?', [username], function(error, results, fields) {
        let arr=[];
        let i=0;
        while(i<results.length)
        {
            arr[i]=results[i].course;
            i++;
        }
        var data={uname:username,name:arr};
        res.render('index', {data:data});
        res.end();
    });
  });
  module.exports = router;
  
