var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});
var router=express.Router();
router.get('/',function(request,response){
    let percent=new Array(5);
    let exam=request.session.exam;
    console.log(exam);
    let courses=request.session.courses;
    console.log(courses);
    let uname=request.session.username;
    var table=exam+"_"+courses; 
  console.log('val is'+request.session.val);
    let val=request.session.val;
    let k=0;
    let i;
    for (let i=1;i<=2;i++){
      //  await new Promise(resolve => setTimeout(resolve, 10000));
        let eachsum=0;
        let q=1;
        for(let j=k;j<=k+11;j++)
        {
            eachsum+=parseInt(val[j]);
            connection.query(' update '+table+' set Q'+q+'=? where Student='+'0'+i,val[j],function(error, results, fields) {
            });
            q++;
        }
        console.log('each'+eachsum);
    connection.query(' update '+table+' set total=? where Student='+'0'+i,[eachsum] ,function(error, results, fields) {
    });
k+=12;
  }
let max_marks=[1,1,1,1,1,1,3,3,3,3,6,6];
let no_of_st,tot_st;
let th_mark=request.body.th;
    connection.query('select count(*) as total from '+ table+' where Total>=?',[th_mark], function(error,results,fields) {
        if(error)
        {
            console.log(error);
            return;
        }
        no_of_st=results[0].total;    
    console.log("no_of_st "+no_of_st);

    });
    connection.query('select count(*) as total from '+ table+' where Student not like \'NULL\' and Student not like \'00\'',[th_mark], function(error,results,fields) {
        if(error)
        {
            console.log('d'+error);
            return;
        }
        tot_st=results[0].total;    
        console.log("totst "+tot_st);
    });
    var n_co=[0,0,0,0,0];
    var qandco={};
    var coandmarks=[0,0,0,0,0];
    var totalmarks=[0,0,0,0,0];
    var coindx;
async function calc_qandco(callback){
    for(let k=1;k<=12;k++)
    {
        let str='Q'+k;
        try{
            await new Promise(resolve => setTimeout(resolve, 50));
    connection.query('select '+str+' as co from '+ table+' where Student=00',async function(error,res,fields) {
    coindx=res[0].co;
    console.log(coindx);
    qandco[str]=coindx;
    n_co[coindx-1]+=1;
    totalmarks[coindx-1]+=max_marks[k-1];
   // coandmarks[coindx-1]=0;
      // await new Promise(resolve => setTimeout(resolve, 100));
        });
       
    }catch(e)//
    {
        console.log('err');
    }
   
    }
    //await new Promise(resolve => setTimeout(resolve, 20));
    console.log("n_co"+n_co);
     return callback({});
}

async function calc_coandmarks(callback){
    await new Promise(resolve => setTimeout(resolve, 500));
    for(let k=1;k<=12;k++)
    {
        let str='Q'+k;
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log("thu"+"select sum("+str+") as s from "+ table+" where Student")
    connection.query('select sum('+str+') as s from '+ table+' where Student not like \'NULL\' and Student not like \'00\'', function(error, results, fields) {
        coindx=qandco[str];
        coandmarks[coindx-1]+=results[0].s;
       console.log('coindx '+coindx+' total inside '+coandmarks[coindx-1]);
    });
   //// await new Promise(resolve => setTimeout(resolve, 1000));
  callback({});
    }
   // await new Promise(resolve => setTimeout(resolve, 500));
}
async function calc_prec(callback){
    await new Promise(resolve => setTimeout(resolve, 1500));
        for(let k=0;k<=4;k++)
        {
            console.log("comarks "+coandmarks[k]);
            if(n_co[k]!=0 && totalmarks[k]!=0)
            {
                percent[k]=(coandmarks[k]/(totalmarks[k]*tot_st))*100;
                console.log('per'+percent[k]);
            }
            else
            percent[k]=0;
            let tables="co_"+courses;
            if(exam=='internal_1'){
            connection.query(' update '+tables+' set int_1=? where co='+(k+1),[percent[k]] ,function(error, results, fields) {
         //       console.log('in'+results); 
            });
        }
        else
        {
                connection.query(' update '+tables+' set int_2=? where co='+(k+1),[percent[k]] ,function(error, results, fields) {
                });
        }
        }
        callback({});
    } 
calc_qandco(function(result){});
  calc_coandmarks(function(result){});
   calc_prec(function(result){});
  
    async function call_display(callback){
        await new Promise(resolve => setTimeout(resolve, 1500));
        let sec;
        connection.query('select Section from courses where Name= ? and course=?',[uname,courses],function(error, results, fields) {
           console.log('cour'+courses);
            if(error)
           {
               console.log(error);
               return ;
           }
           console.log(results[0]);
            sec=results[0].Section;
        });
       
        connection.query('select * from '+ table+' where Student not like \'NULL\' order by Student', function(error, results, fields) {
            let arr=[];
            let i=0;
            if(error)
            {
                console.log(error);
                return ;
            }
            while(i<results.length)
            {
                arr[i]=results[i];
                i++;
            }
            courses=courses.toUpperCase();
            console.log('upper'+courses);
            var data={name:arr,thr:th_mark,n:no_of_st,per_ach:percent,cour:courses,sec:sec};
            console.log(percent);
            response.render('display', {data:data});
            response.end();
            callback({});
        });
    }
    call_display(function(result){});
});
module.exports = router;
