export const confirmOnExit: (callback: Function) => void = (callback) => {
	// eslint-disable-next-line no-restricted-globals
	const confirmFormExit = confirm("You will lose progress! Are you sure you wish to continue?");
	if (confirmFormExit) {
		callback?.();
	}
};
