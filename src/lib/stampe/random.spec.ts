import { describe, expect, it } from 'vitest';
import { pickRandom } from './random';

describe('pickRandom', () => {
	it('returns exactly count distinct items', () => {
		const items = ['a', 'b', 'c', 'd', 'e'];
		const result = pickRandom(items, 2);

		expect(result).toHaveLength(2);
		expect(new Set(result).size).toBe(2);
	});

	it('returns all items when count exceeds length', () => {
		const items = ['a', 'b'];
		const result = pickRandom(items, 5);

		expect(result).toHaveLength(2);
		expect(new Set(result).size).toBe(2);
	});
});

