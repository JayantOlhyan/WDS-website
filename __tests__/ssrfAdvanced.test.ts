import { describe, it, expect } from "vitest";
import { isUrlAllowedForHealthCheck } from "../lib/healthChecks";

describe("Advanced SSRF & IPv6 Defense", () => {
  it("blocks IPv6 Unique-Local and Link-Local probe addresses", () => {
    expect(isUrlAllowedForHealthCheck("http://[fc00::1]/admin")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://[fd00::1]/internal")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://[fe80::1]/status")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://[::1]/debug")).toBe(false);
  });

  it("blocks cloud metadata service endpoints (AWS / GCP / Azure)", () => {
    expect(isUrlAllowedForHealthCheck("http://169.254.169.254/latest/meta-data/")).toBe(false);
  });

  it("blocks IPv4 private and loopback addresses", () => {
    expect(isUrlAllowedForHealthCheck("http://127.0.0.1:8080/")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://10.0.0.1/")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://192.168.1.1/")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://172.20.0.1/")).toBe(false);
  });

  it("allows verified allowlisted public endpoints", () => {
    expect(isUrlAllowedForHealthCheck("https://msit.in")).toBe(true);
    expect(isUrlAllowedForHealthCheck("https://wds-bug-hunt.netlify.app/bug-hunt")).toBe(true);
    expect(isUrlAllowedForHealthCheck("https://github.com/JayantOlhyan/WDS-website")).toBe(true);
  });
});
