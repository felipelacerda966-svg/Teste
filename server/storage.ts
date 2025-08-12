import { 
  type User, 
  type InsertUser,
  type Workout,
  type InsertWorkout,
  type UserWorkout,
  type InsertUserWorkout,
  type BodyMetrics,
  type InsertBodyMetrics,
  type WorkoutPlan,
  type InsertWorkoutPlan,
  type UserPoints,
  type InsertUserPoints
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Workout methods
  getWorkout(id: string): Promise<Workout | undefined>;
  getWorkouts(): Promise<Workout[]>;
  getWorkoutsByUser(userId: string): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout | undefined>;
  
  // User workout methods
  getUserWorkouts(userId: string): Promise<UserWorkout[]>;
  getUserWorkoutsByDate(userId: string, date: string): Promise<UserWorkout[]>;
  createUserWorkout(userWorkout: InsertUserWorkout): Promise<UserWorkout>;
  updateUserWorkout(id: string, userWorkout: Partial<UserWorkout>): Promise<UserWorkout | undefined>;
  
  // Body metrics methods
  getBodyMetrics(userId: string): Promise<BodyMetrics[]>;
  getLatestBodyMetrics(userId: string): Promise<BodyMetrics | undefined>;
  createBodyMetrics(metrics: InsertBodyMetrics): Promise<BodyMetrics>;
  
  // Workout plan methods
  getWorkoutPlans(): Promise<WorkoutPlan[]>;
  getFeaturedWorkoutPlans(): Promise<WorkoutPlan[]>;
  getWorkoutPlansByTrainer(trainerId: string): Promise<WorkoutPlan[]>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  
  // User points methods
  getUserPoints(userId: string): Promise<UserPoints | undefined>;
  getUsersRanking(): Promise<(UserPoints & { user: User })[]>;
  createOrUpdateUserPoints(points: InsertUserPoints): Promise<UserPoints>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private userWorkouts: Map<string, UserWorkout> = new Map();
  private bodyMetrics: Map<string, BodyMetrics> = new Map();
  private workoutPlans: Map<string, WorkoutPlan> = new Map();
  private userPoints: Map<string, UserPoints> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const user1: User = {
      id: "user1",
      username: "joaosilva",
      email: "joao@email.com",
      password: "hashed_password",
      firstName: "João",
      lastName: "Silva",
      userType: "student",
      profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face",
      createdAt: new Date(),
    };

    const trainer1: User = {
      id: "trainer1",
      username: "carlos_personal",
      email: "carlos@email.com",
      password: "hashed_password",
      firstName: "Carlos",
      lastName: "Personal",
      userType: "trainer",
      profileImage: "https://pixabay.com/get/gc0ea620160c45128fc1dc3b6b47cfbb4c9fb8b430746823fc26807c216d7c508354965e8856976144df8716da3b549b6c11d2d7e3e037baa76f23a6660f58d59_1280.jpg",
      createdAt: new Date(),
    };

    this.users.set(user1.id, user1);
    this.users.set(trainer1.id, trainer1);

    // Create sample workouts
    const workout1: Workout = {
      id: "workout1",
      name: "Treino de Peito",
      description: "Treino focado no desenvolvimento do peitoral",
      category: "chest",
      duration: 45,
      difficulty: "intermediate",
      exercises: [
        { name: "Supino Reto", sets: 4, reps: 12, weight: 80 },
        { name: "Supino Inclinado", sets: 3, reps: 10, weight: 70 },
        { name: "Crucifixo", sets: 3, reps: 15, weight: 25 }
      ],
      videoUrl: "https://example.com/chest-workout-video",
      createdBy: trainer1.id,
      isPublic: true,
      price: "0",
      createdAt: new Date(),
    };

    const workout2: Workout = {
      id: "workout2",
      name: "Cardio HIIT",
      description: "Treino de cardio alta intensidade",
      category: "cardio",
      duration: 30,
      difficulty: "advanced",
      exercises: [
        { name: "Burpees", duration: 30, rest: 10 },
        { name: "Mountain Climbers", duration: 30, rest: 10 },
        { name: "Jump Squats", duration: 30, rest: 10 }
      ],
      videoUrl: "https://example.com/hiit-workout-video",
      createdBy: trainer1.id,
      isPublic: true,
      price: "0",
      createdAt: new Date(),
    };

    this.workouts.set(workout1.id, workout1);
    this.workouts.set(workout2.id, workout2);

    // Create sample user workouts (scheduled for today)
    const today = new Date();
    const userWorkout1: UserWorkout = {
      id: "uw1",
      userId: user1.id,
      workoutId: workout1.id,
      scheduledDate: today,
      completedDate: null,
      progress: { completedExercises: 0, totalExercises: 3 },
      notes: null,
    };

    const userWorkout2: UserWorkout = {
      id: "uw2",
      userId: user1.id,
      workoutId: workout2.id,
      scheduledDate: today,
      completedDate: null,
      progress: { completedExercises: 3, totalExercises: 5 },
      notes: null,
    };

    this.userWorkouts.set(userWorkout1.id, userWorkout1);
    this.userWorkouts.set(userWorkout2.id, userWorkout2);

    // Create sample body metrics
    const metrics: BodyMetrics = {
      id: "metrics1",
      userId: user1.id,
      weight: "75.2",
      bodyFat: "12.5",
      muscleMass: "62.7",
      hydration: "58.3",
      measuredAt: new Date(),
    };

    this.bodyMetrics.set(metrics.id, metrics);

    // Create sample workout plans
    const plan1: WorkoutPlan = {
      id: "plan1",
      name: "Hipertrofia Avançada",
      description: "Programa completo de 12 semanas para ganho de massa muscular",
      trainerId: trainer1.id,
      duration: 12,
      price: "49.90",
      rating: "4.8",
      reviewCount: 124,
      workouts: ["workout1", "workout2"],
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      isFeatured: true,
      createdAt: new Date(),
    };

    this.workoutPlans.set(plan1.id, plan1);

    // Create sample user points
    const points: UserPoints = {
      id: "points1",
      userId: user1.id,
      points: 1245,
      workoutsCompleted: 42,
      streak: 12,
      lastWorkoutDate: new Date(),
    };

    this.userPoints.set(points.id, points);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Workout methods
  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async getWorkoutsByUser(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(workout => workout.createdBy === userId);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = {
      ...insertWorkout,
      id,
      createdAt: new Date(),
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;
    
    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  // User workout methods
  async getUserWorkouts(userId: string): Promise<UserWorkout[]> {
    return Array.from(this.userWorkouts.values()).filter(uw => uw.userId === userId);
  }

  async getUserWorkoutsByDate(userId: string, date: string): Promise<UserWorkout[]> {
    const targetDate = new Date(date);
    return Array.from(this.userWorkouts.values()).filter(uw => 
      uw.userId === userId && 
      uw.scheduledDate && 
      uw.scheduledDate.toDateString() === targetDate.toDateString()
    );
  }

  async createUserWorkout(insertUserWorkout: InsertUserWorkout): Promise<UserWorkout> {
    const id = randomUUID();
    const userWorkout: UserWorkout = {
      ...insertUserWorkout,
      id,
    };
    this.userWorkouts.set(id, userWorkout);
    return userWorkout;
  }

  async updateUserWorkout(id: string, updates: Partial<UserWorkout>): Promise<UserWorkout | undefined> {
    const userWorkout = this.userWorkouts.get(id);
    if (!userWorkout) return undefined;
    
    const updatedUserWorkout = { ...userWorkout, ...updates };
    this.userWorkouts.set(id, updatedUserWorkout);
    return updatedUserWorkout;
  }

  // Body metrics methods
  async getBodyMetrics(userId: string): Promise<BodyMetrics[]> {
    return Array.from(this.bodyMetrics.values())
      .filter(metric => metric.userId === userId)
      .sort((a, b) => b.measuredAt!.getTime() - a.measuredAt!.getTime());
  }

  async getLatestBodyMetrics(userId: string): Promise<BodyMetrics | undefined> {
    const metrics = await this.getBodyMetrics(userId);
    return metrics[0];
  }

  async createBodyMetrics(insertMetrics: InsertBodyMetrics): Promise<BodyMetrics> {
    const id = randomUUID();
    const metrics: BodyMetrics = {
      ...insertMetrics,
      id,
      measuredAt: new Date(),
    };
    this.bodyMetrics.set(id, metrics);
    return metrics;
  }

  // Workout plan methods
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values());
  }

  async getFeaturedWorkoutPlans(): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(plan => plan.isFeatured);
  }

  async getWorkoutPlansByTrainer(trainerId: string): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(plan => plan.trainerId === trainerId);
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = randomUUID();
    const plan: WorkoutPlan = {
      ...insertPlan,
      id,
      rating: "0",
      reviewCount: 0,
      createdAt: new Date(),
    };
    this.workoutPlans.set(id, plan);
    return plan;
  }

  // User points methods
  async getUserPoints(userId: string): Promise<UserPoints | undefined> {
    return Array.from(this.userPoints.values()).find(points => points.userId === userId);
  }

  async getUsersRanking(): Promise<(UserPoints & { user: User })[]> {
    const allPoints = Array.from(this.userPoints.values());
    const ranking = allPoints
      .sort((a, b) => b.points - a.points)
      .map(points => ({
        ...points,
        user: this.users.get(points.userId!)!
      }));
    return ranking;
  }

  async createOrUpdateUserPoints(insertPoints: InsertUserPoints): Promise<UserPoints> {
    const existingPoints = await this.getUserPoints(insertPoints.userId!);
    
    if (existingPoints) {
      const updatedPoints = { ...existingPoints, ...insertPoints };
      this.userPoints.set(existingPoints.id, updatedPoints);
      return updatedPoints;
    } else {
      const id = randomUUID();
      const points: UserPoints = {
        ...insertPoints,
        id,
      };
      this.userPoints.set(id, points);
      return points;
    }
  }
}

export const storage = new MemStorage();
