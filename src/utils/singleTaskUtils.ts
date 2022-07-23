export type EntryType = {
  idx: number;
  actionDate: Date;
  actionDay: number;
};

export type EntriesType = EntryType[];

type DayDictType = {
  0: EntriesType;
  1: EntriesType;
  2: EntriesType;
  3: EntriesType;
  4: EntriesType;
  5: EntriesType;
  6: EntriesType;
};

export function dataBetweenTwoDates(
  start: Date,
  end: Date,
  dayIdxs: Set<number>
) {
  let dayDict: { [key: number]: EntriesType } = {
    0: [] as EntriesType,
    1: [] as EntriesType,
    2: [] as EntriesType,
    3: [] as EntriesType,
    4: [] as EntriesType,
    5: [] as EntriesType,
    6: [] as EntriesType,
  } as DayDictType;
  for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const dayIdx = d.getDay();
    if (dayIdxs.has(dayIdx)) {
      let currDay = dayDict[dayIdx];
      let prev = currDay[currDay.length - 1];
      let newCount = prev == undefined ? 1 : prev["idx"] + 1;
      let newDate = new Date(d);
      let entry = {
        idx: newCount,
        actionDate: newDate,
        actionDay: dayIdx,
      };
      currDay.push(entry);
      dayDict[dayIdx] = currDay;
    }
  }
  return dayDict;
}

export function extractDaysIdxs(days: {
  [key: number]: {
    abr?: string;
    isSelected: boolean;
    duration: number;
  };
}) {
  let idxs = new Set<number>();
  Object.keys(days).forEach((day) => {
    if (days[parseInt(day)].isSelected) {
      idxs.add(parseInt(day));
    }
  });
  return idxs;
}

export function addDays(days: number, startDate: Date) {
  const newDate = new Date(startDate);
  return new Date(+newDate + 1000 * 60 * 60 * 24 * days);
}

export function minDate(date1: Date, date2: Date) {
  if (date1.setHours(0, 0, 0, 0) < date2.setHours(0, 0, 0, 0)) {
    return date1;
  }
  return date2;
}

export const daysEqual = (date1: Date, date2: Date) => {
  let isEqual = false;
  isEqual =
    date1.getDate() == date2.getDate() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getFullYear() == date2.getFullYear();
  return isEqual;
};
