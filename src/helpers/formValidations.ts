export const imageValidator: ({ file, sizeInMb }: { file: File; sizeInMb?: number | string }) => string | true = ({
	file,
	sizeInMb = process.env.REACT_APP_MAX_FILE_SIZE_UPLOAD,
}) => {
	const size = 1024 * 1024 * Number(sizeInMb);

	if (!file || !file.size) return true;

	return file.size <= size ? true : `File should be smaller than ${size} MB`;
};

// Parse null values from table row to empty string
export const parseDefaultValues = (values) => Object.entries(values).reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] ?? "" }), {});
