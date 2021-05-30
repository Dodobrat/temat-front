import axios from "axios";
import { useMutation } from "react-query";

const config = {
	headers: {
		"Content-Type": "application/json",
	},
};

export const useLogin = ({ specs, queryConfig }: { specs?: any; queryConfig: any }) => {
	return useMutation(
		async (data) => {
			return await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};
