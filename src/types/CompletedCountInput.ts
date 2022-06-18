import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CompletedCountInput {
  @Field()
  allTime!: number;

  @Field()
  fourDays!: number;

  @Field()
  week!: number;

  @Field()
  month!: number;
}
