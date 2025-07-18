/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

'use client'
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useState } from "react";
import { profiles } from "~/server/db/schema";
import Button from "../ui/Button";
import { addDomainToVercel, getAllDomains, getConfigResponse, getDomainResponse, removeDomainFromVercelTeam, verifyDomain } from "~/lib/domains";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { updateProfile } from "~/lib/helpers/profile";
import verifyDomainValues from "~/config/domain.vercel";


export const dynamic = 'force-dynamic'

type Profile = InferSelectModel<typeof profiles>;

const FormProfile = ({
  profile
}: {
  profile: Profile 
}) => {
  
  const [userProfile, setuserProfile] = useState<Profile>(profile);

  const [about, setabout] = useState(userProfile.about ?? "")
  const [domain, setdomain] = useState(userProfile.domain ?? "")


  const [showSave, setshowSave] = useState(false)
  const [loading, setloading] = useState(false)
  const [formSubmitted, setformSubmitted] = useState(true)
  const [response, setresponse] = useState({
    status: false,
    message: ""
  })

  const { toast } = useToast();

  const onFormSubmit = async () => {
    setformSubmitted(false)
    setloading(true)
    
    // Update about section
    if(about && about != userProfile.about) {
      await updateProfile(about)
      toast({
        title: "About updated successfully ✅",
      }) 
    }
    
    // Handle custom domain (now available for all users)
    if (domain.includes(".") && !domain.includes("vidiwise.com")) {
      // write regex to change a url to a valid domain
      function getApexDomain(url : string) {
        const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/:?#]+)(?:[\/:?#]|$)/i;
        const match = url.match(regex);
        return match ? match[1] : url;
      }

      const apexDomain = getApexDomain(domain);
      setdomain(apexDomain ?? "");
      
      const res = await fetch(`/api/profile/domain/${domain}`);
      const data = await res.json();

      setresponse(data);
      setloading(false);

      toast({
        title: data.message,
      });
    } else if (domain && !domain.includes(".")) {
      toast({
        title: "Please enter a valid domain",
      });
      setdomain("");
    }

    setloading(false);
    setformSubmitted(true);
  }

  return (
    <form action={onFormSubmit} className="relative z-50 space-y-4 text-white">
      {loading && <CustomLoader />}

      <div className="form-group flex flex-col gap-1">
        <label>About</label>
        <textarea
          value={about}
          name="about"
          onChange={(e) => {
            setabout(e.target.value);
            setshowSave(true);
          }}
          className="rounded-lg border bg-white/20 p-2 text-sm"
          placeholder="Tell others about yourself and your videos..."
        />
      </div>
      
      <div className="form-group flex flex-col gap-1">
        <label>Custom Domain (Optional)</label>
        <input
          type="text"
          value={domain}
          name="domain"
          placeholder="example.com"
          onChange={(e) => {
            setshowSave(true);
            setdomain(e.target.value);
          }}
          className="rounded-lg border bg-white/20 p-2 py-3 text-sm"
        />
        <p className="text-xs text-gray-300 mt-1">
          Add your own domain to create a custom video knowledge hub
        </p>
      </div>

      {showSave && (
        <Button
          type="submit"
          className="w-full border-white bg-white/40 py-2 text-white"
        >
          Save Changes
        </Button>
      )}
    </form>
  );
};

const CustomLoader = () => {
  return (
    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 h-full bg-transparent backdrop-blur-sm grid place-content-center">
      <div className="bg-white flex items-center justify-center rounded-full p-2">
        <span className="w-[50px] h-[50px] animate-spin border-t-2 border-black rounded-full"></span>
      </div>
    </div>
  )
}

export default FormProfile; 