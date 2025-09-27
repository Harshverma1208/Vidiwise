import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { profiles, users } from "~/server/db/schema";

export const getOrCreateProfile = async (userId: string) => {
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if(!profile[0]) {
        // create profile
        const newProfile = await db.insert(profiles).values({
            userId: userId,
        }).returning()

        return newProfile[0];
    }
      
    return profile[0];
}

export const updateProfile = async (userId: string, about: string) => {
    const profile = await getOrCreateProfile(userId);
    
    const updatedProfile = await db.update(profiles)
    .set({ about: about })
    .where(eq(profiles.id, profile?.id!))
    
    return updatedProfile;
}

export const profileWDomain = async(domain : string) => {
    const allProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.domain, domain))
    
    console.log(allProfiles)
    
    if(!allProfiles[0]) {
      return {
        status: false, 
        message: "No profile with this domain!"
      }
    }

    return {
      status: true,
      message: "Domain exists!", 
      profile: allProfiles[0]
    }
}