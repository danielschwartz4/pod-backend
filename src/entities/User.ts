import { GraphQLJSONObject } from "graphql-type-json";
import { MessagingSettings } from "../types/types";
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
import { Project } from "./Project";
import { RecurringTask } from "./RecurringTask";
import { SingleTask } from "./SingleTask";
import { Message } from "../entities/Message";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone!: string;

  @Column()
  password!: string;

  @Field(() => [GraphQLJSONObject], { nullable: true })
  @Column("jsonb", { nullable: true })
  friendRequests!: { projectId: number; podId: number }[];

  @Field(() => Int, { nullable: true })
  @Column({ default: 1, nullable: true })
  avatar!: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column("jsonb", {
    nullable: true,
    default: {
      email: {
        podMilestonCompletion: false,
        milestoneApproaching: false,
        websiteUpdates: true,
      },
      phone: {
        podMilestonCompletion: true,
        milestoneApproaching: true,
        websiteUpdates: false,
      },
    },
  })
  messagingSettings!: MessagingSettings;

  @Field()
  @Column({ default: false })
  hasCreatedTask!: boolean;

  @Field()
  @Column({ default: "", nullable: true })
  feedback: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Project], { nullable: true })
  @OneToMany(() => Project, (project) => project.user, { nullable: true })
  projects?: Project[];

  @Field(() => [RecurringTask])
  @OneToMany(() => RecurringTask, (recurringTask) => recurringTask.user)
  recurringTasks: RecurringTask[];

  @Field(() => [SingleTask])
  @OneToMany(() => SingleTask, (singleTask) => singleTask.user)
  singleTasks: SingleTask[];

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
