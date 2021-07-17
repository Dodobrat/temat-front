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

export const useLoadUser: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
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
