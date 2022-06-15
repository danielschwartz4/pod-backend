import { RecurringTask } from "../entities/RecurringTask";
import { RecurringTaskInput } from "../types/RecurringTaskInput";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext, RecurringTaskResponse } from "../types/types";
import { validateTask } from "../utils/validateTask";
import { SingleTask } from "../entities/SingleTask";

@Resolver()
export class RecurringTaskResolver {
  @Query(() => RecurringTaskResponse, { nullable: true })
  async recurringTask(
    @Arg("id", () => Int) id: number
  ): Promise<RecurringTaskResponse | undefined> {
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
    const tasks = await RecurringTask.find({ where: { podId: podId } });
    return tasks;
  }

  @Mutation(() => RecurringTaskResponse)
  async createRecurringTask(
    @Arg("recurringTaskOptions") recurringTaskOptions: RecurringTaskInput
  ): Promise<RecurringTaskResponse> {
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

  @Mutation(() => RecurringTaskResponse)
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

  @Mutation(() => RecurringTaskResponse)
  async updateTaskPod(@Arg("id") id: number, @Arg("podId") podId: number) {
    const task = await RecurringTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
      return { errors: "task does not exist" };
    }
    await RecurringTask.update({ id }, { podId });
    return { task };
  }
}
