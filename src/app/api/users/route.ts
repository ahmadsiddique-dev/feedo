import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";
import axios from "axios";

export async function GET(request:Request) {
    await dbConnect();

    try {
        const data = await UserModel.aggregate([
            {
                $match: {
                    isVerified: true
                }
            },
            {
                $project: {
                    _id: 0,
                    username: 1,
                    isAcceptingMessage: 1
                }
            }
        ]);
        if (!data) {
            return Response.json({success: false, message: "Users not found"}, {status: 404})
        }
        return Response.json({success: true, message: "Users Successfully fetched", data}, {status: 200})
    } catch (error) {
        return Response.json({success: false, message: "Unexpected Error occured"}, {status: 500})
    }
}