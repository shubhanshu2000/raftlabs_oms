import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock EventSource for tests
Object.defineProperty(window, "EventSource", {
  writable: true,
  value: class EventSourceMock {
    constructor(url: string) {}
    close() {}
  },
});
