import { GraphQLJSONObject } from "graphql-type-json";
import { Field, InputType } from "type-graphql";
import { DaysType } from "./types";

@InputType()
export class RecurringTaskInput {
  @Field()
  userId: number;

  @Field()
  projectName: string;

  @Field()
  overview: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  days: DaysType;

  @Field(() => Date, { nullable: true })
  startDate: Date;

  @Field(() => GraphQLJSONObject, { nullable: true })
  endOptions: { date: Date; repetitions: number; neverEnds: boolean };
}
