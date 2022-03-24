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
import { Pod } from "./Pod";
import { User } from "./User";

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

  @Field(() => Int)
  @Column()
  groupSize?: number;

  @ManyToOne(() => User, (user) => user.project)
  user: User;

  // @ManyToOne(() => Pod, (pod) => pod.project, { nullable: true })
  // pod: Pod;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
