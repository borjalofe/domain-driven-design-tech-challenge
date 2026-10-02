export type EventType = "request" | "error" | "alert";

export type ServiceEvent = {
  event_id: string;
  service_id: string;
  host_id: string;
  env: string;
  event_type: EventType;
  occurred_at: string;
};
