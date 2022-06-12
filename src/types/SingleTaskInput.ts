import { Field, InputType } from "type-graphql";

@InputType()
export class SingleTaskInput {
  @Field()
  userId!: number;

  @Field()
  taskId!: number;

  @Field()
  notes!: string;

  @Field()
  completed: boolean;

  @Field(() => Date, { nullable: true })
  actionDate: Date;

  @Field({ nullable: true })
  actionDay: number;
}
