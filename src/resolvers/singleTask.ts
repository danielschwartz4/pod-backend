import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RecurringTask } from "../entities/RecurringTask";
import { SingleTask } from "../entities/SingleTask";
import { SingleTaskInput } from "../types/SingleTaskInput";
import {
  DaysType,
  SingleTaskResponse,
  SingleTasksResponse,
  TaskStatus,
} from "../types/types";
import {
  addDays,
  dataBetweenTwoDates,
  EntryType,
  extractDaysIdxs,
  minDate,
} from "../utils/singleTaskUtils";
import { sortTasksByDate } from "../utils/sortTasksByDate";

@Resolver()
export class SingleTasksResolver {
  @Query(() => SingleTasksResponse, { nullable: true })
  async singleTasks(
    @Arg("taskId", () => Int) taskId: number
  ): Promise<SingleTasksResponse | undefined> {
    // const tasks = await SingleTask.find({
    //   where: { taskId: taskId },
    // });

    const qb = getConnection()
      .getRepository(SingleTask)
      .createQueryBuilder("st")
      .innerJoinAndSelect("st.user", "u", 'u.id=st."userId"')
      .orderBy('st."actionDate"')
      .where('st."taskId"=:taskId', { taskId: taskId });
    // !! Sorting with sql instead of function
    // const sortedTasks = sortTasksByDate(tasks);
    const tasks = await qb.getMany();
    if (!tasks) {
      return { errors: "Can't find any tasks" };
    }
    return { singleTasks: tasks };
  }

  @Query(() => SingleTasksResponse, { nullable: true })
  async recentPodSingleTasks(
    @Arg("taskIds", () => [Int]) taskIds: number[]
  ): Promise<SingleTasksResponse | undefined> {
    const qb = getConnection()
      .getRepository(SingleTask)
      .createQueryBuilder("st")
      .innerJoinAndSelect("st.user", "u", 'u.id=st."userId"')
      // .innerJoinAndSelect("st.recurringTask", "t", 't.id=st."taskId"')
      .orderBy('st."actionDate"', "DESC")
      .where('st."taskId" IN (:...taskIds)', {
        taskIds: taskIds,
      })
      .where("st.notes != ''");

    const tasks = await qb.getMany();
    if (!tasks) {
      return { errors: "Can't find any tasks" };
    }
    return { singleTasks: tasks };
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

    let cursorDate = recurringTask?.cursorDate;
    let chunkEndDate: Date;
    let realEndDate: Date;

    if (cursorDate == undefined) {
      cursorDate = recurringTask?.startDate;
    }

    // Might have to add days to end date
    if (recurringTask?.endOptions?.date != null) {
      realEndDate = new Date(recurringTask?.endOptions?.date);
      chunkEndDate = minDate(addDays(limit, cursorDate), realEndDate);
    } else if (recurringTask?.endOptions?.repetitions != null) {
      realEndDate = addDays(
        recurringTask?.endOptions?.repetitions * 7,
        recurringTask.startDate
      );
      chunkEndDate = minDate(addDays(limit, cursorDate), realEndDate);
    } else {
      chunkEndDate = addDays(limit, cursorDate);
      realEndDate = chunkEndDate;
    }

    const selectedDays = recurringTask?.days as DaysType;
    const selectedDaysIdxs = extractDaysIdxs(selectedDays);
    const singleTasksByDay = dataBetweenTwoDates(
      cursorDate,
      chunkEndDate,
      selectedDaysIdxs
    );

    const nextDay = addDays(1, chunkEndDate);
    let singleTasksArr = [] as SingleTask[];

    Object.keys(singleTasksByDay).forEach((key) => {
      if (selectedDaysIdxs.has(parseInt(key))) {
        const arr = singleTasksByDay[parseInt(key)];
        console.log("ARRRR", arr);
        arr.forEach(async (ele: EntryType) => {
          let resp = await SingleTask.create({
            actionDate: ele.actionDate,
            actionDay: ele.actionDay,
            status: "tbd",
            notes: "",
            taskId: recurringTask?.id,
            userId: recurringTask?.userId,
          }).save();
          singleTasksArr.push(resp);
        });
      }
    });

    if (minDate(realEndDate, nextDay) != realEndDate) {
      await RecurringTask.update(
        { id: recurringTask.id },
        { cursorDate: nextDay }
      );
    }

    const sortedTasks = sortTasksByDate(singleTasksArr);
    return { singleTasks: sortedTasks };
  }
}
