import { TaskStatus } from "./types";
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
  status: TaskStatus;

  @Field(() => Date, { nullable: true })
  actionDate: Date;

  @Field({ nullable: true })
  actionDay: number;
}
