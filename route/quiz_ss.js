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
   // let percent=new Array(5);
    let exam=request.session.exam;
    let courses=request.session.courses;
    var table=exam+"_"+courses; 
    let uname=request.session.username;
    //let arr=new Array(6);
    let val=new Array();
    for(let i=1;i<=2;i++)
    {
        for(let j=0;j<=2;j++)
        {
            val.push(request.body['stu'+i+''+j]);
        }
        console.log(val);
    }
    console.log('val'+val);
 
   
    let j=1;
    let i;
    for (let i=1;i<=2;i++){
        let eachsum=0;
        eachsum+=(parseInt(val[j-1])+parseInt(val[j])+parseInt(val[j+1]))/3;
        eachsum=Math.ceil(eachsum);
        console.log('eaa'+eachsum);
        connection.query(' update '+table+' set Q1=? , Q2=? , Q3=? where Student='+'0'+i,[val[j-1],val[j],val[j+1]] ,function(error, results, fields) {
    });
    connection.query(' update '+table+' set Total=? where Student='+'0'+i,[eachsum] ,function(error, results, fields) {
    });
    j+=3;
}
   
    async function call_display(callback){
        await new Promise(resolve => setTimeout(resolve, 200));
        let sec;
        connection.query('select Section from courses where Name= ? and course=?',[uname,courses],function(error, results, fields) {
           sec=results[0].Section;
        });
        connection.query('select * from '+ table+' where Student not like \'00\'', function(error, results, fields) {
            let arr=[];
            let i=0;
            if(error)
           {

               console.log("zdsd"+error);
               return ;
           }
            while(i<results.length)
            {
                arr[i]=results[i];

                i++;
            }
            courses=courses.toUpperCase();
            var data={name:arr,cour:courses,sec:sec};
            //console.log(percent);
            response.render('display_QandAssign', {data:data});
            response.end();
            callback({});
        });
    }
    call_display(function(result){});
});
module.exports = router;
