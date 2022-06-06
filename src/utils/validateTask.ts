import { RecurringTaskInput } from "src/types/RecurringTaskInput";

export const validateTask = (options: RecurringTaskInput) => {
  if (!options.overview) {
    return [
      {
        field: "overview",
        message: "overview is required",
      },
    ];
  }

  if (!options.startDate) {
    return [
      {
        field: "startDate",
        message: "start date is required",
      },
    ];
  }

  if (
    !options.endOptions.date &&
    !options.endOptions.repetitions &&
    !options.endOptions.neverEnds
  ) {
    return [
      {
        field: "endOptions",
        message: "must specify an end date, repetitions, or never ends",
      },
    ];
  }

  if (options.startDate && options.startDate < new Date()) {
    return [
      {
        field: "startDate",
        message: "start date must be in the future",
      },
    ];
  }

  if (
    options.endOptions.date &&
    options.startDate &&
    options.endOptions.date.getTime() < options.startDate.getTime()
  ) {
    return [
      {
        field: "endOptions",
        message: "end date must be after start date",
      },
    ];
  }

  if (
    options.endOptions.repetitions &&
    options.startDate &&
    options.endOptions.repetitions < 1
  ) {
    return [
      {
        field: "endOptions",
        message: "repetitions must be greater than 0",
      },
    ];
  }

  if (Object.values(options.days).every((x) => x.isSelected === false)) {
    return [
      {
        field: "days",
        message: "must select at least one day",
      },
    ];
  }

  return null;
};
