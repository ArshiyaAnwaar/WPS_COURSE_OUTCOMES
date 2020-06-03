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
  router.post('/',function(req, res){ 
    let val=new Array();
    for(let i=0;i<=1;i++)
    {
        for(let j=0;j<=4;j++)
        {
            console.log(req.body['checkbox'+i]);
        }
        console.log(val);
    }
    console.log('val'+val);
  });
  module.exports = router;
