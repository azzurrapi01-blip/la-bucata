import { expect } from 'vitest';
import type { EnhancedImageSrc } from './types';

export function expectEnhancedSrc(src: EnhancedImageSrc): void {
	expect(src.img.src.length).toBeGreaterThan(0);
	expect(src.img.w).toBeGreaterThan(0);
	expect(src.img.h).toBeGreaterThan(0);
	expect(Object.keys(src.sources).length).toBeGreaterThan(0);
}
