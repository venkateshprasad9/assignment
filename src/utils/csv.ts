import { DerivedTask } from "@/types"; // Import DerivedTask

/**
 * Escapes a value for use in a CSV cell.
 * Handles commas, double quotes, and newlines.
 */
function escapeCsv(value: string | number | null | undefined): string {
  if (value == null) {
    // Catches null and undefined
    return "";
  }

  const str = String(value);

  // Check if we need to quote the string (if it contains special chars)
  const needsQuotes =
    str.includes(",") || str.includes('"') || str.includes("\n");

  if (!needsQuotes) {
    return str;
  }

  // 1. Escape all double quotes by doubling them
  const escapedStr = str.replace(/"/g, '""');

  // 2. Wrap the escaped string in double quotes
  return `"${escapedStr}"`;
}

/**
 * Converts an array of tasks into a CSV string.
 */
export function toCSV(tasks: ReadonlyArray<DerivedTask>): string {
  // Use DerivedTask
  // Define stable, explicit headers in the order we want
  const headers = [
    "id",
    "title",
    "revenue",
    "timeTaken",
    "priority",
    "status",
    "notes",
    "createdAt",
    "completedAt",
    "roi",
    "priorityWeight",
  ];

  const rows = tasks.map((t) => [
    // Manually map all fields in the correct order and escape them
    escapeCsv(t.id),
    escapeCsv(t.title),
    escapeCsv(t.revenue),
    escapeCsv(t.timeTaken),
    escapeCsv(t.priority),
    escapeCsv(t.status),
    escapeCsv(t.notes),
    escapeCsv(t.createdAt),
    escapeCsv(t.completedAt),
    escapeCsv(t.roi), // Add the missing 'roi' field
    escapeCsv(t.priorityWeight), // Add the missing 'priorityWeight' field
  ]);

  // Join headers and rows
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Triggers a browser download for the given CSV content.
 */
export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
