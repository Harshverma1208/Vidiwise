import { relations, sql } from "drizzle-orm";
import {
  decimal,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  pgTable,
  uniqueIndex,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `vid-b-web_${name}`);

// Enums for better type safety
export const userRoleEnum = pgEnum("user_role", ['user', 'admin', 'moderator']);

// ============================================================================
// APPLICATION TABLES
// ============================================================================

// USERS TABLE (Simplified without NextAuth)
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  transcriptions: many(transcriptions),
}));

// USER PROFILE TABLE
export const profiles = createTable(
  "profiles", 
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    about: text("about"),
    
    // Social links
    youtubeLink: text("youtubeLink"),
    twitterLink: text("twitterLink"),
    linkedinLink: text("linkedinLink"),
    facebookLink: text("facebookLink"),
    instagramLink: text("instagramLink"),
    
    // Custom domain functionality
    domain: text("domain").unique(),
    domainVerified: boolean("domainVerified").default(false),
    premiumUser: boolean("premiumUser").default(false),
    paymentId: text("paymentId"),
    
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }, 
  (t) => ({
    profileDomainUnique: uniqueIndex().on(t.domain, t.userId)
  }) 
);

const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

// TRANSCRIPTIONS TABLE
export const transcriptions = createTable(
  "transcriptions",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    videoId: varchar("videoId", { length: 255 }).notNull(), // YouTube video ID
    title: varchar("title", { length: 550 }).notNull(),
    channelTitle: varchar("channelTitle", { length: 550 }).notNull(),
    thumbnail: text("thumbnail").notNull(),
    summary: text("summary"),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }, 
  (t) => ({
    vidCreatorUnique: uniqueIndex().on(t.userId, t.videoId),
  }) 
);

const transcriptionsRelations = relations(transcriptions, ({ many, one }) => ({
  transcriptRows: many(transcriptRows),
  user: one(users, {
    fields: [transcriptions.userId],
    references: [users.id],
  }),
}));

// TRANSCRIPT ROWS TABLE
export const transcriptRows = createTable(
  "transcriptRows",
  {
    id: serial("id").primaryKey(),
    transcriptText: text("transcriptText").notNull(),
    duration: decimal("duration").notNull(),
    offset: decimal("offset").notNull(),
    videoId: varchar("videoId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
);

const transcriptRowsRelations = relations(transcriptRows, ({ one }) => ({
  video: one(transcriptions, {
    fields: [transcriptRows.videoId],
    references: [transcriptions.videoId],
  })
}));

// ============================================================================
// EXPORT ALL RELATIONS
// ============================================================================

export const allRelations = {
  users: usersRelations,
  profiles: profilesRelations,
  transcriptions: transcriptionsRelations,
  transcriptRows: transcriptRowsRelations,
};