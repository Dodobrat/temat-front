export type PagesOptionsType = {
	path: string;
	component: React.LazyExoticComponent<() => JSX.Element>;
	icon?: React.ReactNode;
	label?: string;
	permission: string | null;
	exact?: boolean;
	subPages?: PagesOptionsType[];
};

export type ResponseColumnType = {
	accessor: string;
	title: string;
	canSort: boolean;
	type?: string;
	id?: string;
};
