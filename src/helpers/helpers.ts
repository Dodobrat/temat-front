export const confirmOnExit: (callback: Function, t: any) => void = (callback, t) => {
	// eslint-disable-next-line no-restricted-globals
	const confirmFormExit = confirm(t("confirmation.loseProgress"));
	if (confirmFormExit) {
		callback?.();
	}
};

export const parseRoles = (roles = "") => {
	const explodedRoles = roles.split(",");
	const parsedRoles = [];

	for (const role of explodedRoles) {
		const roleData = role.split(":");
		parsedRoles.push({ value: parseInt(roleData[0]), label: roleData[1] });
	}

	return parsedRoles;
};

export const parseBaseLink = (data) => {
	const { link, file } = data?.data;
	let fileURL: string;

	if (link) {
		fileURL = link;
	} else if (file) {
		fileURL = `data:application/pdf;base64,${encodeURI(file)}`;
	}

	return fileURL;
};

export const capitalizeString = (string) => {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

export const dirtyConfirmOnExit = (touchedFields, onClose, t) => {
	const touched = Object.entries(touchedFields).length > 0;
	if (touched) {
		return confirmOnExit(onClose, t);
	}
	return onClose();
};
