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

  router.post('/', function(req, res){ 
    let exam=req.body.Test;
    req.session.exam=exam;
    let courses=req.body.courses;
    courses=courses.toLowerCase();
    courses=courses.replace(/\s+/g, '');
    req.session.courses=courses;
    let table=exam+"_"+courses;
    connection.query('select Student from '+ table+' where Student not like \'00\' and Student not like \'NULL\'', function(error, results, fields) {
        let arr=[];
        let i=0;
        if(error)
        {
            console.log(error);
            return ;
        }
        while(i<results.length)
        {
            arr[i]=results[i].Student;
            i++;
        }

        var data={name:arr};
        res.render('edit_course',{data:data});
    });
  });
  module.exports = router;