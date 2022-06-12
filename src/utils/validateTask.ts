import { RecurringTaskInput } from "../types/RecurringTaskInput";

export const validateTask = (options: RecurringTaskInput) => {
  if (!options.overview) {
    return [
      {
        field: "overview",
        message: "Overview is required",
      },
    ];
  }

  if (!options.startDate) {
    return [
      {
        field: "startDate",
        message: "Start date is required",
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
        message: "Must specify an end date, repetitions, or never ends",
      },
    ];
  }

  if (options.startDate && options.startDate < new Date()) {
    return [
      {
        field: "startDate",
        message: "Start date must be in the future",
      },
    ];
  }

  if (
    options.endOptions.date &&
    options.startDate &&
    new Date(options.endOptions.date).getTime() <
      new Date(options.startDate).getTime()
  ) {
    return [
      {
        field: "endOptions",
        message: "End date must be after start date",
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
        message: "Repetitions must be greater than 0",
      },
    ];
  }

  if (Object.values(options.days).every((x) => x.isSelected === false)) {
    return [
      {
        field: "days",
        message: "Must select at least one day",
      },
    ];
  }

  return null;
};
