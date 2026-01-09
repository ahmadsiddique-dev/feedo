import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user accepting message status",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User accepting message status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Failded to update user" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 }
    );
  }

  const userId = user._id;

  const foundUser = await UserModel.findById(userId);

  try {
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
  
    return Response.json(
      { success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, isAcceptingMessage: "Error in getting Message accepting"},
      { status: 500 }
    );
  }
}
