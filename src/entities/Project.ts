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
  @Column()
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

  // @ManyToOne(() => User, (user) => user.project)
  // user: User;

  // @ManyToOne(() => Pod, (pod) => pod.project, { nullable: true })
  // pod: Pod;

  // @Field(() => [String])
  // @Column("text", { array: true, nullable: true })
  // friendRequests!: string[];

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
