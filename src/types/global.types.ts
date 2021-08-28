import React from "react";

export type PagesOptionsType = {
	path: string;
	component: React.LazyExoticComponent<() => JSX.Element> | any;
	icon?: React.ReactNode;
	label?: string;
	permission: string | Array<string>;
	exact?: boolean;
	subPages?: PagesOptionsType[];
};

export type ResponseColumnType = {
	accessor: string;
	title: string;
	canSort: boolean;
	type?: string;
	id?: string;
	[key: string]: any;
};

export type useDataTableGenerateReturnType = {
	tableProps: {
		columns: any | any[];
		data: any | any[];
		fetchData: ({ pageSize, pageIndex, sortBy }: any) => void;
		loading: boolean;
		actions: any | any[];
		serverPageCount: any | number;
		serverTotalResults: any | number;
	};
	state: {
		queryParams: {
			sortBy: any[];
			filters: {
				page: number;
				perPage: number;
				searchString: string;
			};
		};
		setQueryParams: React.Dispatch<
			React.SetStateAction<{
				sortBy: any[];
				filters: {
					page: number;
					perPage: number;
					searchString: string;
				};
			}>
		>;
	};
	query: {
		data: any | any[];
		refetch: any;
		isFetching: boolean;
		isStale: boolean;
	};
};

export type DataTableAction = {
	permission: string | string[];
	type: string;
	withConfirmation?: boolean;
	action?: (entry: any) => void;
	props?: (entry: any) => any;
};

export type DataTableColumnType = {
	type: string;
	action: (entry: any) => void;
};

export type useDataTableGenerateType = ({
	useFetch,
	columns,
	actions,
}: {
	useFetch: any;
	columns?: DataTableColumnType[];
	actions?: DataTableAction[];
}) => useDataTableGenerateReturnType;
