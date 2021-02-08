export const debounce = (
  callback: (...args: any[]) => void,
  debounceTime: number,
) => {
  let timer: NodeJS.Timeout;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(callback, debounceTime);
  };
};
