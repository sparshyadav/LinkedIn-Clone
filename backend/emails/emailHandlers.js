import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipiant = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipiant,
            subject: "Welcome to UnLinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome"
        })

        console.log("Welcome Email sent Successfully", response);
    }
    catch (error) {
        throw error;
    }
}