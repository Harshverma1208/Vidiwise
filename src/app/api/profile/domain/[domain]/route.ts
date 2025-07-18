import { eq } from "drizzle-orm"
import { auth } from "~/auth"
import verifyDomainValues from "~/config/domain.vercel"
import { addDomainToVercel, domainConfigValuesAll, getConfigResponse, removeDomainFromVercelProject, removeDomainFromVercelTeam, verifyDomain } from "~/lib/domains"
import { getOrCreateProfile, profileWDomain } from "~/lib/helpers/profile"
import { db } from "~/server/db"
import { profiles, users } from "~/server/db/schema"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, { params }: { params: { domain: string } }) {
    // get domain config/domain status
    try {
        const session = await auth()
        
        if(!session) {
            return Response.redirect("/api/auth/signin")
        }

        let profile = await getOrCreateProfile();

        if(!profile) {
            return Response.redirect("/api/auth/signin")
        }

        let message = ""
        let otherProfileWithDomain = await db.select().from(profiles).where(eq(profiles.domain, params.domain)) 
        if (profile.domain == params.domain || otherProfileWithDomain[0]) {
            message = "Domain already exists!"
        }
        else {
            if(!profile.domain) {
                message = "Domain added successfully!"
            }
            else if(profile.domain != params.domain) {
                message = "Domain updated successfully!"

                // delete old domain from vercel
                await removeDomainFromVercelTeam(profile.domain)
                await removeDomainFromVercelProject(profile.domain)
            }
            // create vercel new domain
            await addDomainToVercel(params.domain)
        }

        const configResposne = await domainConfigValuesAll(params.domain, false) 

        await db.update(profiles)
        .set({ domain: params.domain }) 
        .where(eq(profiles.userId, profile.userId))
        .catch((error) => {
            // console.log("error updating profile ", error)
            return Response.redirect(`/c/${profile.userId}/profile`)
        })
        
        if(configResposne.isDomainVerified) {
            await db.update(profiles)
            .set({ domainVerified: true })
            .where(eq(profiles.userId, profile.userId))
        }
        const res = await verifyDomain(params.domain)
        // console.log(res)
        return Response.json({
            status: true,
            misconfigured: configResposne.misconfigured,
            verified: configResposne.verified,
            isDomainVerified: configResposne.isDomainVerified,
            message,
            profile: {
                ...profile,
                domainVerified: configResposne.isDomainVerified
            }
        })   
    } catch (error: any) {
        console.log(error)
        return Response.json({status: false, message: "Something went wront! Please Try again later.", error: error.message}, {status: 500})
    }
}


export async function POST(request: Request, { params }: { params: { domain: string } }) {
   try {
    const allProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.domain, params.domain))
    
    // console.log(allProfiles)
    let response;
    if(!allProfiles[0]) {
      response ={
        status: false, 
        message: "No profile with this domain!"
      }
    } else {
        response = {
      status: true,
      message: "Domain exists!", 
      profile: allProfiles[0]
    }
    }

    return Response.json(response)
   } catch (error) {
    return Response.json({status: false, message: "Something went wront! Please Try again later.", error: error.message})
   } 
}