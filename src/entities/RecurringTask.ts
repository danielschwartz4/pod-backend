import { GraphQLJSONObject } from "graphql-type-json";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CompletedCount, DaysType, TaskType } from "../types/types";
import { Message } from "./Message";
import { SingleTask } from "./SingleTask";
import { User } from "./User";

@ObjectType()
@Entity()
export class RecurringTask extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 0 })
  podId!: number;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field()
  @Column({ default: "Unnamed task" })
  taskName!: string;

  @Field()
  @Column({
    type: "enum",
    enum: ["exercise", "study", "other"],
    default: "other",
  })
  taskType: TaskType;

  @Field()
  @Column()
  overview!: string;

  @Field(() => GraphQLJSONObject)
  @Column("jsonb")
  days!: DaysType;

  @Field(() => Date)
  @Column()
  startDate!: Date;

  @Field(() => GraphQLJSONObject)
  @Column("jsonb")
  endOptions!: { date: Date; repetitions: number; neverEnds: boolean };

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  cursorDate!: Date;

  @Field(() => GraphQLJSONObject)
  @Column("jsonb", {
    default: {
      allTime: 0,
      week: 0,
    },
  })
  completedCount!: CompletedCount;

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true, nullable: true })
  friendProposals!: string[];

  @Field(() => Int)
  @Column({ default: 1 })
  points: number;

  // @Field(() => Int)
  // @Column()
  // taskStatusToday!: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.recurringTasks, { nullable: true })
  user?: User;

  @Field(() => [SingleTask], { nullable: true })
  @OneToMany(() => SingleTask, (st) => st.recurringTask)
  singleTasks: SingleTask[];

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.task)
  messages: Message[];
}
