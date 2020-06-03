var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});

var router=express.Router();
router.post('/', function(request, response) {
   
    
    let exam=request.body.Test;
    request.session.exam=exam;
    let courses=request.body.courses;
    courses=courses.toLowerCase();
    courses=courses.replace(/\s+/g, '');
    request.session.courses=courses;
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
        if(exam=='internal_1' || exam=='internal_2')
         response.render('int_course', {data:data});
         else if(exam=='external')
         {
             //console.log(arr);
         response.render('ext_course', {data:data});
         }
         else{
             response.render('QandAssign',{data:data});
         }
         response.end();
    });
});
module.exports = router;
