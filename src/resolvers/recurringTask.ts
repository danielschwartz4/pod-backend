import { RecurringTask } from "../entities/RecurringTask";
import { RecurringTaskInput } from "../types/RecurringTaskInput";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { RecurringTaskResponse } from "../types/types";
import { validateTask } from "../utils/validateTask";

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

  @Mutation(() => RecurringTaskResponse)
  async createRecurringTask(
    @Arg("recurringTaskOptions") recurringTaskOptions: RecurringTaskInput
  ): Promise<RecurringTaskResponse> {
    console.log(recurringTaskOptions);
    const errors = validateTask(recurringTaskOptions);
    console.log(errors);
    if (errors) {
      return { errors };
    }

    let task;
    task = await RecurringTask.create({
      ...recurringTaskOptions,
    }).save();

    return { task };
  }
}
