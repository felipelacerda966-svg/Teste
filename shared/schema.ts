import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type").notNull(), // 'student' or 'trainer'
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'chest', 'back', 'legs', 'cardio', etc.
  duration: integer("duration").notNull(), // in minutes
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  exercises: jsonb("exercises").notNull(), // array of exercise objects
  videoUrl: text("video_url"),
  createdBy: varchar("created_by").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWorkouts = pgTable("user_workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  workoutId: varchar("workout_id").references(() => workouts.id),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  progress: jsonb("progress"), // track exercise completion
  notes: text("notes"),
});

export const bodyMetrics = pgTable("body_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bodyFat: decimal("body_fat", { precision: 5, scale: 2 }), // percentage
  muscleMass: decimal("muscle_mass", { precision: 5, scale: 2 }),
  hydration: decimal("hydration", { precision: 5, scale: 2 }), // percentage
  measuredAt: timestamp("measured_at").defaultNow(),
});

export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  trainerId: varchar("trainer_id").references(() => users.id),
  duration: integer("duration").notNull(), // in weeks
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(sql`0`),
  reviewCount: integer("review_count").default(0),
  workouts: jsonb("workouts").notNull(), // array of workout IDs
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPoints = pgTable("user_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  points: integer("points").default(0),
  workoutsCompleted: integer("workouts_completed").default(0),
  streak: integer("streak").default(0), // consecutive days
  lastWorkoutDate: timestamp("last_workout_date"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertUserWorkoutSchema = createInsertSchema(userWorkouts).omit({
  id: true,
});

export const insertBodyMetricsSchema = createInsertSchema(bodyMetrics).omit({
  id: true,
  measuredAt: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
  rating: true,
  reviewCount: true,
});

export const insertUserPointsSchema = createInsertSchema(userPoints).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type UserWorkout = typeof userWorkouts.$inferSelect;
export type InsertUserWorkout = z.infer<typeof insertUserWorkoutSchema>;

export type BodyMetrics = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetrics = z.infer<typeof insertBodyMetricsSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = z.infer<typeof insertUserPointsSchema>;
