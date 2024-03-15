import nodemailer from 'nodemailer'

const sendEmail = ( data: any, email: string) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "OTP",
      text: data
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailDetails, ( error: any, info: any) => {
          if (error) {
              console.log('error happened in nodemailer'+error);
              reject(false)
          } else {
              console.log('Email sent successfully');
              resolve(true)
          }
        });
    })
}

export default sendEmail;