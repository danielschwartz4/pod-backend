import { Field, InputType, Int } from "type-graphql";

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

  @Field(() => [String])
  milestoneDates!: String[];

  @Field(() => [Int])
  milestoneProgress!: number[];

  @Field()
  groupSize!: number;
}
