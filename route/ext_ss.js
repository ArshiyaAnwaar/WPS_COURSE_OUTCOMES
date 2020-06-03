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
    let courses=request.session.courses;
    let uname=request.session.username;
    var table=exam+"_"+courses; 
    let arr=new Array();
    let arrbr=new Array();
    let val2=new Array();

    console.log('val here'+request.session.val1);//we saved as valnot va;1
    let val=request.session.val1;
    let k=0;
    let i;
    for (let i=1;i<=2;i++){
        let eachsum=0;
        let q=1;
        for(let j=k;j<k+17;j++)
        {//
            eachsum+=parseInt(val[j]);
            connection.query(' update '+table+' set Q'+q+'=? where Student='+'0'+i,val[j],function(error, results, fields) {
            });
            q++;
        }
        console.log('each'+eachsum);
    connection.query(' update '+table+' set Total=? where Student='+'0'+i,[eachsum] ,function(error, results, fields) {
    });
    k+=17;
}
let max_marks=[2,2,2,2,2,2,2,2,2,2,8,8,8,8,8,8,8];
let no_of_st,tot_st;
let th_mark=request.body.th;
    connection.query('select count(*) as total from '+ table+' where Total>=?',[th_mark], function(error,results,fields) {
        no_of_st=results[0].total;    
    console.log("no_of_st "+no_of_st);

    });
    connection.query('select count(*) as total from '+ table+' where Student not like \'NULL\' and Student not like \'00\'',[th_mark], function(error,results,fields) {
        tot_st=results[0].total;    
        console.log("totst "+tot_st);
    });
    var n_co=[0,0,0,0,0];
    var qandco={};
    var coandmarks=[0,0,0,0,0];
    var totalmarks=[0,0,0,0,0];
async function calc_qandco(callback){
    for(let k=1;k<=17;k++)
    {
        let str='Q'+k;
        try{
            await new Promise(resolve => setTimeout(resolve, 50));
    connection.query('select '+str+' as co from '+ table+' where Student like \'00\'',async function(error,res,fields) {
        if(error)
        {
            console.log("aasa");
            return ;
        }
    coindx=res[0].co;
    console.log(coindx);
    qandco[str]=coindx;
    n_co[coindx-1]+=1;
    totalmarks[coindx-1]+=max_marks[k-1];
        });
    }catch(e)
    {
        console.log('err');
    }
   
    }
    console.log("n_co"+n_co);
     return callback({});
}
async function calc_coandmarks(callback){
    await new Promise(resolve => setTimeout(resolve, 500));
    for(let k=1;k<=17;k++)
    {
        await new Promise(resolve => setTimeout(resolve, 50));
        let str='Q'+k;
    connection.query('select sum('+str+') as s from '+ table+' where Student not like \'NULL\' and Student not like \'00\'', function(error, results, fields) {
        let coindx=qandco[str];
        coandmarks[coindx-1]+=results[0].s;
       console.log('coindx '+coindx+' total inside '+coandmarks[coindx-1]);
    });
  callback({});
    }
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
            let tables='co_'+courses;
            connection.query(' update '+tables+' set ext=? where co='+(k+1),[percent[k]] ,function(error, results, fields) {
            });
        }
        callback({});
    } 
calc_qandco(function(result){});
  calc_coandmarks(function(result){});
   calc_prec(function(result){});
   let arr1=[];
  async function store_arr(callback){
    await new Promise(resolve => setTimeout(resolve, 1000));
    connection.query('select * from '+ table+' order by Student', function(error, results, fields) {
        
        let i=0;
        while(i<results.length)
        {
            arr1[i]=results[i];
            i++;
        }
        console.log('arr'+arr1);   
    });
  }
    async function call_display(callback){
        await new Promise(resolve => setTimeout(resolve, 2000));
        let sec;
        connection.query('select Section from courses where Name= ? and course=?',[uname,courses],function(error, results, fields) {
           sec=results[0].Section;
        });
        let tables='co_'+courses;
        let tot=[0,0,0,0,0,0];
        for(let i=1;i<=5;i++){
          await new Promise(resolve => setTimeout(resolve, 50));
        connection.query('select int_1,int_2,ext from '+tables+' where co='+i, function(error, results, fields) {
            if(error)
            {
                console.log('err'+error);
                return;
            }
            
            console.log(i);
            console.log(results[0].int_1);
            console.log(results[0].int_2);
            console.log(results[0].ext);
                tot[i]+=(results[0].int_1+results[0].int_2+results[0].ext)/3;
                console.log(tot[i]);
        });
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    console.log(tot);
    let tot_=[0,0,0,0,0];
    for(i=0;i<5;i++ )
    tot_[i]=tot[i+1];
    courses=courses.toUpperCase();
        var data={name:arr1,thr:th_mark,n:no_of_st,per_ach:percent,tot:tot_,cour:courses,sec:sec};
            console.log(percent);
            response.render('display_ext', {data:data});
            response.end();
            callback({});
    }
    store_arr(function(result){});
    call_display(function(result){});
});
module.exports = router;
