import { redirect } from "next/navigation";
import { auth } from "~/auth";

const Page = async () => {
    const session = await auth();

    if(!session) {
        return redirect("/api/auth/signin")
    }

    redirect(`generate`)
}

export default Page;