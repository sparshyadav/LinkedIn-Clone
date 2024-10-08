import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";

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

export const sendCommentNotificationEmail = async (recipientEmail, recipientName, commenterName, postUrl, commentContent) => {
    const recipient = [{ email: recipientEmail }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "comment"
        });

        console.log("Comment Notification Email Sent Successfully", response);
    }
    catch (error) {
        throw error;
    }
}