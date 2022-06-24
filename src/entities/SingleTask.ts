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
  // @Column({ nullable: true })
  taskId: number;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  actionDate: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  actionDay: number;

  // @Field(() => Status)
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

  // @ManyToOne(() => User, (user) => user.singleTasks)
  // user: User;

  @Field(() => RecurringTask, { nullable: true })
  @ManyToOne(() => RecurringTask, (rc) => rc.singleTasks)
  recurringTask: RecurringTask;

  @Field(() => User)
  @ManyToOne(() => User, (rc) => rc.singleTasks)
  user: User;
}
