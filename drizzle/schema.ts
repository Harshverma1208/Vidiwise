import { pgTable, pgEnum, serial, text, numeric, varchar, timestamp, uniqueIndex, unique, boolean } from "drizzle-orm/pg-core"


export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const vid-b-web_transcriptRows = pgTable("vid-b-web_transcriptRows", {
	id: serial("id").primaryKey().notNull(),
	transcriptText: text("transcriptText").notNull(),
	duration: numeric("duration").notNull(),
	offset: numeric("offset").notNull(),
	videoId: varchar("videoId", { length: 255 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }),
});

export const vid-b-web_transcriptions = pgTable("vid-b-web_transcriptions", {
	id: serial("id").primaryKey().notNull(),
	videoId: varchar("videoId", { length: 255 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }),
	userId: varchar("userId", { length: 255 }).notNull().references(() => user.id),
	title: varchar("title", { length: 550 }).notNull(),
	channelTitle: varchar("channelTitle", { length: 550 }).notNull(),
	thumbnail: text("thumbnail").notNull(),
	summary: text("summary"),
},
(table) => {
	return {
		userId_videoId_idx: uniqueIndex("vid-b-web_transcriptions_userId_videoId_index").on(table.videoId, table.userId),
	}
});

export const vid-b-web_profiles = pgTable("vid-b-web_profiles", {
	id: serial("id").primaryKey().notNull(),
	userId: varchar("userId", { length: 255 }).notNull().references(() => user.id),
	about: text("about"),
	youtubeLink: text("youtubeLink"),
	twitterLink: text("twitterLink"),
	linkedinLink: text("linkedinLink"),
	facebookLink: text("facebookLink"),
	instagramLink: text("instagramLink"),
	domain: text("domain"),
	domainVerified: boolean("domainVerified").default(false),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }),
	premiumUser: boolean("premiumUser").default(false),
	paymentId: text("paymentId"),
},
(table) => {
	return {
		domain_userId_idx: uniqueIndex("vid-b-web_profiles_domain_userId_index").on(table.userId, table.domain),
		vid-b-web_profiles_domain_unique: unique("vid-b-web_profiles_domain_unique").on(table.domain),
	}
});