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

export const useLogin = ({ specs, queryConfig }: MutateHookType) => {
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
export const usePermissionAdd = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/permissions`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePermissionUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/permissions/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePermissionDelete = ({ specs, queryConfig }: MutateHookType) => {
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
export const useRoleAdd = ({ specs, queryConfig }: MutateHookType) => {
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

export const useRoleDelete = ({ specs, queryConfig }: MutateHookType) => {
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
export const useCompanyAdd = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/companies`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useCompanyUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/companies/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useCompanyDelete = ({ specs, queryConfig }: MutateHookType) => {
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
export const useProductAdd = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/products`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useProductUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/products/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useProductDelete = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/products/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//USERS
export const useUserAdd = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/users`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserPersonalUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/users/personal/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserCredentialsUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/users/credentials/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useUserDelete = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/users/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};
