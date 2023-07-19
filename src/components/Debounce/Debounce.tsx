export const debounce = (
  func: {
    (value: string): void;
    apply: (arg0: null, arg1: string[]) => void;
  },
  time: number | undefined
) => {
  let timer: string | number | NodeJS.Timeout | null;
  return function (...args: string[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(null, args);
    }, time);
  };
};
