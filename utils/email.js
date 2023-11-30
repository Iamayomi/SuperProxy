const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `SuperProxy <${process.env.EMAIL_FROM}>`;
    };
    
    
    newTransport(){
        if(process.env.NODE_ENV === 'production') {
            return true
        };
        
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD

            }
        })
        
    };
    
  async send(subject){
      
        const mailOption = {
            from: this.from,
            to: this.to,
            subject,
        };
        
       await this.newTransport().sendMail(mailOption);

    };
    
    async sendPasswordReset(){
        await this.send('Your password reset token will Expires in 10mins');
    };
    
};