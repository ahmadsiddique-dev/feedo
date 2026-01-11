import dbConnect from "@/connection/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const searchParam = {
      userId: searchParams.get("userId"),
      messageId: searchParams.get("messageId"),
    };

    if (!searchParam.messageId || !searchParam.userId)
      return NextResponse.json(
        { success: false, messages: "Parameters are missing" },
        { status: 400 }
      );

    // const newUserId = new mongoose.Types.ObjectId(searchParam.userId);
    // const newMessageId = new mongoose.Types.ObjectId(searchParam.messageId);

    // const response = await UserModel.aggregate([
    //   {
    //     $match: {
    //       _id: newUserId,
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$messages",
    //     },
    //   },
    //   {
    //     $match: {
    //       "messages._id": newMessageId,
    //     },
    //   },
    // ]);

    // if (response?.data._id) {
    //     const deleteMessage = await UserModel.deleteOne(response.data._id)
    // }

    const response = await UserModel.updateOne(
      { _id: searchParam.userId },
      { $pull: { messages: { _id: searchParam.messageId } } }
    );

    if (!response)
      return NextResponse.json(
        { success: false, messages: "Something went wrong" },
        { status: 404 }
      );

      return NextResponse.json(
        { success: true, messages: "Message deleted successfully" },
        { status: 200 }
      );
  } catch (error) {
    return NextResponse.json(
        { success: false, messages: "Something went wrong" },
        { status: 404 }
      );
  }
}
