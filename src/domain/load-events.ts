import type { EventType, ServiceEvent } from "./types";

const EVENT_TYPES = new Set<EventType>(["request", "error", "alert"]);

function parseLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

export function loadEventsFromCsv(csv: string): ServiceEvent[] {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const header = parseLine(lines[0]!);
  const expected = [
    "event_id",
    "service_id",
    "host_id",
    "env",
    "event_type",
    "occurred_at",
  ];
  if (header.join(",") !== expected.join(",")) {
    throw new Error(`Unexpected CSV header: ${header.join(",")}`);
  }

  const events: ServiceEvent[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]!);
    if (cols.length !== 6) {
      throw new Error(`Invalid CSV row ${i + 1}: expected 6 columns`);
    }
    const [event_id, service_id, host_id, env, event_type, occurred_at] = cols as [
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    if (!EVENT_TYPES.has(event_type as EventType)) {
      throw new Error(`Invalid event_type on row ${i + 1}: ${event_type}`);
    }
    events.push({
      event_id,
      service_id,
      host_id,
      env,
      event_type: event_type as EventType,
      occurred_at,
    });
  }
  return events;
}
