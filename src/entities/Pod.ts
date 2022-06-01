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
