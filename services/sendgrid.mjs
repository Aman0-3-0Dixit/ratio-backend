import dotenv from 'dotenv';
dotenv.config();
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendDeleteEmail =  (toEmail) => {

    try{
        const msg = {
            to: toEmail,
            from: process.env.SENDGRID_FROM_EMAIL,
            templateId: process.env.SENDGRID_TEMPLATED_ID_DELETE,
            dynamicTemplateData: {
                subject: 'Delete Your Account'
            },
            hideWarnings: true
        };
        return sgMail.send(msg);
    }catch(error){
        return error;
    }
}