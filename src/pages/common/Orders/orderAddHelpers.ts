import { parseToISODate } from "../../../helpers/dateHelpers";

const parseShippingDataToFormData = (data, formData) => {
	Object.entries(data).forEach((entry: any) => {
		if (entry[1] instanceof Date) {
			formData.append(entry[0], parseToISODate(entry[1]));
		}
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
				const shippingCourier = data?.shippingMethodId?.data?.courierName;
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
};

export const parseOrderAddData = (data) => {
	const formData = new FormData();

	data.products.forEach((product: { value: string; quantity: string; price: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
		formData.append(`products[${idx}][price]`, product.price);
	});

	data.extras?.files?.forEach((file: string | Blob | File | any) => {
		formData.append("files", file);
	});

	if (!!data?.extras?.customerNote) {
		formData.append("customerNote", data?.extras?.customerNote);
	}

	parseShippingDataToFormData(data.shipping, formData);
	parseShippingDataToFormData(data.receiver, formData);

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
