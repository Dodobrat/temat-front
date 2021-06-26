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

export const useLoadUser: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["logged_user", specialKey],
		async () => {
			const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
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

export const usePermissions: FetchQueryType = ({ specs, queryConfig, specialKey }) => {
	return useQuery(
		["permissions", specialKey],
		async () => {
			const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/permissions?${parseParams(specs)}`);
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
