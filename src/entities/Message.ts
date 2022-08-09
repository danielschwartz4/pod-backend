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
import { RecurringTask } from "./RecurringTask";
import { User } from "./User";
@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Int)
  @Column({ default: -1 })
  taskId: number;

  @Field()
  @Column()
  message: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (u) => u.singleTasks, { nullable: true })
  user: User;

  @Field(() => RecurringTask, { nullable: true })
  @ManyToOne(() => RecurringTask, (rt) => rt.messages, { nullable: true })
  task: RecurringTask;
}
