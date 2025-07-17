import { format, isToday, isYesterday, isThisWeek, isSameYear } from "date-fns";

export const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "hh:mm a"); // e.g., 03:42 PM
};

export const formatDateDivider = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE"); // Monday, Tuesday...
  if (isSameYear(date, new Date())) return format(date, "dd MMM yyyy"); // 14 Jul

  return format(date, "dd MMM yyyy"); // 14 Jul 2023
};
