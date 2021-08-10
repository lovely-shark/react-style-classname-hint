type CallbackFn<R extends any[], T> = (...arg: R) => T;

interface IThrottleOptions {
  delay?: number;
  immediate?: boolean;
}

const defaultThrottleOptions: IThrottleOptions = {
  delay: 1000,
  immediate: false,
};

export default function Throttle<R extends any[], T>(
  fn: CallbackFn<R, T>,
  options = defaultThrottleOptions
) {
  let timer: NodeJS.Timeout | undefined | number;
  // FIX: 同步节流写法，无法处理最后一次操作
  return function (...arg: R) {
    if (options.immediate) {
      options.immediate = false;
      return fn?.(...arg);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = undefined;
      }, options.delay);
      return fn?.(...arg);
    }
  };
}
