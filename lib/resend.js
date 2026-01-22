import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  from = "onboarding@resend.dev",
  to,
  subject,
  html,
  ...rest
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: to,
      subject: subject,
      html: html,
      ...rest,
    });
    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
