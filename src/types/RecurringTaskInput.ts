import { Field, InputType } from "type-graphql";

@InputType()
export class RecurringTaskInput {
  @Field()
  userId!: number;

  @Field()
  projectName!: string;

  @Field()
  overview!: string;

  @Field(() => [String])
  days!: string[];

  @Field(() => [String])
  dayData!: String[];

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date)
  endDate!: Date;
}
