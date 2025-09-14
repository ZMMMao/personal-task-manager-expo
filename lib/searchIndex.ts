import {tokenize} from './tokenize';

export type TaskId = number;
export type InvertedIndex = Record<string, Set<TaskId>>;

/**
 * Build an inverted index from a list of tasks.
 */
export function buildIndex<T extends {id : TaskId; title: string }>(
    items: T[],
    locale = 'en'
): InvertedIndex{
    const idx: InvertedIndex = {};
    for(const it of items){
        for (const tok of tokenize(it.title, locale)){
            (idx[tok] ||= new Set()).add(it.id);
        }
    }
    return idx;
}

/**
 * Copy-on-write add: clones touched sets so callers can keep immutability.
 */
export function addToIndex(idx: InvertedIndex, id: TaskId, title: string, locale = 'en') {
  for (const tok of tokenize(title, locale)) {
    const set = new Set(idx[tok] ?? []);
    set.add(id);
    idx[tok] = set;
  }
}

/**
 * Copy-on-write remove.
 */
export function removeFromIndex(idx: InvertedIndex, id: TaskId, title: string, locale = 'en') {
  for (const tok of tokenize(title, locale)) {
    const current = idx[tok];
    if (!current) continue;
    const next = new Set(current);
    next.delete(id);
    if (next.size) idx[tok] = next;
    else delete idx[tok];
  }
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
) {
  if (oldTitle === newTitle) return;
  removeFromIndex(idx, id, oldTitle, locale);
  addToIndex(idx, id, newTitle, locale);
}

/**
 * Exact-token query: returns IDs for a token equal to q.
 */
export function queryExact(idx: InvertedIndex, q: string): TaskId[] {
  const tok = q.trim().toLowerCase();
  if (!tok) return [];
  return [...(idx[tok] ?? [])];
}

/**
 * Prefix-token query: union of all tokens starting with prefix.
 * Handy & simple; optimize later with sorted keys or a trie if V grows large.
 */
export function queryPrefix(idx: InvertedIndex, q: string): TaskId[] {
  const p = q.trim().toLowerCase();
  if (!p) return [];
  const hits = new Set<TaskId>();
  for (const key in idx) {
    if (key.startsWith(p)) {
      for (const id of idx[key]) hits.add(id);
    }
  }
  return [...hits];
}