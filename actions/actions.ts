"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
	try {
		await prisma.project.create({
			data: {
				name: formData.get("name") as string,
				slug: (formData.get("name") as string).replace(/\s+/g, "-").toLowerCase(),
				description: formData.get("description") as string
			}
		})

		revalidatePath("/projects");
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				console.log("Project name must be unique")
			}
		}
	}
}