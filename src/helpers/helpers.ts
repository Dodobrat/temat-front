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
