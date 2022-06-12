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
export class SingleTask extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field(() => Int)
  @Column()
  taskId!: number;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  actionDate: Date;

  @Field()
  @Column("boolean", { nullable: true, default: false })
  completed: boolean;

  @Field()
  @Column()
  notes: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.singleTasks)
  user: User;

  // Don't think this is doing anything just doing it in the resolver
  // @ManyToOne(() => RecurringTask, (rc) => rc.singleTasks, {
  //   onDelete: "CASCADE",
  // })
  // recurringTask: RecurringTask;
}
