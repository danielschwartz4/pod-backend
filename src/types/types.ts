import { Request, Response } from "express";
import { ObjectType, Field } from "type-graphql";
import { Pod } from "../entities/Pod";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Redis } from "ioredis";
import { RecurringTask } from "../entities/RecurringTask";
import { SingleTask } from "../entities/SingleTask";

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class ProjectResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@ObjectType()
export class RecurringTaskFieldResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => RecurringTask, { nullable: true })
  task?: RecurringTask;
}

@ObjectType()
export class RecurringTaskResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => RecurringTask, { nullable: true })
  task?: RecurringTask;
}

@ObjectType()
export class SingleTasksResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => [SingleTask], { nullable: true })
  singleTasks?: SingleTask[];
}

@ObjectType()
export class SingleTaskResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => SingleTask, { nullable: true })
  singleTask?: SingleTask;
}

@ObjectType()
export class ProjectInfoResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@ObjectType()
export class PodResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Pod, { nullable: true })
  pod?: Pod;
}

export type TaskStatus = "completed" | "missed" | "overdue" | "tbd";

export type SessionType = "project" | "task";

export type DaysType = {
  0: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  1: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  2: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  3: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  4: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  5: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
  6: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
};

export type CompletedCount = {
  allTime: number;
  fourDays: number;
  week: number;
  month: number;
};
