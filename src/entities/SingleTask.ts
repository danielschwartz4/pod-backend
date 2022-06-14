import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TaskStatus } from "../types/types";

// enum Status {
//   "completed",
//   "missed",
//   "overdue",
//   "tbd",
// }

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

  @Field()
  @Column()
  notes: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User, (user) => user.singleTasks)
  // user: User;

  // Don't think this is doing anything just doing it in the resolver
  // @ManyToOne(() => RecurringTask, (rc) => rc.singleTasks, {
  //   onDelete: "CASCADE",
  // })
  // recurringTask: RecurringTask;
}
