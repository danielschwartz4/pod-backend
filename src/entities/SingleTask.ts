import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskStatus } from "../types/types";
import { RecurringTask } from "./RecurringTask";
import { User } from "./User";

@ObjectType()
@Entity()
export class SingleTask extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Int)
  @Column({ default: -1 })
  taskId: number;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  actionDate: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  actionDay: number;

  @Field()
  @Column({
    type: "enum",
    enum: ["completed", "missed", "overdue", "tbd"],
    default: "tbd",
  })
  status: TaskStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => RecurringTask, { nullable: true })
  @ManyToOne(() => RecurringTask, (rc) => rc.singleTasks, { nullable: true })
  recurringTask: RecurringTask;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (rc) => rc.singleTasks, { nullable: true })
  user: User;
}
