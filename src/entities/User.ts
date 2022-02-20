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

  @Column()
  password!: string;

  @OneToMany(() => Project, (project) => project.user, { nullable: true })
  project: Project[];

  // @Field({ nullable: true })
  // @Column({ nullable: true })
  // overview?: string;

  // @Field({ nullable: true })
  // @Column({ nullable: true })
  // timeline?: string;

  // @Field({ nullable: true })
  // @Column({ nullable: true })
  // groupSize?: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}