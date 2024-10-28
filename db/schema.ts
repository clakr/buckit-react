import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
};

export const buckets = pgTable("buckets", {
  // id: serial().primaryKey(),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  totalAmount: decimal("total_amount", { precision: 9, scale: 2 }).notNull(),
  ...timestamps,
});
