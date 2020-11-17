export class Queue<T> {
  private _store: T[] = [];

  push(val: T) {
    this._store.push(val);
  }

  pop(): T | undefined {
    return this._store.shift();
  }

  front(): T | undefined {
    return this.empty() ? undefined : this._store[0];
  }

  empty(): boolean {
    return !this._store.length;
  }
}
