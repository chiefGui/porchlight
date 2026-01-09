import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Utility class for date/time formatting.
 */
export class DateUtil {
	/**
	 * Format a timestamp for message display.
	 * - Today: "3:42 PM"
	 * - Yesterday: "Yesterday"
	 * - This week: "Monday"
	 * - Older: "Jan 5"
	 */
	static formatMessageTime(timestamp: number): string {
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
	static formatFull(timestamp: number): string {
		return dayjs(timestamp).format("MMM D, YYYY [at] h:mm A");
	}

	/**
	 * Get relative time (e.g., "2 hours ago").
	 */
	static formatRelative(timestamp: number): string {
		return dayjs(timestamp).fromNow();
	}

	/**
	 * Check if two timestamps are on the same day.
	 */
	static isSameDay(a: number, b: number): boolean {
		return dayjs(a).isSame(dayjs(b), "day");
	}

	/**
	 * Format time only (e.g., "3:42 PM").
	 */
	static formatTime(timestamp: number): string {
		return dayjs(timestamp).format("h:mm A");
	}

	/**
	 * Format date only (e.g., "Jan 5, 2026").
	 */
	static formatDate(timestamp: number): string {
		return dayjs(timestamp).format("MMM D, YYYY");
	}

	/**
	 * Format short date (e.g., "Jan 5").
	 */
	static formatShortDate(timestamp: number): string {
		return dayjs(timestamp).format("MMM D");
	}
}
