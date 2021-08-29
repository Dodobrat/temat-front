export const imageValidator: ({ file, sizeInMb }: { file: File; sizeInMb?: number }) => string | true = ({ file, sizeInMb = 5 }) => {
	const size = 1024 * 1024 * sizeInMb;

	if (!file || !file.size) return true;

	return file.size <= size ? true : `File should be smaller than ${size} MB`;
};

export const parseDefaultValues = (values) => Object.entries(values).reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] ?? "" }), {});
