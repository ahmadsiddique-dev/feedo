import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
    ): Promise<ApiResponse> {
    try {

      await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Feedo message | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

        return {success: true, message: "Email send Successfully"}
    } catch (error) {
        // console.error("Error Occured while send Email");
        return {success: false, message: "Error: Verification email sending Failed"}
    }
}