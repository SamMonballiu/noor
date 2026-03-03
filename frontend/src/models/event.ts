export class SubscribableEvent<T = void> {
  private listeners: Set<(value: T) => void> = new Set();

  subscribe = (listener: (value: T) => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  raise = (value: T) => {
    this.listeners.forEach((listener) => listener(value));
  };

  clear = () => {
    this.listeners.clear();
  };
}
