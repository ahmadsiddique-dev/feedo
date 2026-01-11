import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const messages = await UserModel.aggregate([
    { $match: { _id: userId } },
    {
        $project: {
            messages: {
                $sortArray: { input: "$messages", sortBy: { createdAt: -1 } }
            }
        }
    }
]);

    // console.log("USERMessages: ", messages)
    if (!messages || messages.length === 0) {
    return Response.json(
      { success: false, message: "Messages not found" },
      { status: 404 }
    );
    }

    return Response.json(
      { success: true, messages: messages[0].messages },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 }
    );
  }
}