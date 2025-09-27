import { redirect } from "next/navigation";

const Page = async () => {
    // For guest users, redirect to generate page
    return redirect("/generate")
}

export default Page;