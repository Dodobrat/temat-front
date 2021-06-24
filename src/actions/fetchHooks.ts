import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";

// const day = Number(1000 * 60 * 60 * 24);

type FetchQueryType = ({
	specs,
	queryConfig,
	specialKey,
}: {
	specs?: any;
	queryConfig?: any;
	specialKey: any;
}) => UseQueryResult<any, unknown>;

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
