import { useEffect, useState } from "react";

/** value가 바뀐 뒤 delay(ms)만큼 지난 후에만 값 갱신 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
