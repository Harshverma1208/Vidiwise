import { auth } from "~/auth";

export async function POST(request: Request) {
    try {
        const session = await auth()
        
        if(!session) {
            return Response.redirect("/api/auth/signin")
        }

        const body = await request.json()
        return Response.json({
            status: true, 
            message: "Profile updated successfully!"
        })
    } catch (error) {
        return Response.json({
            status: false, 
            error: (error as Error).message ?? "",
            message: "Something went wrong! Please try again later."
        })
    }
}