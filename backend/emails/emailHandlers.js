import { MailtrapClient, sender } from "mailtrap";

export const sendWelcomeEmail=async(email, name, profileUrl)=>{
    const recipiant=[{email}];

    try{
        const response=await MailtrapClient.send({
            from: sender,
            to: recipiant,
            subject: "Welcome to UnLinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome"
        })
    }
    catch(error){
        throw error;
    }
}