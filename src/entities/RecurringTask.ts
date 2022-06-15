import { GraphQLJSONObject } from "graphql-type-json";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DaysType } from "../types/types";

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

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column("jsonb", { nullable: true })
  days!: DaysType;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  startDate!: Date;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column("jsonb", { nullable: true })
  endOptions!: { date: Date; repetitions: number; neverEnds: boolean };

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true, nullable: true })
  friendProposals!: string[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User, (user) => user.recurringTasks)
  // user: User;

  // @ManyToMany(() => User)
  // @JoinTable()
  // users: User[];

  // @OneToMany(() => SingleTask, (st) => st.recurringTask)
  // singleTasks: SingleTask[];
}
