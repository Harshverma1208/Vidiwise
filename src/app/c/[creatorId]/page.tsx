import { desc, eq } from "drizzle-orm";
import { HomeIcon, Settings, Video } from "lucide-react";
import { Metadata } from "next";
import Image from "next/legacy/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CgAdd } from "react-icons/cg";
import { auth } from "~/auth";
import VidGallery from "~/components/Gallery/VidGallery";
import Button from "~/components/ui/Button";
import { getUser } from "~/lib/helpers/transcript";
import { db } from "~/server/db";
import { transcriptions } from "~/server/db/schema";


export async function generateMetadata({
  params, 
}: {
  params: {
    creatorId: string;
  };
}): Promise<Metadata> {
  const user = await getUser(params.creatorId);
  if(!user) {
    return redirect("/")
  }
  
  return{ 
    title: `Dashboard | ${user.name}'s Supaclips`, 
    description: `Explore all supaclips created by ${user.name}.`,
  }
 
}



export default async function Page({
  params,
}: {
  params: {
    creatorId: string;
  };
}) {
  // channel of creator
  const user = await getUser(params.creatorId);
 
  if(!user) {
    return redirect("/")
  }
  const session = await auth();
  // const { toast } = useToast();



  // console.log(user)
  const allVids = await db
    .select()
    .from(transcriptions)
    .where(eq(transcriptions.userId, params.creatorId))
    .orderBy(desc(transcriptions.createdAt));
  return (
    <main className="min-h-screen bg-black py-5">
      <div className="mx-auto w-[90%] max-w-6xl space-y-4 pt-5">
        <div className="flex items-center justify-between rounded-md border-b-2 pb-4">
          {/* Creator Profile */}
          <div className="flex items-center gap-4 ">
            <div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Creator Image"
                  width={75}
                  height={75}
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <Settings className="text-6xl text-white" />
              )}
            </div>
            <div className="text-white">
              <h1>{user.name}</h1>
              {/* <p>{user.}</p> */}
            </div>
          </div>

          {/* button */}
          <div className="flex items-center gap-4 max-md:hidden ">
            {session?.userId ? (
              <Link href="/generate">
                <Button className="space-x-2 bg-white text-black">
                  <CgAdd className="text-xl" />
                  <span>Add video</span>
                </Button>
              </Link>
            ) : null}
            {session?.userId && (
              <Link href={`/c/${session?.user?.id}/profile`}>
                <div className="10 rounded-full bg-white p-2 text-black">
                  <Settings className="text-2xl" />
                </div>
              </Link>
            )}
            <Link href="/">
              <div className="10 rounded-full bg-white p-2 text-black">
                <HomeIcon className="text-xl" />
              </div>
            </Link>
            {/* <Share2Icon className="text-white"  /> */}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 py-4  md:hidden">
          <div className="mx-auto flex w-[90%] items-center justify-between rounded-full border bg-black px-3 py-1">
            <Link href="/">
              <HomeIcon className="h-8 w-8 text-white" />
            </Link>
            {/* {session?.userId != params.creatorId ? (
              <Link href="/generate" className="h-full self-stretch bg-white text-black rounded-full p-2">
                <Video className="h-10 w-10  rounded-full " />
              </Link>
            ) : null} */}
            {session?.userId ? (
              <Link
                href="/generate"
                className="h-full self-stretch rounded-full bg-white p-2 text-black"
              >
                <Video className="h-10 w-10  rounded-full " />
              </Link>
            ) : null}
            <Link href={`/c/${session?.userId}/profile`}>
              <Settings className="h-10 w-10 text-white" />
            </Link>
          </div>
        </div>
        <VidGallery
          videos={allVids}
          creator={params.creatorId}
          className="pb-24 xl:grid-cols-4"
        />
      </div>

{/* 
      <footer className="fixed bottom-0 left-0 right-0 min-h-8 z-20 bg-white">
        <div className="w-[90%] md:w-1/2 mx-auto">
            
        </div>
      </footer>  */}
    </main>
  );
}