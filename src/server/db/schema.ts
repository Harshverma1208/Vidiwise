import {relations, sql } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  pgTable,
  uniqueIndex,
  boolean
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
// import type { AdapterAccountType } from '@auth/core/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `vid-b-web_${name}`);


export const users = pgTable("user", {
 id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: timestamp("emailVerified", { mode: "date" }),
 image: text("image"),
  // createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  // updatedAt: timestamp("updatedAt"),
})

const usersRelations = relations(users, ({ many , one }) => ({
  sessions: many(sessions),
  profiles: one(profiles),
  transcriptions: many(transcriptions),
}));

 
export const accounts = pgTable(
"account",
{
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
   id_token: text("id_token"),
  session_state: text("session_state"),
},
(account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
})
)
 
export const sessions = pgTable("session", {
 sessionToken: text("sessionToken").primaryKey(),
 userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
 expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
 "verificationToken",
 {
   identifier: text("identifier").notNull(),
   token: text("token").notNull(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
)

// USER PROFILE 
export const profiles = createTable(
  "profiles", {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    about: text("about"),

    // socials
    youtubeLink: text("youtubeLink"),
    twitterLink: text("twitterLink"),
    linkedinLink: text("linkedinLink"),
    facebookLink: text("facebookLink"),
    instagramLink: text("instagramLink"),

    domain: text("domain").unique(),
    domainVerified: boolean("domainVerified").default(false),
    premiumUser: boolean("premiumUser").default(false),
    paymentId: text("paymentId"),

    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt"),
  },  (t) => ({
    profileDomainUnique: uniqueIndex().on(t.domain, t.userId)
  }) 
)

const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));


export const transcriptions = createTable(
  "transcriptions",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
    videoId: varchar("videoId", { length: 255 }).notNull(), // same as yt video id
    title: varchar("title", { length: 550 }).notNull(),
    channelTitle: varchar("channelTitle", { length: 550 }).notNull(),
    thumbnail: text("thumbnail").notNull(),
    summary: text("summary"),
    // conversationId: varchar("conversationId", { length: 255 }),
    // jobId: varchar("jobId", { length: 255 }),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt"),
  }, (t) => ({
    vidCreatorUnique: uniqueIndex().on(t.userId, t.videoId),
  }) 
)

export const transcriptionsRelations = relations(transcriptions, ({ many, one }) => ({
  transcriptRows: many(transcriptRows),
  user: one(users, {
    fields: [transcriptions.userId],
    references: [users.id],
  }),
}));

export const transcriptRows= createTable(
  "transcriptRows",
  {
    id: serial("id").primaryKey(),
    transcriptText: text("transcriptText").notNull(),
    duration: decimal("duration").notNull(),
    offset: decimal("offset").notNull(),
    videoId: varchar("videoId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt"),
  }
)

export const transcriptRowsRelations = relations(transcriptRows, ({ one }) => ({
   video: one(transcriptions, {
      fields: [transcriptRows.videoId],
      references: [transcriptions.videoId],
   })
}));


