import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RecurringTask } from "../entities/RecurringTask";
import { SingleTask } from "../entities/SingleTask";
import { CompletedCountInput } from "../types/CompletedCountInput";
import { RecurringTaskInput } from "../types/RecurringTaskInput";
import {
  MyContext,
  RecurringTaskFieldResponse,
  RecurringTaskResponse,
} from "../types/types";
import { validateTask } from "../utils/validateTask";

@Resolver()
export class RecurringTaskResolver {
  @Query(() => RecurringTaskFieldResponse, { nullable: true })
  async recurringTask(
    @Arg("id", () => Int) id: number
  ): Promise<RecurringTaskFieldResponse | undefined> {
    const task = await RecurringTask.findOne({ where: { id: id } });
    if (!task) {
      return { errors: [{ field: "id", message: "Task not found" }] };
    }
    return { task };
  }

  @Query(() => [RecurringTask], { nullable: true })
  async recurringTasks(
    @Ctx() { req }: MyContext
  ): Promise<RecurringTask[] | undefined> {
    const userId = req.session.userId;
    const tasks = await RecurringTask.find({ where: { userId: userId } });
    return tasks;
  }

  @Query(() => [RecurringTask], { nullable: true })
  async podTasks(
    @Arg("podId", () => Int) podId: number
  ): Promise<RecurringTask[] | undefined> {
    const qb = getConnection()
      .getRepository(RecurringTask)
      .createQueryBuilder("t")
      .innerJoinAndSelect("t.user", "u", 'u.id=t."userId"')
      .orderBy('t."createdAt"')
      .where("t.podId = :podId", { podId });

    const tasks = await qb.getMany();
    return tasks;
  }

  @Mutation(() => RecurringTaskFieldResponse)
  async createRecurringTask(
    @Arg("recurringTaskOptions") recurringTaskOptions: RecurringTaskInput
  ): Promise<RecurringTaskFieldResponse> {
    const errors = validateTask(recurringTaskOptions);
    if (errors) {
      return { errors };
    }
    let task;
    task = await RecurringTask.create({
      ...recurringTaskOptions,
    }).save();

    return { task };
  }

  @Mutation(() => RecurringTaskFieldResponse)
  async updateTaskName(
    @Arg("id") id: number,
    @Arg("taskName", () => String) taskName: string
  ) {
    const task = await RecurringTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
      return { errors: "task does not exist" };
    }
    await RecurringTask.update({ id }, { taskName });
    return { task };
  }

  @Mutation(() => Boolean)
  async deleteRecurringTask(@Arg("id") id: number): Promise<boolean> {
    SingleTask.delete({ taskId: id });
    RecurringTask.delete(id);
    return true;
  }

  @Mutation(() => RecurringTaskFieldResponse)
  async updateTaskPod(@Arg("id") id: number, @Arg("podId") podId: number) {
    const task = await RecurringTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
      return { errors: "task does not exist" };
    }
    await RecurringTask.update({ id }, { podId });
    return { task };
  }

  @Mutation(() => RecurringTaskResponse)
  async updateCompletedCount(
    @Arg("id") id: number,
    @Arg("completedCount")
    completedCount: CompletedCountInput
  ) {
    const task = await RecurringTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
      return { errors: "task does not exist" };
    }
    await RecurringTask.update({ id }, { completedCount });
    return { task };
  }

  @Mutation(() => RecurringTaskResponse, { nullable: true })
  async updateTaskFriendProposals(
    @Arg("id") id: number,
    @Arg("isAdding", () => Boolean) isAdding: boolean,
    @Arg("addedFriends", () => [String]) addedFriends: string[],
    @Arg("deletedFriend", () => String) deletedFriend: string
  ) {
    const task = await RecurringTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
      return { errors: "task does not exist" };
    }
    let friendProposals = task.friendProposals;
    if (isAdding) {
      friendProposals = friendProposals
        ?.concat(addedFriends)
        .filter((friend) => friend != "");
      await RecurringTask.update({ id }, { friendProposals });
    } else {
      if (friendProposals?.includes(deletedFriend)) {
        const newProposals = friendProposals?.filter(
          (proposal) => proposal !== deletedFriend
        );
        await RecurringTask.update({ id }, { friendProposals: newProposals });
      } else {
        console.log("friend does not exist");
        return { errors: "friend does not exist" };
      }
    }
    return { task };
  }
}
