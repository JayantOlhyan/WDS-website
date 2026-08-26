import { describe, it, expect } from "vitest";
import { isUrlAllowedForHealthCheck } from "../lib/healthChecks";

describe("Website Health SSRF Whitelist Security", () => {
  it("allows official MSIT portal", () => {
    expect(isUrlAllowedForHealthCheck("https://msit.in")).toBe(true);
    expect(isUrlAllowedForHealthCheck("https://subdomain.msit.in")).toBe(true);
  });

  it("allows official WDS Bug Hunt portal", () => {
    expect(isUrlAllowedForHealthCheck("https://wds-bug-hunt.netlify.app/bug-hunt")).toBe(true);
  });

  it("allows internal relative paths", () => {
    expect(isUrlAllowedForHealthCheck("/projects#newsletter")).toBe(true);
    expect(isUrlAllowedForHealthCheck("/terminal")).toBe(true);
  });

  it("blocks dangerous private IP ranges and unauthorized domains", () => {
    expect(isUrlAllowedForHealthCheck("http://192.168.1.1/admin")).toBe(false);
    expect(isUrlAllowedForHealthCheck("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isUrlAllowedForHealthCheck("https://malicious-external-site.com")).toBe(false);
  });
});
