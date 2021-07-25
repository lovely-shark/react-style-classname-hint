export default class ThrottleFn {
  private time: NodeJS.Timeout | null = null;
  private fn?: Function;
  constructor() {}

  exec = (delayed: number, fn: Function) => {
    if (this.time === null) {
      this.fn = fn;
      this.time = setTimeout(() => {
        this.time = null;
        this.fn?.();
      }, delayed);
    }
  };
}
