import { relations } from "drizzle-orm/relations";
import { user, vid-b-web_transcriptions, vid-b-web_profiles } from "./schema";

export const vid-b-web_transcriptionsRelations = relations(vid-b-web_transcriptions, ({one}) => ({
	user: one(user, {
		fields: [vid-b-web_transcriptions.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	vid-b-web_transcriptions: many(vid-b-web_transcriptions),
	vid-b-web_profiles: many(vid-b-web_profiles),
}));

export const vid-b-web_profilesRelations = relations(vid-b-web_profiles, ({one}) => ({
	user: one(user, {
		fields: [vid-b-web_profiles.userId],
		references: [user.id]
	}),
}));