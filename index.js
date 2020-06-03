var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var async = require('async');
var cs=require('./route/cs');
var int_ss=require('./route/int_ss');
var ext_ss=require('./route/ext_ss');
var quiz_ss=require('./route/quiz_ss');
var co_=require('./route/courses');
var ce_=require('./route/callexcel');
var demo=require('./route/demo');
var demo1=require('./route/demo1');
var demo2=require('./route/demo2');
var read_frm_xl=require('./route/read_frm_xl');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});
var app = express();
app.set('view engine', 'ejs'); 
//
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("./images"));
app.use(express.static("./css"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/files',express.static('./files'));
app.get('/', function(request, response) {
     
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.use('/int_ss',int_ss);
app.use('/courses',co_);
app.use('/callexcel',ce_);
app.use('/ext_ss',ext_ss);
app.use('/read_frm_xl',read_frm_xl);
//app.use('/edit',edit);
//app.use('/edit_marks ',em);
app.use('/QandAssign',quiz_ss);
//app.use('/disp_questions',dq);

app.use('/demo',demo);
app.use('/demo1',demo1);
app.use('/demo2',demo2);
app.use('/cs',cs);
app.get('/set_date', function(request, response) {
        response.render('set_date');
        response.end();
    });
app.get('/h', function(request, response) {
    var username=request.session.username;
    connection.query('SELECT course FROM courses WHERE Name=?', [username], function(error, results, fields) {
        let arr=[];
        let i=0;
        while(i<results.length)
        {
            arr[i]=results[i].course;
            i++;
        }
        var data={uname:username,name:arr};
        response.render('index', {data:data});
        response.end();
    });
});
app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM userinfo WHERE Name = ? AND Password = ?', [username, password], function(error, results, fields) {
if(error){
    console.log(error);
    return;
}
            if (results.length > 0) {
                
                request.session.loggedin = true;
                request.session.username = username;
                if(username=="admin")
                response.redirect('/set_date');
                else
                response.redirect('/h');
            } else {
                response.send('Incorrect Username and/or Password!');
            }           
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
app.listen(8000,function(){
    console.log("Running");
});
module.exports = app;
