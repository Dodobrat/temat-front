import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { parseParams } from "../helpers/urlHelpers";

type FetchQueryType = ({
	specs,
	queryConfig,
	specialKey,
}: {
	specs?: any;
	queryConfig?: any;
	specialKey?: any;
}) => UseQueryResult<any, unknown>;

const apiUrl = process.env.REACT_APP_API_URL;

export const useLoadUser: FetchQueryType = ({ queryConfig, specialKey }) => {
	return useQuery(
		["logged_user", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/users/profile`);
			return data;
		},
		{
			enabled: true,
			cacheTime: Infinity,
			staleTime: Infinity,
			...queryConfig,
		}
	);
};

//DASHBOARD
export const useOrderStatistics: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderStatistics", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/companies/stats/${specs?.companyId}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

//PERMISSIONS
export const usePermissions: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["permissions", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/permissions?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//ROLES
export const useRoles: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["roles", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/users/roles?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//INVOICES
export const useInvoices: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["invoices", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/invoices?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useInvoicePDF: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["invoicePDF", specialKey],
		async ({ queryKey }) => {
			const invoiceId = queryKey[1]?.id;
			const { data } = await axios.get(`${apiUrl}/invoices/${invoiceId}/pdf?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: false,
			...queryConfig,
		}
	);
};

//PARTNERS
export const usePartners: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["partners", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/partners?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//PRODUCTS
export const useProducts: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["products", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/products?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useProductById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["productById", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/products/${specs.param}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

//COMPANIES
export const useCompanies: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["companies", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/companies?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useCompanyById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["companyById", specialKey],
		async ({ queryKey }) => {
			const companyId = queryKey[1]?.id;
			const { data } = await axios.get(`${apiUrl}/companies/${companyId}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

//WAREHOUSES
export const useWarehouses: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["warehouses", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/warehouses?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//ORDERS
export const useOrders: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orders", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/orders?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useOrderLocate: FetchQueryType = ({ queryConfig, specialKey }) => {
	return useQuery(
		["locatedOrder", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.orderId;
			if (orderId === "") return;
			const { data } = await axios.get(`${apiUrl}/orders/pack/${orderId}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

export const useOrderById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderById", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.orderId;
			const { data } = await axios.get(`${apiUrl}/orders/${orderId}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

export const useOrderHistoryById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderHistoryById", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.order?.details?.id;
			if (!orderId) return;
			const { data } = await axios.get(`${apiUrl}/orders/${orderId}/history?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useOrderCourierHistoryById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderCourierHistoryById", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.order?.details?.id;
			if (!orderId) return;
			const { data } = await axios.get(`${apiUrl}/orders/${orderId}/courier/history?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useOrderLabelDownloadById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderLabelDownloadById", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.orderId;
			const { data } = await axios.get(`${apiUrl}/deliveries/label/${orderId}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: false,
			...queryConfig,
		}
	);
};

export const useOrderFileDownloadById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderFileDownloadById", specialKey],
		async ({ queryKey }) => {
			const orderId = queryKey[1]?.orderId;
			const fileKey = queryKey[1]?.fileKey;
			const { data } = await axios.get(`${apiUrl}/orders/${orderId}/files/${fileKey}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: false,
			...queryConfig,
		}
	);
};

//SHIPPING PLANS
export const useShippingPlans: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["shippingPlans", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/plans?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useShippingPlanById: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["shippingPlanById", specialKey],
		async ({ queryKey }) => {
			const planId = queryKey[1]?.planId;
			const { data } = await axios.get(`${apiUrl}/plans/${planId}?${parseParams(specs)}`);
			return data;
		},
		{
			enabled: true,
			...queryConfig,
		}
	);
};

//DELIVERIES
export const useDeliveryMethods: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["deliveryMethods", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/deliveries/methods?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useDeliveryOffices: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["deliveryOffices", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/deliveries/${specs?.courier}/office?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useDeliveryCountries: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["deliveryCountries", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/deliveries/${specs?.courier}/country?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useDeliveryCities: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["deliveryCities", specialKey],
		async () => {
			specs.filters.countryId = specs?.countryId;
			const { data } = await axios.get(`${apiUrl}/deliveries/${specs?.courier}/city?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

export const useDeliveryStreets: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["deliveryStreetName", specialKey],
		async () => {
			specs.filters.cityId = specs?.cityId;
			const { data } = await axios.get(`${apiUrl}/deliveries/${specs?.courier}/street?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//USERS
export const useUsers: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["users", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/users?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

// -----------------------------------
// HELPERS
// -----------------------------------

//CURRENCY
export const useCurrency: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["currency", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/currency?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//PAYMENT METHODS
export const usePaymentMethods: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["paymentMethods", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/paymentMethods?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//PAYMENT METHODS
export const usePhoneCodes: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["phoneCodes", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/phoneCode?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//SHIPPING PAID BY
export const useShippingPaidBy: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["shipmentPayee", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/deliveryPayee?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//SHIPPING PAID BY
export const usePayAfter: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["payAfter", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/payAfter?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//TAX GROUPS
export const useTaxGroup: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["taxGroups", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/taxGroup?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//ORDER STATUS
export const useOrderStatus: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["orderStatus", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/orderStatus?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//DOCUMENT TYPE
export const useDocumentTypes: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["documentTypes", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/documentType?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};

//DOCUMENT TYPE
export const useConfirmMethod: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["confirmMethods", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/helpers/confirmMethod?${parseParams(specs)}`);
			return data;
		},
		{
			keepPreviousData: true,
			enabled: false,
			...queryConfig,
		}
	);
};
