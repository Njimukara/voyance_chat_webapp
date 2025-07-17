import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, isThisWeek, isSameYear } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColorForName = (name: string) => {
  const colors = [
    "text-blue-500",
    "text-green-500",
    "text-orange-500",
    "text-purple-500",
    "text-teal-500",
    "text-pink-500",
    "text-rose-500",
    "text-indigo-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

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
