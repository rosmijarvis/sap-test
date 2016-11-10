var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://sudhakar_royal:logictree@smtp.sendgrid.net');

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo <ashok.inspires@gmail.com>', // sender address
    to: 'ashok.kasilo@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});



// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     service: 'smtp.sendgrid.net',
//     auth: {
//         user: 'sudhakar_royal',
//         pass: 'logictree'
//     }
// }, {
//     // default values for sendMail method
//     from: 'ashok.inspires@gmail.com',
//     headers: {
//         'My-Awesome-Header': '123'
//     }
// });
// transporter.sendMail({
//     to: 'ashok.kasilo@gmail.com',
//     subject: 'hello',
//     text: 'hello world!'
// }, function(error, result){

// 	console.log(error);
// 	console.log(result);
// });

// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport();
// transporter.sendMail({
//     from: 'ashok.inspires@gmail.com',
//     to: 'ashok.kasilo@gmail.com',
//     subject: 'hello',
//     text: 'hello world!'
// });

