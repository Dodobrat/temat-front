export const parseParams: (params: any) => string = (params) => {
	const urlParams = [];

	if (params) {
		if (params.filters) {
			urlParams.push(
				Object.entries(params.filters)
					.filter((param) => param[1] !== "")
					.map((item) => `${item[0]}=${item[1]}`)
					.join("&")
			);
		}
		if (params.sortBy?.length > 0) {
			urlParams.push(`sortBy=${params.sortBy?.map((sortItem) => `${sortItem.desc ? "-" : "+"}${sortItem.id}`).join(",")}` ?? "");
		}
		return urlParams
			.filter((val) => val)
			.map((param) => `${param}`)
			.join("&");
	} else {
		return "";
	}
};
