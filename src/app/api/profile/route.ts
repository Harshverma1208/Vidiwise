export async function POST(request: Request) {
    try {
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