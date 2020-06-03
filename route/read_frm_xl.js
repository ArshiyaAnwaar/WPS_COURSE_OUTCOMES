var express = require('express');
var path = require('path');
var XLSX = require('xlsx');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});
var multer=require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log('jghgg');
      callback(null, './files');
    },
    filename: function (req, file, callback) {
        console.log('jhghhg');
        req.session.filename=file.originalname;
        console.log(req.session.filename);
      callback(null, file.originalname);
    }
  });
  
  var upload = multer({ storage: storage });
var router=express.Router();
router.post('/', upload.single('file'),function(req,res){
    let fname=req.session.filename;
      
var workbook = XLSX.readFile('D:/MiniProject/files/'+fname);

    fname=fname.slice(0,fname.length-5);
    console.log('fb'+fname);
    req.session.courses=fname;
var sheet_name_list = workbook.SheetNames;
console.log(sheet_name_list);
let e=req.body.exam_name;
console.log(e);
req.session.exam=e;
let val=new Array();
let arr=new Array();
let table=e+'_'+fname;
if(e=='internal_1' || e=='internal_2'){
let q=1;
for(let i=66;i<78;i++){
arr.push(workbook.Sheets[e][String.fromCharCode(i)+'1'].v.slice(-1));
console.log('CO arr'+arr);
    connection.query(' update '+table+' set Q'+q+'=? where Student like \'00\'',arr[q-1],function(error, results, fields) {
    });
    q++;
//connection.query(' update  '+table+' set Q1=? , Q2=? , Q3=?, Q4=?, Q5=?,Q where Student like \'00\'',[arr[0],arr[1],arr[2],arr[3],arr[4]] ,function(error, results, fields) {
//});
}

for(let j=2;j<=3;j++)
{
for(let i=66;i<78;i++)
{
    val.push(workbook.Sheets[e][String.fromCharCode(i)+j].v);
     
}
}
console.log('val'+val);
req.session.val=val;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log('ads'+xlData);
res.redirect('/int_ss');
}
else
{
    let q=1;
for(let i=66;i<83;i++){
arr.push(workbook.Sheets[e][String.fromCharCode(i)+'1'].v.slice(-1));
console.log('CO arr'+arr);
    connection.query(' update '+table+' set Q'+q+'=? where Student like \'00\'',arr[q-1],function(error, results, fields) {
    });
    q++;
    
//connection.query(' update  '+table+' set Q1=? , Q2=? , Q3=?, Q4=?, Q5=?,Q where Student like \'00\'',[arr[0],arr[1],arr[2],arr[3],arr[4]] ,function(error, results, fields) {
//});
}

for(let j=2;j<=3;j++)
{
for(let i=66;i<83;i++)//
{
    val.push(workbook.Sheets[e][String.fromCharCode(i)+j].v);
     
}
}
console.log('val'+val);
req.session.val1=val;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log('ads'+xlData);
res.redirect('/ext_ss');//what is the
}
});
module.exports = router;
