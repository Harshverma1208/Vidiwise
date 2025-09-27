export const runtime = 'nodejs';

import { eq } from "drizzle-orm"
import verifyDomainValues from "~/config/domain.vercel"
import { addDomainToVercel, domainConfigValuesAll, getConfigResponse, removeDomainFromVercelProject, removeDomainFromVercelTeam, verifyDomain } from "~/lib/domains"
import { getOrCreateProfile, profileWDomain } from "~/lib/helpers/profile"
import { db } from "~/server/db"
import { profiles, users } from "~/server/db/schema"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request, { params }: { params: { domain: string } }) {
    // get domain config/domain status
    try {
        // For now, we'll use a placeholder userId since auth is removed
        // This should be replaced with proper authentication when implementing new auth
        const userId = "guest-user"; // This should come from your new auth system
        
        let profile = await getOrCreateProfile(userId);

        if(!profile) {
            return Response.json({ status: false, message: "Profile not found" }, { status: 404 });
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
            return Response.json({ status: false, message: "Error updating profile" }, { status: 500 });
        })
        
        if(configResposne.isDomainVerified) {
            await db.update(profiles)
            .set({ domainVerified: true })
            .where(eq(profiles.userId, profile.userId))
        }
        const res = await verifyDomain(params.domain)
        
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
        return Response.json({status: false, message: "Something went wrong! Please Try again later.", error: error.message}, {status: 500})
    }
}

export async function POST(request: Request, { params }: { params: { domain: string } }) {
   try {
    const allProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.domain, params.domain))
    
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
    return Response.json({status: false, message: "Something went wrong! Please Try again later.", error: error.message})
   } 
}