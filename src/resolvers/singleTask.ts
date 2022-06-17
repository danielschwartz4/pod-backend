import { RecurringTask } from "../entities/RecurringTask";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { SingleTask } from "../entities/SingleTask";
import { SingleTaskInput } from "../types/SingleTaskInput";
import {
  DaysType,
  RecurringTaskResponse,
  SingleTaskResponse,
  SingleTasksResponse,
  TaskStatus,
} from "../types/types";
import { sortTasksByDate } from "../utils/sortTasksByDate";
import {
  addDays,
  convertToSingleTasks,
  daysEqual,
  extractDaysIdxs,
  minDate,
} from "../utils/singleTaskUtils";

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
    // !! Maybe faster to sort with sql
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
  async updateSingleTaskCompletionStatus(
    @Arg("status") status: TaskStatus,
    @Arg("id", () => Int) id: number
  ) {
    const task = await SingleTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
    }
    await SingleTask.update({ id }, { status });
    return { task };
  }

  @Mutation(() => SingleTaskResponse)
  async updateSingleTaskNotes(
    @Arg("notes") notes: string,
    @Arg("id", () => Int) id: number
  ) {
    const task = await SingleTask.findOne(id);
    if (!task) {
      console.log("task does not exist");
    }
    await SingleTask.update({ id }, { notes });
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

  @Mutation(() => SingleTasksResponse)
  async addSingleTasksChunk(
    @Arg("recTaskId") recTaskId: number,
    @Arg("limit") limit: number
  ) {
    const recurringTask = await RecurringTask.findOne({
      where: { id: recTaskId },
    });
    if (!recurringTask) {
      return { errors: "must provide a recurring task as argument" };
    }
    if (recurringTask?.startDate == undefined) {
      return { errors: "must provide start date" };
    }
    let cursorDate = recurringTask?.cursorDate;
    let endDate: Date;
    let realEndDate: Date;

    if (cursorDate == undefined) {
      cursorDate = recurringTask?.startDate;
    }

    if (recurringTask?.endOptions?.date != null) {
      realEndDate = new Date(recurringTask?.endOptions?.date);
      endDate = minDate(addDays(limit, cursorDate), realEndDate);
    } else if (recurringTask?.endOptions?.repetitions != null) {
      realEndDate = addDays(
        recurringTask?.endOptions?.repetitions * 7,
        recurringTask.startDate
      );
      endDate = minDate(addDays(limit, cursorDate), realEndDate);
    } else {
      endDate = addDays(limit, cursorDate);
      realEndDate = endDate;
    }

    const selectedDays = recurringTask?.days as DaysType;
    const selectedDaysIdxs = extractDaysIdxs(selectedDays);
    const singleTasksByDay = convertToSingleTasks(
      recurringTask,
      selectedDaysIdxs,
      cursorDate,
      endDate
    );

    const nextDay = addDays(1, endDate);
    if (daysEqual(minDate(realEndDate, nextDay), nextDay)) {
      await RecurringTask.update(
        { id: recTaskId },
        { cursorDate: addDays(1, endDate) }
      );
      console.log(singleTasksByDay);
      // !! Then add to singleTasks table
    }
    // !! if they are equal don't add anything
    else if (daysEqual(realEndDate, endDate)) {
      console.log(singleTasksByDay);
      return { errors: "reached end date" };
    }

    // return { errors: "reached end date" };
  }
}
