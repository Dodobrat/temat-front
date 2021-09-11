import { parseToISODate } from "../../../helpers/dateHelpers";

export const parseShippingDataToFormData = (data, formData) => {
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

export const parseProductsToFormData = (data, formData) => {
	data.forEach((product: { value: string; quantity: string; price: string }, idx: number) => {
		formData.append(`products[${idx}][id]`, product.value);
		formData.append(`products[${idx}][qty]`, product.quantity);
		formData.append(`products[${idx}][price]`, product.price);
	});
};

export const parseExtrasToFormData = (data, formData) => {
	data?.files?.forEach((file: string | Blob | File) => {
		if (file instanceof File) {
			formData.append("files", file, file.name);
		}
	});

	if (!!data?.customerNote) {
		formData.append("customerNote", data?.customerNote);
	}
};

export const parsePaymentToFormData = (data, formData) => {
	Object.entries(data).forEach((entry: any) => {
		if (typeof entry[1] === "object" && entry[1]?.value) {
			formData.append(entry[0], entry[1]?.value);
		} else {
			if (!!entry[1]) {
				formData.append(entry[0], entry[1]);
			}
		}
	});
};

export const parseOrderAddData = (data) => {
	const formData = new FormData();

	parseProductsToFormData(data.products, formData);
	parseExtrasToFormData(data.extras, formData);
	parseShippingDataToFormData(data.shipping, formData);
	parseShippingDataToFormData(data.receiver, formData);
	parsePaymentToFormData(data.payment, formData);

	return formData;
};

export const parsedFetchedData = (order) => {
	const parsedOrderData: any = {
		orderId: null,
		payment: {},
		shipping: {},
		receiver: {},
		products: [],
		extras: {},
	};

	//OrderID
	parsedOrderData.orderId = order?.details?.id;

	//Payment
	parsedOrderData.payment.companyId = order?.details?.companyId;
	parsedOrderData.payment.paymentMethodId = {
		value: order?.payment?.paymentMethodId,
		label: order?.payment?.paymentMethodName,
	};
	parsedOrderData.payment.currencyId = {
		value: order?.payment?.currencyId,
		label: `${order?.payment?.abbreviation} - ${order?.payment?.symbol}`,
	};
	parsedOrderData.payment.shipmentPayeeId = {
		value: order?.payment?.shipmentPayeeId,
		label: order?.payment?.shipmentPayeeName,
	};
	parsedOrderData.payment.payAfterId = {
		value: order?.payment?.payAfterId,
		label: order?.payment?.payAfterName,
	};

	//Shipping
	parsedOrderData.shipping.shipDate = new Date(order?.details?.shipDate);
	parsedOrderData.shipping.shippingMethodId = {
		value: order?.payment?.shippingMethodId,
		label: order?.payment?.shippingMethodName,
		data: {
			courierName: order?.address?.courierName,
			deliveryType: order?.address?.deliveryType,
		},
	};
	parsedOrderData.shipping.city = order?.address?.cityId
		? {
				value: order?.address?.cityId,
				label: order?.address?.city,
		  }
		: null;
	parsedOrderData.shipping.country = order?.address?.countryId
		? {
				value: order?.address?.countryId,
				label: order?.address?.country,
		  }
		: null;
	parsedOrderData.shipping.streetName = order?.address?.streetId
		? {
				value: order?.address?.streetId,
				label: order?.address?.streetName,
		  }
		: null;
	parsedOrderData.shipping.streetNumber = order?.address?.streetNumber;
	parsedOrderData.shipping.zipCode = order?.address?.zipCode;
	parsedOrderData.shipping.officeId = order?.address?.officeId
		? {
				value: order?.address?.officeId,
				label: order?.address?.officeName,
		  }
		: null;

	//Receiver
	parsedOrderData.receiver.email = order?.client?.email;
	parsedOrderData.receiver.receiverIsCompany = order?.client?.receiverIsCompany > 0;

	parsedOrderData.receiver.receiverName = order?.client?.receiverName;
	parsedOrderData.receiver.receiverPhone = order?.client?.receiverPhone;
	parsedOrderData.receiver.receiverPhoneCodeIdHint = order?.client?.receiverPhoneCode;

	parsedOrderData.receiver.receiverAgentName = order?.client?.receiverAgentName;
	parsedOrderData.receiver.receiverAgentPhone = order?.client?.receiverAgentPhone;
	parsedOrderData.receiver.receiverAgentPhoneCodeIdHint = order?.client?.receiverAgentPhoneCode;

	//Products
	const productsWithIds = [];
	for (const product of order?.products) {
		productsWithIds.push({
			...product,
			value: product?.productId,
			quantity: product?.required,
			price: product?.price,
		});
	}
	parsedOrderData.products = productsWithIds;

	//Extras
	parsedOrderData.extras.files = order?.files;
	parsedOrderData.extras.customerNote = order?.details?.customerNote;

	console.log(parsedOrderData);

	return parsedOrderData;
};
