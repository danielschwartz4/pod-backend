import { GraphQLJSONObject } from "graphql-type-json";
import { Field, InputType } from "type-graphql";
import { DaysType } from "./types";

@InputType()
export class RecurringTaskInput {
  @Field()
  userId!: number;

  @Field()
  projectName!: string;

  @Field()
  overview!: string;

  @Field(() => GraphQLJSONObject)
  days!: DaysType;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => [GraphQLJSONObject])
  endOptions!: { date: Date; repetitions: number; neverEnds: boolean };
}
