import { SingleTask } from "../entities/SingleTask";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { SingleTaskResponse, SingleTasksResponse } from "../types/types";
import { SingleTaskInput } from "../types/SingleTaskInput";
import { sortTasksByDate } from "../utils/sortTasksByDate";

@Resolver()
export class SingleTasksResolver {
  @Query(() => SingleTasksResponse, { nullable: true })
  async singleTasks(
    @Arg("taskId", () => Int) taskId: number
  ): Promise<SingleTasksResponse | undefined> {
    const tasks = await SingleTask.find({
      where: { taskId: taskId },
    });
    if (!tasks) {
      return { errors: "Can't find any tasks" };
    }
    const sortedTasks = sortTasksByDate(tasks);
    return { singleTasks: sortedTasks };
  }

  @Query(() => SingleTaskResponse, { nullable: true })
  async singleTask(
    @Arg("id", () => Int) id: number
  ): Promise<SingleTaskResponse | undefined> {
    const task = await SingleTask.findOne({ id });
    if (!task) {
      return { errors: "Task does not exist" };
    }
    return { singleTask: task };
  }

  @Mutation(() => SingleTaskResponse)
  async updateSingleTaskStatus(@Arg("id", () => Int) id: number) {
    const task = await SingleTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
    }
    await SingleTask.update({ id }, { id });
    return { task };
  }

  @Mutation(() => SingleTaskResponse)
  async addSingleTask(
    @Arg("singleTaskOptions") singleTaskOptions: SingleTaskInput
  ) {
    let task;
    try {
      task = await SingleTask.create({
        ...singleTaskOptions,
      }).save();
    } catch {
      return {
        errors: "cannot add task",
      };
    }
    return { task };
  }
}
