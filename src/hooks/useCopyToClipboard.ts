export const useCopyToClipboard = () => {
	const isSupported = Boolean(navigator.clipboard);
	const copy = (value: string) => {
		if (isSupported) {
			navigator.clipboard.writeText(value);
		}
	};
	return { copy, isSupported };
};
