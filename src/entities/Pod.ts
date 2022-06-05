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

  // @OneToMany(() => Project, (project) => project.pod, { nullable: true })
  // project: Project[];

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
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
