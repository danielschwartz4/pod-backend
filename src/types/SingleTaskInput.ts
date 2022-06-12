import { GraphQLJSONObject } from "graphql-type-json";
import { Field, InputType, Int } from "type-graphql";
import { DayType } from "./types";

@InputType()
export class SingleTaskInput {
  @Field()
  userId!: number;

  @Field()
  taskId!: number;

  @Field(() => Int, { nullable: true })
  podId!: number;

  @Field()
  notes!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  day!: DayType;

  @Field()
  completed: boolean;

  @Field(() => Date, { nullable: true })
  actionDate: Date;
}
