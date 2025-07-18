"use client";

import React, {useState, useEffect } from "react";
import Button from "~/components/ui/Button";
import Image from "next/legacy/image";
import { useToast } from "~/components/ui/use-toast";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchMetaData, fetchVideoId } from "~/lib/helpers/transcript";
// import VidGallery from "~/components/Gallery/VidGallery";
import { MdPerson } from "react-icons/md";
import { useSession } from "next-auth/react";



const Page = () => {
  const [videoUrl, setvideoUrl] = useState("");
  const [vidId, setvidId] = useState("")
  const { toast } = useToast();
  const { data: session } = useSession()
  const [showModal, setshowModal] = useState(false);
  // console.log(data)

  const [metaData, setmetaData] = useState({
    title: "",
    author_name: "",
    provider_name: "",
    thumbnail_url: ""
  })


  const getVideoData = async() => {
    setshowModal(true)
    try {
      if (!videoUrl) {
        toast({
          title: "Please Enter a Valid Video URL or ID",
        });

        return;
      }
      const id = await fetchVideoId(videoUrl);

      if (!id && videoUrl.length != 11) {
        toast({
          title: "Please Enter a Valid Video URL or ID.",
        });
        return;
      }

      if(id) {
        setvidId(id);
        const data = await fetchMetaData(id);
        // console.log(data);
        setmetaData(data);
      } else if (videoUrl.length == 11){ 
        setvidId(videoUrl);
        const data = await fetchMetaData(videoUrl);
        // console.log(data);
        setmetaData(data);
      }
    } catch (error: any) {
      setvideoUrl("")
      toast({
        title: "Something went wrong",
        description: "Please try again. ",
      })
    }
  }

  return (
    <>
      <div className="relative grid h-screen place-content-center gap-12 bg-black">
        {/* <div className="absolute left-0 top-0 h-screen w-screen bg-black opacity-50"> */}
        {/* </div> */}

        <SetUrlToSearch seturl={setvideoUrl} />
        <Image
          src={"/bg.png"}
          alt="hero"
          layout="fill"
          priority
          className="absolute z-10 h-full w-full opacity-30 "
        />
        <Image
          src={"/images/hero/bg.png"}
          alt="hero"
          layout="fill"
          className="absolute z-10 h-full w-full opacity-50"
        />
        {/* <VidGallery
        videos={themeVideos}
        className="z-20 gap-x-32"
        hideDetails={true}
      /> */}
        <div className="absolute left-1/2 right-1/2 top-5 z-10 flex w-[90%] -translate-x-1/2 items-center justify-between px-5 *:text-4xl *:text-white md:w-3/4">
          <Link href="/" className="rounded-full border-2 p-2">
            <HomeIcon />
          </Link>
          {session?.user && (
            <Link
              href={"/c/" + session?.user.id}
              className="rounded-full border-2 p-2"
            >
              <MdPerson className="h-6 w-6" />
            </Link>
          )}
        </div>
        <form
          action={getVideoData}
          className="flex-col-center-center z-10 gap-5 max-md:w-screen"
        >
          <input
            type="text"
            placeholder="YouTube Video Url or ID"
            value={videoUrl}
            className="w-[90%] rounded-full px-4 py-3 md:w-[450px]"
            onChange={async (e) => {
              setvideoUrl(e.target.value);
            }}
          />

          <Button
            disabled={vidId ? true : false}
            type="submit"
            className="bg-white"
          >
            Get Video
          </Button>
        </form>
      </div>

      {/*  */}
      {vidId && showModal && metaData.thumbnail_url && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-50 grid place-content-center backdrop-blur-md">
          <div className="mx-auto w-[90%] max-w-6xl rounded-xl bg-white p-5 sm:w-[60%]">
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="md:w-2/3">
                <Image
                  src={metaData.thumbnail_url}
                  alt="thumbnail"
                  width={450}
                  height={450}
                  className="h-full w-full rounded-xl"
                />
              </div>
              <div className="flex flex-col items-stretch md:w-2/3">
                <div className="flex-1 space-y-4 pb-8">
                  <h1 className="text-xl font-bold md:text-3xl ">
                    {metaData.title.slice(0, 35)}
                  </h1>
                  <p className="text-md font-bold text-gray-500">
                    @{metaData.author_name}
                  </p>
                  <p className="text-md text-wrap text-gray-500">
                    If this is the right video hit the <b>Generate</b> button to
                    continue, otherwise try with another url.
                  </p>
                </div>
                {/* <Link href={`/generate/${vidId}`}> */}
                {/* <Button
                  onClick={() => {
                    window.location.pathname = "/generate/" + vidId;
                  }}
                  className="bg-black text-white"
                >
                  Generate
                </Button> */}
                {/* </Link> */}

                <div className="flex flex-col items-center justify-between md:flex-row">
                  {/* <Button
                    onClick={() => {
                      setshowModal(false);
                    }}
                    className="bg-white text-black border border-black"
                  >
                    Close
                  </Button> */}
                  <Button
                    onClick={() => {
                      window.location.pathname = "/generate/" + vidId;
                    }}
                    className="w-full bg-black text-white"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const SetUrlToSearch = ({ seturl } : {
  seturl : (url: string) => void
}) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("q");

    if (q) {
      seturl(q);
    }
  }, []);
  return (<></>)
}

export default Page;
