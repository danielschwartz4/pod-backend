import { Request, Response } from "express";
import { ObjectType, Field } from "type-graphql";
import { Pod } from "./entities/Pod";
import { Project } from "./entities/Project";
import { User } from "./entities/User";

export type MyContext = {
  req: Request;
  res: Response;
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
