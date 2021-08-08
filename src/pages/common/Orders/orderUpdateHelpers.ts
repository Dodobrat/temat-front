import { paidByOptions, payAfterOptions } from "./order_steps/OrderStepPayment";

export const parsedFetchedData = (order) => {
	const parsedOrderData: any = { orderId: null, products: [], shipping: {}, payment: {}, files: [] };

	//OrderID
	parsedOrderData.orderId = order?.details?.id;

	//Products
	const productsWithIds = [];
	for (const product of order?.products) {
		productsWithIds.push({ ...product, value: product?.productId, quantity: product?.required });
	}
	parsedOrderData.products = productsWithIds;

	//Files
	parsedOrderData.files = order?.files;

	//Shipping

	parsedOrderData.shipping.shipDate = new Date(order?.details?.shipDate);
	parsedOrderData.shipping.shippingMethodId = { value: order?.payment?.shippingMethodId, label: order?.payment?.shippingMethodName };
	parsedOrderData.shipping.city = { value: order?.address?.cityId, label: order?.address?.city };
	parsedOrderData.shipping.country = { value: order?.address?.countryId, label: order?.address?.country };
	parsedOrderData.shipping.streetName = { value: order?.address?.streetId, label: order?.address?.streetName };
	parsedOrderData.shipping.streetNumber = order?.address?.streetNumber;
	parsedOrderData.shipping.zipCode = order?.address?.zipCode;

	parsedOrderData.shipping.officeId = { value: order?.address?.officeId, label: order?.address?.officeName };

	parsedOrderData.shipping.email = order?.client?.email;
	parsedOrderData.shipping.receiverAgentName = order?.client?.receiverAgentName;
	parsedOrderData.shipping.receiverAgentPhoneCodeId = {
		value: order?.client?.receiverAgentPhoneCodeId,
		label: order?.client?.receiverAgentPhoneCode,
	};
	parsedOrderData.shipping.receiverAgentPhone = order?.client?.receiverAgentPhone;
	parsedOrderData.shipping.receiverName = order?.client?.receiverName;
	parsedOrderData.shipping.receiverPhoneCodeId = {
		value: order?.client?.receiverPhoneCodeId,
		label: order?.client?.receiverPhoneCode,
	};
	parsedOrderData.shipping.receiverPhone = order?.client?.receiverPhone;

	parsedOrderData.shipping.receiverIsCompany = order?.client?.receiverIsCompany > 0;

	//Payment
	parsedOrderData.payment.companyId = order?.details?.companyId;
	parsedOrderData.payment.totalAmount = order?.payment?.totalAmount;
	parsedOrderData.payment.paymentMethodId = {
		value: order?.payment?.paymentMethodId,
		label: order?.payment?.paymentMethodName,
	};
	parsedOrderData.payment.currencyId = {
		value: order?.payment?.currencyId,
		label: `${order?.payment?.abbreviation} - ${order?.payment?.symbol}`,
	};
	parsedOrderData.payment.shippingPaidBy = paidByOptions.find((item) => item.value === order?.payment?.shippingPaidBy);
	parsedOrderData.payment.payAfter = payAfterOptions.find((item) => item.value === order?.payment?.payAfter);

	return parsedOrderData;
};

export const parseProductsToFormData = (data) => {
	const formData = new FormData();

	data.products.forEach((product: { value: string; quantity: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
	});

	return formData;
};

export const parseFilesToFormData = (data) => {
	const formData = new FormData();

	data.files.forEach((file: string | Blob | File | any) => {
		if (file instanceof File) {
			formData.append("files", file);
		}
	});

	return formData;
};

export const parseDetailsToFormData = (data) => {
	const formData = new FormData();

	Object.entries(data.shipping).forEach((entry: any) => {
		if (entry[1] instanceof Date) {
			formData.append(entry[0], entry[1]?.toISOString().slice(0, 10));
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
				formData.append(`${office}Id`, entry[1]?.value);
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
