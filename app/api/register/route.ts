import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import prisma from "@/app/libs/prismadb";
import { errorResponse, readJson, validationError } from "@/app/libs/api";

const registerSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .trim()
        .toLowerCase()
        .pipe(z.email("Please enter a valid email address")),
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(1, "Name is required")
        .max(50, "Name is too long"),
    password: z
        .string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        // bcrypt only uses the first 72 bytes of a password
        .max(72, "Password is too long"),
});

export async function POST(request: Request) {
    const parsed = registerSchema.safeParse(await readJson(request));

    if (!parsed.success) {
        return validationError(parsed.error);
    }

    const { email, name, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (existingUser) {
        return errorResponse("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        // Two registrations with the same email at the same moment:
        // the unique index rejects the second one.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return errorResponse("An account with this email already exists", 409);
        }

        throw error;
    }
}
