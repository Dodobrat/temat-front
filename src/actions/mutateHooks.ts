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

//INVOICES
export const useInvoiceAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/invoices`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useInvoiceUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/invoices/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useInvoiceDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/invoices/${data}`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

//PARTNERS
export const usePartnerAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/partners`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePartnerUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/partners/${specs?.id}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const usePartnerDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/partners/${data}`, config).then((res) => res.data);
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

export const useOrderDetailsUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/orders/${specs.orderId}/details`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useOrderFilesUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/orders/${specs.orderId}/files`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useOrderFinish = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async () => {
			return await axios.post(`${apiUrl}/orders/${specs.orderId}/pack`, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useOrderFileDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/orders/${data.orderId}/files/${data.fileKey}`, config).then((res) => res.data);
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

//SHIPPING PLANS
export const useShippingPlanAdd = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.post(`${apiUrl}/plans`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useShippingPlanUpdate = ({ specs, queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.patch(`${apiUrl}/plans/${specs.planId}`, data, config).then((res) => res.data);
		},
		{
			...queryConfig,
		}
	);
};

export const useShippingPlanDelete = ({ queryConfig }: MutateHookType) => {
	return useMutation(
		async (data: any) => {
			return await axios.delete(`${apiUrl}/plans/${data}`, config).then((res) => res.data);
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
