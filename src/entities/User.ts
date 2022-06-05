import { GraphQLJSONObject } from "graphql-type-json";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RecurringTask } from "./RecurringTask";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone!: string;

  @Column()
  password!: string;

  @OneToMany(() => RecurringTask, (recurringTask) => recurringTask.user)
  recurringTasks: RecurringTask[];

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @Column("jsonb", { nullable: true })
  friendRequests!: { projectId: number; podId: number }[];

  @Field(() => Int, { nullable: true })
  @Column({ default: 1, nullable: true })
  avatar!: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
