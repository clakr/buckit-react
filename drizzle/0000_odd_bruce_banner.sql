CREATE TABLE IF NOT EXISTS "buckets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "buckets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"total_amount" numeric(9, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
