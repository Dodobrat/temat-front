type imageValidatorType = {
	file: File;
	multi?: boolean;
	sizeInMb?: number | string;
};

export const imageValidator: ({ file, multi, sizeInMb }: imageValidatorType) => string | true = ({
	file,
	multi = false,
	sizeInMb = process.env.REACT_APP_MAX_FILE_SIZE_UPLOAD,
}) => {
	const size = 1024 * 1024 * Number(sizeInMb);

	if (!file || !file.size) return true;

	if (file.size <= size) {
		return true;
	}
	if (multi) {
		return `One of the files is bigger than ${sizeInMb} MB`;
	} else {
		return `File should be smaller than ${sizeInMb} MB`;
	}
};

// Parse null values from table row to empty string
export const parseDefaultValues = (values) => Object.entries(values).reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] ?? "" }), {});
