const express     = require('express');
      app         = express(),
      CronJob     = require('cron').CronJob,
      kue         = require('kue'),
      queue       = kue.createQueue(),
      nodemailer  = require('nodemailer');
                    require('dotenv').config();

let job = new CronJob({
  // cronTime: '00 09 11 11 3 1-5',
  cronTime: '*/5 * * * * *',
  onTick: function() {
    let queueJob = queue.create('send-mail', {
        // subject: 'welcome email for tj',
        // to: 'maulana.robert,mr@gmail.com'
    }).save();
  },
  start: true,
  timeZone: 'Asia/Jakarta'
});

job.start();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maulana.robert.mr@gmail.com',
        pass: process.env.PWD_MAIL
    }
});

let mailOptions = {
    from    : '"Robert Maulana" <maulana.robert.mr@gmail.com>',
    to      : 'maulana.robert.mr@gmail.com',
    subject : 'Hello ✔', // Subject line
    // text    : 'Hello world 1234?',
    html    : '<b>Hello world ?</b>'
};

queue.process('send-mail', function(job, done){
  sendEmail(job.data.subject, done);
});


function sendEmail(subject, done){
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  done();
}


app.listen(3000, () => {
  console.log(`Hehehe...!`);
})
