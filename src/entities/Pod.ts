import { SessionType, TaskType } from "src/types/types";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { RecurringTask } from "./RecurringTask";
import { User } from "./User";

@ObjectType()
@Entity()
export class Pod extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => [Int])
  @Column("integer", { array: true, nullable: true })
  projectIds!: number[];

  @Field(() => [Int])
  @Column("integer", { array: true, nullable: true })
  userIds!: number[];

  @Field()
  @Column()
  cap!: number;

  @Field()
  @Column({
    type: "enum",
    enum: ["exercise", "study", "other"],
    default: "other",
  })
  taskType: TaskType;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Project)
  @JoinTable()
  projects: Project[];

  @ManyToMany(() => RecurringTask)
  @JoinTable()
  recurringTasks: RecurringTask[];

  @Field()
  @Column("boolean", { nullable: true, default: false })
  isPrivate!: boolean;

  @Field()
  @Column({
    type: "enum",
    enum: ["project", "task"],
    default: "project",
  })
  sessionType: SessionType;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
