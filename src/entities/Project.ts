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
import { User } from "./User";

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  podId?: number;

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

  @Field(() => [Date])
  @Column("text", { array: true })
  milestoneDates!: Date[];

  @Field(() => Int)
  @Column()
  groupSize!: number;

  @ManyToOne(() => User, (user) => user.project)
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
