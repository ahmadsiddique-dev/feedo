import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import dbConnect from "@/connection/dbConnect";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {
                                email: credentials.identifier.email
                            },
                            {
                                username: credentials.identifier.username
                            }
                        ]
                    })

                    if (!user) {
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    }else {
                        throw new Error("Incorrect Password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({session, token}) {
            if (token) {
                let su = session.user
                su._id = token._id
                su.username = token.username
                su.isAcceptingMessages = token.isAcceptingMessages,
                su.isVerified = token.isVerified
                
            }
            return session
        }
    },
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}