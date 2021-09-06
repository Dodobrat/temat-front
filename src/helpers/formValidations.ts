type imageValidatorType = {
	file: File;
	multi?: boolean;
	sizeInMb?: number | string;
	t: any;
};

export const imageValidator: ({ file, multi, sizeInMb, t }: imageValidatorType) => string | true = ({
	file,
	multi = false,
	sizeInMb = process.env.REACT_APP_MAX_FILE_SIZE_UPLOAD,
	t,
}) => {
	const size = 1024 * 1024 * Number(sizeInMb);

	if (!file || !file.size) return true;

	if (file.size <= size) {
		return true;
	}
	if (multi) {
		return t("validation.multiMaxFileSize", { sizeInMb });
	} else {
		return t("validation.maxFileSize", { sizeInMb });
	}
};

// Parse null values from table row to empty string
export const parseDefaultValues = (values) => Object.entries(values).reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] ?? "" }), {});
