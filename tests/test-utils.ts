import { vi, type Mock } from "vitest";

export interface MockMediaQueryList extends MediaQueryList {
  setMatches(matches: boolean): void;
}

export function mockMatchMedia(initialMatches = false): MockMediaQueryList {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mql: MockMediaQueryList = {
    get matches() {
      return matches;
    },
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_type: string, listener: unknown) => {
      if (typeof listener === "function") {
        listeners.add(listener as (event: MediaQueryListEvent) => void);
      }
    }),
    removeEventListener: vi.fn((_type: string, listener: unknown) => {
      if (typeof listener === "function") {
        listeners.delete(listener as (event: MediaQueryListEvent) => void);
      }
    }),
    dispatchEvent: vi.fn((event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent));
      return true;
    }),
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches: nextMatches, media: "" } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };

  vi.stubGlobal("matchMedia", vi.fn(() => mql));
  return mql;
}

export interface MockResizeObserverInstance {
  observe: Mock;
  unobserve: Mock;
  disconnect: Mock;
}

export function mockResizeObserver(): MockResizeObserverInstance {
  const instance: MockResizeObserverInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  class ResizeObserverMock {
    observe = instance.observe;
    unobserve = instance.unobserve;
    disconnect = instance.disconnect;
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  return instance;
}
