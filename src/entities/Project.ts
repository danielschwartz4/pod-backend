import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Project extends BaseEntity {
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
  projectName!: string;

  @Field()
  @Column()
  overview!: string;

  @Field(() => [String])
  @Column("text", { array: true })
  milestones!: string[];

  @Field(() => [String])
  @Column("text", { array: true, nullable: true })
  milestoneDates!: String[];

  @Field(() => [Int])
  @Column("int", { array: true, nullable: true })
  milestoneProgress!: number[];

  // @ManyToMany(() => User)
  // @JoinTable()
  // users: User[];

  // @ManyToOne(() => User, (user) => user.projects)
  // user: User;

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true, nullable: true })
  friendProposals!: string[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
