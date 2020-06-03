var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});

var router=express.Router();
router.post('/',function(req,res){
    let val=new Array();
    let exam=req.session.exam;
    let courses=req.session.courses;
    var table=exam+"_"+courses;
    let arr=new Array();
    async function edit(){
        let q=1;
        for(let i=0;i<=16;i++)
        { 
            arr.push(req.body['course_outcomes'+i]);
         connection.query(' update '+table+' set Q'+q+'=? where Student like \'00\'',arr[q-1],function(error, results, fields) {
         });
         q++;
     }
    for(let i=1;i<=2;i++)
    {
        //we need await ok
        //await new Promise(resolve => setTimeout(resolve, 50));
            for(let j=0;j<=16;j++)
        {
        console.log('req'+req.body['stu'+i+''+j]);
            if(req.body['stu'+i+''+j]=='')
            {
          //   await new Promise(resolve => setTimeout(resolve, 1000));
                let str='Q'+(j+1);
                console.log('q'+str);
             connection.query(' select '+ str +' as q1 from '+table+' where Student=0'+i, function(error, results, fields) {
                 if(error)
                 {
                     console.log(error);
                     return;
                 }
                 //val[j]=results[0].q1;
                 val.push(results[0].q1);
                 console.log('re'+results[0].q1);
                 console.log('val inside '+val[j]);
             });
        
            }
            else
            val.push(req.body['stu'+i+''+j]);
        }
        }
        console.log(val);
    }
        edit();
    req.session.val1=val;
    console.log("befotre sending"+val);
    setTimeout(function(){
        res.redirect('/ext_ss');
     }, 1000);
    });
    module.exports = router;
