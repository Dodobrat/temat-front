export const parseOrderAddData = (data) => {
	const formData = new FormData();

	data.products.forEach((product: { value: string; quantity: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
	});

	data.files.forEach((file: string | Blob | File | any) => {
		formData.append("files", file);
	});

	Object.entries(data.shipping).forEach((entry: any) => {
		if (typeof entry[1] === "object") {
			if (entry[0] === "country" && entry[1]?.value) {
				formData.append(`${entry[0]}Id`, entry[1]?.value);
				formData.append(entry[0], entry[1]?.label);
			} else if (entry[0] === "city" && entry[1]?.value) {
				formData.append(`${entry[0]}Id`, entry[1]?.value);
				formData.append(entry[0], entry[1]?.label);
			} else if (entry[0] === "streetName" && entry[1]?.value) {
				const street = entry[0].substring(0, 6);
				formData.append(`${street}Id`, entry[1]?.value);
				formData.append(`${street}Name`, entry[1]?.label);
			} else if (entry[0] === "officeId" && entry[1]?.value) {
				const office = entry[0].substring(0, 6);
				const shippingCourier = data.shipping?.shippingMethodId?.label?.split(" ")[0]?.toLowerCase();
				formData.append(`${office}Id`, shippingCourier === "speedy" ? entry[1]?.value : entry[1]?.data?.code);
				formData.append(`${office}Name`, entry[1]?.label);
			} else {
				if (entry[1]?.value) {
					formData.append(entry[0], entry[1]?.value);
				}
			}
		} else {
			if (entry[1] || typeof entry[1] === "boolean") {
				formData.append(entry[0], typeof entry[1] === "boolean" ? entry[1].toString() : entry[1]);
			}
		}
	});

	Object.entries(data?.payment).forEach((entry: any) => {
		if (typeof entry[1] === "object" && entry[1]?.value) {
			formData.append(entry[0], entry[1]?.value);
		} else {
			if (!!entry[1]) {
				formData.append(entry[0], entry[1]);
			}
		}
	});

	return formData;
};
