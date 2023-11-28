const nodemailer = require('nodemailer')
const { google } = require('googleapis')
require('dotenv').config();
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

///////////////////////////// RESET PASSWORD EMAIL /////////////////////////////////////
async function resetPassword(toUser, tempToken) {
    console.log('haioweafniowejf;jwfo;aew')
    const accessToken = await new Promise((resolve, reject) => {
        OAuth2_client.getAccessToken((err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        dnsTimeout: 60000,
        port: 465,
        secure: true,
        auth: {
            type: '0Auth2',
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASSWORD,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        },
    })


    const message = {
        from: process.env.GOOGLE_USER,
        to: toUser.email,
        subject: 'The Sunday Social - Reset Password',
        html: `
                <h3>Hello ${toUser.username},</h3>
                <p>Seems like you forgot something...</p>
                <p>Click the link to reset your password. <a target="_" href="${process.env.DOMAIN}/passwordReset/${tempToken.tokenId}" rel="noopener noreferrer">Reset Password</a> </p>
                <p>Thank you,</p>
                <p>-The Sunday Social</p>
            `
    }
    // send through nodemailer
    await new Promise((resolve, reject) => {
        transporter.sendMail(message, function (error, info) {
            if (error) {
                console.log('Error')
                reject(error)
            } else {
                console.log('Successfully sent')
                resolve(info)
            }
        })
    })
}

module.exports =  { resetPassword } 