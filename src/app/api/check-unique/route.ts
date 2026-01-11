import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";
import { z } from 'zod'
import { UsernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: UsernameValidation,
})

export async function GET(request:Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const searchParam = {
            username: searchParams.get("username")
        }

        // Zod bhai validate kr dy ga!
        const result = UsernameQuerySchema.safeParse(searchParam)
        // console.log("Result: ", result);

        if (!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({ message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameter"}, {status: 400})
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})

        if (existingVerifiedUser) {
            return Response.json({success: false, message: "Username is already taken"}, { status: 400 })
        }

        return Response.json({success: true, message: "Username is available"}, { status: 200 })
    } catch (error) {
        // console.error("Error checking username", error);
        return Response.json({success: false, message: "Error checking username"}, {status: 500});
    }
}