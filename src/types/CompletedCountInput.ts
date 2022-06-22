import { Field, InputType } from "type-graphql";

@InputType()
export class CompletedCountInput {
  @Field()
  allTime?: number;

  @Field()
  week?: number;
}
