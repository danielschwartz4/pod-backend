import { SingleTask } from "../entities/SingleTask";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { SingleTaskResponse, SingleTasksResponse } from "../types/types";
import { SingleTaskInput } from "../types/SingleTaskInput";

@Resolver()
export class SingleTasksResolver {
  @Query(() => SingleTasksResponse, { nullable: true })
  async singleTasks(
    @Arg("projectId", () => Int) projectId: number
  ): Promise<SingleTasksResponse | undefined> {
    const tasks = await SingleTask.find({ where: { projectId: projectId } });
    if (!tasks) {
      return { errors: "Project not found" };
    }
    return { singleTasks: tasks };
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
