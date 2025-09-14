import {tokenize} from './tokenize';

export type TaskId = number;
export type InvertedIndex = Map<string, Set<TaskId>>;

/**
 * Build an inverted index from a list of tasks.
 */
export function buildIndex<T extends { id: TaskId; title: string }>(
  items: T[],
  locale = 'en'
): InvertedIndex {
  const idx: InvertedIndex = new Map();
  for (const it of items) {
    for (const tok of tokenize(it.title, locale)) {
      const set = idx.get(tok) ?? new Set<TaskId>();
      set.add(it.id);
      idx.set(tok, set);
    }
  }
  return idx;
}

/**
 * Copy-on-write add: clones touched sets so callers can keep immutability.
 */
export function addToIndex(
  idx: InvertedIndex,
  id: TaskId,
  title: string,
  locale = 'en'
): InvertedIndex {
  const next = new Map(idx); // clone map reference
  for (const tok of tokenize(title, locale)) {
    const cloned = new Set(next.get(tok) ?? []);
    cloned.add(id);
    next.set(tok, cloned);
  }
  return next;
}

/**
 * Copy-on-write remove.
 */
export function removeFromIndex(
  idx: InvertedIndex,
  id: TaskId,
  title: string,
  locale = 'en'
): InvertedIndex {
  const next = new Map(idx);
  for (const tok of tokenize(title, locale)) {
    const cur = next.get(tok);
    if (!cur) continue;
    const cloned = new Set(cur);
    cloned.delete(id);
    if (cloned.size) next.set(tok, cloned);
    else next.delete(tok);
  }
  return next;
}

/**
 * Update tokens for an item title.
 */
export function updateInIndex(
  idx: InvertedIndex,
  id: TaskId,
  oldTitle: string,
  newTitle: string,
  locale = 'en'
): InvertedIndex {
  if (oldTitle === newTitle) return idx;
  const afterRemove = removeFromIndex(idx, id, oldTitle, locale);
  return addToIndex(afterRemove, id, newTitle, locale);
}

/**
 * Exact-token query: returns IDs for a token equal to q.
 */
export function queryExact(idx: InvertedIndex, q: string): TaskId[] {
  const tok = q.trim().toLowerCase();
  if (!tok) return [];
  return [...(idx.get(tok) ?? [])];
}

/**
 * Prefix-token query: union of all tokens starting with prefix.
 * Handy & simple; optimize later with sorted keys or a trie if V grows large.
 */
export function queryPrefix(idx: InvertedIndex, q: string): TaskId[] {
  const p = q.trim().toLowerCase();
  if (!p) return [];
  const hits = new Set<TaskId>();
  for (const [key, set] of idx) {
    if (key.startsWith(p)) for (const id of set) hits.add(id);
  }
  return [...hits];
}