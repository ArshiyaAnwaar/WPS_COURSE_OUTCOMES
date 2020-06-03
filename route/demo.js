var nodemailer = require('nodemailer');
var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});
var async = require('async');

var router=express.Router();
router.post('/', async function(request, response) {
  var name_email={};
  var dates=request.body.send_mail_date;
  connection.query('select Name,email from userinfo', function(error, results, fields) {
    let i=0;
            if(error)
            {
                console.log(error);
                return ;
            }
            while(i<results.length)
            {
              name_email[results[i].Name]=results[i].email;
              console.log('inside query'+ name_email[results[0].Name]);
                i++;
            }
  });
  connection.query('select Name,course from courses', function(error, results, fields) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',//
    secure: false,
    port: 25,
    auth: {
      user: 'xxxx@gmail.com',
      pass: 'pass'
    }, tls: {
      rejectUnauthorized: false
    }
  });
  //console.log(name_email[results[0].Name]);
  let i=0;
  while(i<results.length){
  var mailOptions = {
    from: 'xxxx',
    to:  name_email[results[i].Name],
    subject: 'Deadline Regd.',
    text: 'Dear '+results[i].Name+'\n DeadLine to enter marks for your course '+results[i].course+' is set to: \n'+request.body.send_mail_date 
  };
  i++;
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
 });
var data={dates:dates};
response.render('date_set_display',{data:data});
});


module.exports = router;
