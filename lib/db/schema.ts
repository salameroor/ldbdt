import { boolean, date, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const donors = pgTable('donors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  bloodGroup: text('blood_group').notNull(),
  phone: text('phone').notNull(),
  district: text('district').notNull(),
  area: text('area').notNull(),
  lastDonationDate: date('last_donation_date'),
  available: boolean('available').notNull().default(true),
  createdByUserId: text('created_by_user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const staffRoles = pgTable('staff_roles', {
  userId: text('user_id').primaryKey(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const moderatorActivity = pgTable('moderator_activity', {
  id: text('id').primaryKey(),
  moderatorUserId: text('moderator_user_id').notNull(),
  moderatorName: text('moderator_name').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const complaints = pgTable(
  'complaints',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('complaints_created_at_idx').on(table.createdAt)],
)

export type Donor = typeof donors.$inferSelect
export type Complaint = typeof complaints.$inferSelect
