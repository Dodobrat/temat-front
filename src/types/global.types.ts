export type PagesOptionsType = {
	path: string;
	component: React.LazyExoticComponent<() => JSX.Element>;
	icon: React.ReactNode;
	label: string;
	permission: string | null;
};
