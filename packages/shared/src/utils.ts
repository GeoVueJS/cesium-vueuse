export interface ArrayDifferenceRetrun<T> {
  added: T[];
  removed: T[];
}

/**
 * 计算两个数组的差异，返回新增和删除的元素
 */
export function arrayDifference<T>(
  list: T[],
  oldList: T[] | undefined,
): ArrayDifferenceRetrun<T> {
  const oldListSet = new Set(oldList);
  const added: T[] = list.filter(obj => !oldListSet.has(obj));
  const newListSet = new Set(list);
  const removed = oldList?.filter(obj => !newListSet.has(obj)) ?? [];
  return { added, removed };
}
