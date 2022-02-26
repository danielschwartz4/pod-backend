import { Field, InputType } from "type-graphql";

@InputType()
export class ProjectInput {
  @Field()
  userId!: number;

  @Field()
  projectName!: string;

  @Field()
  overview!: string;

  @Field(() => [String])
  milestones!: string[];

  // @Field(() => [Date])
  // milestoneDates!: Date[];
  @Field(() => [String])
  milestoneDates!: String[];

  @Field()
  groupSize!: number;
}
