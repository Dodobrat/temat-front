export const parseCompanyDetails = (data) => {
	const parsedDetails: any = {};

	parsedDetails.molFirstName = data?.molFirstName ?? "";
	parsedDetails.molLastName = data?.molLastName ?? "";
	parsedDetails.email = data?.email ?? "";
	parsedDetails.phone = data?.phone ?? "";
	parsedDetails.country = data?.country ?? "";
	parsedDetails.city = data?.city ?? "";
	parsedDetails.zipCode = data?.zipCode ?? "";
	parsedDetails.streetName = data?.streetName ?? "";
	parsedDetails.streetNumber = data?.streetNumber ?? "";

	parsedDetails.bankName = data?.bankName ?? "";
	parsedDetails.bankBic = data?.bankBic ?? "";
	parsedDetails.bankIBAN = data?.bankIBAN ?? "";

	parsedDetails.invoiceIdentityNumber = data?.invoiceIdentityNumber ?? "";
	parsedDetails.taxGroupId = data?.taxGroupId
		? {
				value: data?.taxGroupId,
				label: data?.tagGroupName,
		  }
		: null;
	parsedDetails.payAfterId = data?.payAfterId
		? {
				value: data?.payAfterId,
				label: data?.payAfterName,
		  }
		: null;
	parsedDetails.shipmentPayeeId = data?.shipmentPayeeId
		? {
				value: data?.shipmentPayeeId,
				label: data?.shipmentPayeeName,
		  }
		: null;
	parsedDetails.defaultOrderStatusId = data?.defaultOrderStatusId
		? {
				value: data?.defaultOrderStatusId,
				label: data?.defaultOrderStatusName,
		  }
		: null;
	parsedDetails.confirmMethodId = data?.confirmMethodId
		? {
				value: data?.confirmMethodId,
				label: data?.confirmMethodName,
		  }
		: null;
	parsedDetails.defaultDocumentTypeId = data?.defaultDocumentTypeId
		? {
				value: data?.defaultDocumentTypeId,
				label: data?.defaultDocumentTypeName,
		  }
		: null;

	return parsedDetails;
};
