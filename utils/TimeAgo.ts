import { formatDistanceToNow } from "date-fns";

export function timeAgo(date: Date | string): string {
    if (!date) return "";

    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
}
