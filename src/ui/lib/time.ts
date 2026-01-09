import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(relativeTime);
dayjs.extend(calendar);

/**
 * Format a timestamp for message display.
 * - Today: "3:42 PM"
 * - Yesterday: "Yesterday"
 * - This week: "Monday"
 * - Older: "Jan 5"
 */
export function formatMessageTime(timestamp: number): string {
	const date = dayjs(timestamp);
	const now = dayjs();

	if (date.isSame(now, "day")) {
		return date.format("h:mm A");
	}

	if (date.isSame(now.subtract(1, "day"), "day")) {
		return "Yesterday";
	}

	if (date.isAfter(now.subtract(7, "day"))) {
		return date.format("dddd");
	}

	return date.format("MMM D");
}

/**
 * Format a timestamp with full date and time.
 */
export function formatFullTime(timestamp: number): string {
	return dayjs(timestamp).format("MMM D, YYYY [at] h:mm A");
}

/**
 * Get relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(timestamp: number): string {
	return dayjs(timestamp).fromNow();
}

/**
 * Check if two timestamps are on the same day.
 */
export function isSameDay(a: number, b: number): boolean {
	return dayjs(a).isSame(dayjs(b), "day");
}
