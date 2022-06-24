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
import { CompletedCount, DaysType } from "../types/types";
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
  @Column({ default: "Click here to name project" })
  taskName!: string;

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.recurringTasks)
  user?: User;

  @Field(() => [SingleTask], { nullable: true })
  @OneToMany(() => SingleTask, (st) => st.recurringTask)
  singleTasks?: SingleTask[];
}
