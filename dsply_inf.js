require("./index.js");
app.post('/ss',function(request,response){
    let exam=request.session.exam;
    let courses=request.session.courses;
    let table=exam+"_"+courses;
    console.log(table);
    let arr=new Array(3);
       arr[0]=parseInt(request.body.course_outcomes0);
       arr[1]=parseInt(request.body.course_outcomes1);
       arr[2]=parseInt(request.body.course_outcomes2);
    connection.query(' update  '+table+' set Q1=? , Q2=? , Q3=? where Student like \'00\'',[arr[0],arr[1],arr[2]] ,function(error, results, fields) {
   });
    let val=[]
    val[0]=parseInt(request.body.stu10);
    val[1]=parseInt(request.body.stu11);
    val[2]=parseInt(request.body.stu12);
    val[3]=parseInt(request.body.stu20);
    val[4]=parseInt(request.body.stu21);
    val[5]=parseInt(request.body.stu22);
    let j=1;
    let i;
    for (let i=1;i<=2;i++){
        console.log(i);
        console.log('0'+i);
        let eachsum=0
        eachsum+=val[j-1]+val[j]+val[j+1];
        connection.query(' update '+table+' set Q1=? , Q2=? , Q3=? where Student='+'0'+i,[val[j-1],val[j],val[j+1]] ,function(error, results, fields) {
        console.log(i);
        console.log('0'+i);
        console.log(' update '+table+' set Q1=? , Q2=? , Q3=? where Student like  '+'0'+i);
    });
    connection.query(' update '+table+' set total=? where Student='+'0'+i,[eachsum] ,function(error, results, fields) {
    });
    j+=3;
}
let no_of_st;
let th_mark=request.body.th;
    connection.query('select count(*) as total from '+ table+' where Total>=?',[th_mark], function(error,results,fields) {
        //vari=results;
        //console.log(JSON.stringify(results));
        //var json = JSON.parse(JSON.stringify(results));
        //console.log(json);
        //console.log(json.cnt);
        no_of_st=results[0].total;    
    });
    connection.query('select * from '+ table+' order by Student', function(error, results, fields) {
        let arr=[];
        let i=0;
        while(i<results.length)
        {
            arr[i]=results[i];
            i++;
        }
        //arr[i]=th_mark;
        //i++;
        //arr[i]=vari;
        var data={name:arr,thr:th_mark,n:no_of_st};
        response.render('display', {data:data});
        response.end();
    });
});