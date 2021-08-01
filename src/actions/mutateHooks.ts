import axios from "axios";
import { useMutation } from "react-query";
const config = {
	headers: {
		"Content-Type": "application/json",
	},
};

type MutateHookType = {
	specs?: any;
	queryConfig: any;
};

const apiUrl = process.env.REACT_APP_API_URL;

export const useLogin = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/users/login`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

// PERMISSIONS
export const usePermissionAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/permissions`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePermissionUpdate = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/permissions/${data?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePermissionDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/permissions/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//ROLES
export const useRoleAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/users/roles`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useRoleUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/users/roles/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useRoleDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/users/roles/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//COMPANIES
export const useCompanyAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/companies`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useCompanyUpdate = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/companies/${data?.id}`, data?.formData, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useCompanyDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/companies/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//PRODUCTS
export const useProductAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/products`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useProductUpdate = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/products/${data?.id}`, data?.formData, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useProductDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/products/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//ORDERS
export const useOrderAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/orders`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useOrderProductUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/orders/${specs.orderId}/products`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useOrderDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/orders/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//USERS
export const useUserAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/users`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserPersonalUpdate = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/users/personal/${data?.id}`, data?.formData, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserCredentialsUpdate = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/users/credentials/${data?.id}`, data?.formData, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/users/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};
