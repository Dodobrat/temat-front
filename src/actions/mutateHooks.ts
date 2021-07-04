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
			return await axios.patch(`${apiUrl}/permissions/${data.id}`, data, config).then((res) => res.data);
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
			return await axios.patch(`${apiUrl}/users/roles${data.id}`, data, config).then((res) => res.data);
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
