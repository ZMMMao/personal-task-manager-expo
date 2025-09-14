/**
 * Tokenize a string into lowercase "word" tokens.
 * Prefers Unicode-aware Intl.Segmenter when available, falls back to a regex.
 */
 export function tokenize(input: string, locale = 'en') : string[] {
    if(!input) return [];
    const s = input.toLowerCase();

    // Use Intl.Segmenter if available (Node 14+, modern browsers, React Native 0.65+)
    const hasSegmenter =
        typeof (globalThis as any).Intl !== 'undefined' &&
        typeof (Intl as any).Segmenter === 'function';

    if (hasSegmenter) {
        const seg = new (Intl as any).Segmenter(locale, { granularity: 'word' });
        const out: string[] = [];
        for(const part of seg.segment(s)){
            if(part.isWordLike) out.push(part.segment);
        }
        return out;
    }
    // Fallback: ASCII-ish tokens (letters/digits; keeps "don't" and "co-op" as single tokens)
    const m = s.match(/\b[a-z0-9]+(?:[-'][a-z0-9]+)*\b/g);
    return m ?? [];
 }