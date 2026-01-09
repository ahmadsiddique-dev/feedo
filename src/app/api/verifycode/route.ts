import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    console.log("user : ", user)
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Verification Code has Expired" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return Response.json({ success: false, message: "Error verifying user" });
  }
}
