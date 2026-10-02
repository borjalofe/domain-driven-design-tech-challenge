#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { faker } from "@faker-js/faker";

faker.seed(42);

const SERVICES = ["svc_api", "svc_worker", "svc_web", "svc_db"];
const HOSTS = ["host_a", "host_b", "host_c"];
const ENVS = ["prod", "staging", "dev"];

function parseArgs(argv) {
  let count = 500;
  let out = "data/service-events.csv";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--count" && argv[i + 1]) {
      count = Number(argv[++i]);
    } else if (argv[i] === "--out" && argv[i + 1]) {
      out = argv[++i];
    }
  }
  if (!Number.isFinite(count) || count < 1) {
    throw new Error("--count must be a positive number");
  }
  return { count, out };
}

function weightedEventType() {
  const roll = faker.number.float({ min: 0, max: 1 });
  if (roll < 0.82) return "request";
  if (roll < 0.96) return "error";
  return "alert";
}

function main() {
  const { count, out } = parseArgs(process.argv.slice(2));
  const outPath = resolve(process.cwd(), out);
  mkdirSync(dirname(outPath), { recursive: true });

  const header = "event_id,service_id,host_id,env,event_type,occurred_at";
  const rows = [header];

  for (let i = 0; i < count; i++) {
    const event_id = `evt_${String(i + 1).padStart(5, "0")}`;
    const service_id = faker.helpers.arrayElement(SERVICES);
    const host_id = faker.helpers.arrayElement(HOSTS);
    const env = faker.helpers.arrayElement(ENVS);
    const event_type = weightedEventType();
    const occurred_at = faker.date
      .between({ from: "2026-01-01T00:00:00.000Z", to: "2026-09-30T23:59:59.999Z" })
      .toISOString();
    rows.push([event_id, service_id, host_id, env, event_type, occurred_at].join(","));
  }

  writeFileSync(outPath, rows.join("\n") + "\n", "utf8");
  console.log(`Wrote ${count} events to ${outPath}`);
}

main();
