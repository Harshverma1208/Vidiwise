/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InferSelectModel } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/legacy/image";
import Link from "next/link";
import Hero from "~/components/Hero/Hero";
import Button from "~/components/ui/Button";
import { profiles } from "~/server/db/schema";
type Profile = InferSelectModel<typeof profiles>;

// export const maxDuration = 59;


const page = async ({ 
  params,
}: {
  params: {
    domain: string;
  };
}) => {

  let creatorId = "";
  const headerList =  headers();
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/domain/${params.domain}`,
      {
        method: "POST",
      },
    );
    // console.log("This ran")
    const response: {
      status: boolean;
      message: string;
      profile?: Profile | undefined;
    } = await data.json();

    // console.log(response)
    if(response.status){
      creatorId = response.profile?.userId ?? "";
    }
   } catch (error) {
    //  console.log(creatorId)
  }
  return (
    <div className="grid h-screen w-screen">
      <Header creatorId={creatorId} />
      <Hero />
    </div>
  );
};

const Header = ({ creatorId } : { creatorId : string}) => {
    return (
      <nav className="absolute left-0 right-0 top-4 items-center justify-center z-20">
        <div className="w-responsive flex items-center justify-between rounded-full bg-white p-3">
          <div className="flex-center gap-4 text-lg font-semibold">
            <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
            <h1>Vidiwise</h1> 
          </div>
          {creatorId ? (
            <Link className="cursor-pointer" href={`/c/${creatorId}`}>
              <Button>Creator Page</Button>
            </Link>
          ) : (
            <Link className="" href={`https://www.vidiwise.com`}>
              <Button>Vidiwise</Button>
            </Link>
          )}
        </div>
      </nav>
    );
}
export default page;