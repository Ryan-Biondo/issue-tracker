import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { commentSchema } from "@/app/validationSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function GET(request: NextRequest) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
 }

export async function POST(request: NextRequest) {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    const validation = commentSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    try {
        // Create a new comment
        const newComment = await prisma.comment.create({
            data: {
                content: body.content,
                issueId: body.issueId,
                authorEmail: session.user.email
            }
        });
        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

  

