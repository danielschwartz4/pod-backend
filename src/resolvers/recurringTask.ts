import { RecurringTask } from "../entities/RecurringTask";
import { RecurringTaskInput } from "../types/RecurringTaskInput";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { RecurringTaskResponse } from "../types/types";

@Resolver()
export class RecurringTaskResolver {
  @Query(() => RecurringTaskResponse, { nullable: true })
  async recurringTask(
    @Arg("id", () => Int) id: number
  ): Promise<RecurringTaskResponse | undefined> {
    const task = await RecurringTask.findOne({ where: { id: id } });
    if (!task) {
      return { errors: "No task with this ID" };
    }
    return { task };
  }

  @Mutation(() => RecurringTaskResponse)
  async createRecurringTask(
    @Arg("recurringTaskOptions") recurringTaskOptions: RecurringTaskInput
  ): Promise<RecurringTaskResponse> {
    let task;
    try {
      task = await RecurringTask.create({
        ...recurringTaskOptions,
      }).save();
    } catch (err) {
      return {
        errors: "cannot create task",
      };
    }
    return { task };
  }
}
