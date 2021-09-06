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

const halfDay = 1000 * 60 * 60 * 12;

const apiUrl = process.env.REACT_APP_API_URL;

export const useLoadUser: FetchQueryType = ({ queryConfig, specialKey }) => {
	return useQuery(
		["logged_user", specialKey],
		async () => {
			const { data } = await axios.get(`${apiUrl}/users/profile`);
			return data;
		},
		{
			...queryConfig,
			enabled: queryConfig?.enabled ?? true,
			cacheTime: Infinity,
			staleTime: Infinity,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? true,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? true,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? true,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			enabled: queryConfig?.enabled ?? true,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
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
			...queryConfig,
			keepPreviousData: true,
			enabled: queryConfig?.enabled ?? false,
			cacheTime: halfDay,
			staleTime: halfDay,
		}
	);
};
