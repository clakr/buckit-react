import {
  decimal,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().$onUpdate(() => new Date()),
};

export const buckets = pgTable("buckets", {
  id: serial().primaryKey(),
  user_id: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  total_amount: decimal({ precision: 9, scale: 2 }).notNull(),
  ...timestamps,
});
