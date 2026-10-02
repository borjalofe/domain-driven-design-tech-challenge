import { describe, expect, it } from "vitest";
import {
  dimensions,
  isDimensionKey,
  isMetricKey,
  metrics,
} from "./catalog";

describe("catalog", () => {
  it("exposes count and rate metrics", () => {
    expect(metrics.requests.kind).toBe("count");
    expect(metrics.requests.eventType).toBe("request");
    expect(metrics.error_rate.kind).toBe("rate");
    expect(metrics.error_rate.numerator).toBe("errors");
    expect(metrics.error_rate.denominator).toBe("requests");
    expect(metrics.alert_rate.numerator).toBe("alerts");
  });

  it("maps dimensions to event fields", () => {
    expect(dimensions.service.field).toBe("service_id");
    expect(dimensions.host.field).toBe("host_id");
    expect(dimensions.env.field).toBe("env");
    expect(dimensions.date.field).toBe("date");
  });

  it("guards metric and dimension keys", () => {
    expect(isMetricKey("requests")).toBe(true);
    expect(isMetricKey("nope")).toBe(false);
    expect(isDimensionKey("service")).toBe(true);
    expect(isDimensionKey("nope")).toBe(false);
  });
});
