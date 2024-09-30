const nodemailer=require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shopper0502@gmail.com', 
      pass: 'elfd waie irav qclw' 
    }
  });
  module.exports=transporter;
  