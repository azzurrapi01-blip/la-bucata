export type OptimizedImage = {
	src: string;
	thumb: string;
};

export function imageSrcs(images: OptimizedImage[]): string[] {
	return images.map((image) => image.src);
}

export function imageThumbs(images: OptimizedImage[]): string[] {
	return images.map((image) => image.thumb);
}
