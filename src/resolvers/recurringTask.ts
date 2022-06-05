import { RecurringTask } from "src/entities/RecurringTask";
import { RecurringTaskInput } from "src/types/RecurringTaskInput";
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

  @Mutation(() => RecurringTaskResolver)
  async addProjectInfo(
    @Arg("recurringTaskOptions") recurringTaskOptions: RecurringTaskInput
  ) {
    let task;
    try {
      task = await RecurringTask.create({
        ...recurringTaskOptions,
      }).save();
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return {
        errors: [
          {
            field: "unknown",
            message: "unknown",
          },
        ],
      };
    }
    return { task };
  }
}
