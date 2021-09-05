import { useEffect, Suspense, lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsFetching } from "react-query";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { AdminLayout, BackTop, Container } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../context/AuthContext";

import { useLoadUser } from "../../actions/fetchHooks";

import {
	IconDashboard,
	IconUsers,
	IconRule,
	IconArrowUp,
	IconBadge,
	IconInventory,
	IconBriefcase,
	IconArchive,
	IconReceipt,
	IconSettings,
} from "../../components/ui/icons";
import SidebarContent from "./SidebarContent";
import TopbarContent from "./TopbarContent";
import FooterContent from "./FooterContent";
import { PagesOptionsType } from "../../types/global.types";

//ADMIN PAGES
const UsersPage = lazy(() => import("../../pages/admin/Users/UsersPage"));
const PermissionsPage = lazy(() => import("../../pages/admin/Permissions/PermissionsPage"));
const RolesPage = lazy(() => import("../../pages/admin/Roles/RolesPage"));
const CompaniesPage = lazy(() => import("../../pages/admin/Companies/CompaniesPage"));
//COMMON PAGES
const DashboardPage = lazy(() => import("../../pages/common/Dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("../../pages/common/Products/ProductsPage"));
const OrdersPage = lazy(() => import("../../pages/common/Orders/OrdersPage"));
const ShippingPlansPage = lazy(() => import("../../pages/common/ShippingPlans/ShippingPlansPage"));
const SettingsPage = lazy(() => import("../../pages/common/Settings/SettingsPage"));
//VIEW PAGES
const UsersViewPage = lazy(() => import("../../pages/admin/Users/UsersViewPage"));
const CompaniesViewPage = lazy(() => import("../../pages/admin/Companies/CompaniesViewPage"));
const ProductsViewPage = lazy(() => import("../../pages/common/Products/ProductsViewPage"));
const OrdersViewPage = lazy(() => import("../../pages/common/Orders/OrdersViewPage"));
const ShippingPlansViewPage = lazy(() => import("../../pages/common/ShippingPlans/ShippingPlansViewPage"));
// FALLBACK
const NotFoundPage = lazy(() => import("../../pages/common/NotFoundPage"));

const UserLayout = () => {
	const {
		tokenValue: { token },
		userValue: { user, setUser },
		userPermissionsValue: { userPermissions, setUserPermissions },
		userCan,
	} = useAuthContext();

	const { t } = useTranslation();
	const isFetching = useIsFetching();

	const { data } = useLoadUser({ specialKey: token });

	useEffect(() => {
		if (data) {
			const fetchedUser = data?.data?.user;
			const fetchedUserPermissions = data?.data?.permissions;

			setUser(fetchedUser);
			setUserPermissions(fetchedUserPermissions);
		}
	}, [data, setUser, setUserPermissions]);

	const pages: PagesOptionsType[] = useMemo(() => {
		return [
			{
				path: "/app/dashboard",
				component: DashboardPage,
				icon: <IconDashboard />,
				label: t("pages.dashboard"),
				permission: "routeDashboard",
			},
			{
				path: "/app/orders",
				component: OrdersPage,
				icon: <IconArchive />,
				label: t("pages.orders"),
				permission: "routeOrders",
			},
			{
				path: "/app/products",
				component: ProductsPage,
				icon: <IconInventory />,
				label: t("pages.products"),
				permission: "routeProducts",
			},
			{
				path: "/app/plans",
				component: ShippingPlansPage,
				icon: <IconReceipt />,
				label: t("pages.shippingPlans"),
				permission: "routeShippingPlans",
			},
			{
				path: "/app/users",
				component: UsersPage,
				icon: <IconUsers />,
				label: t("pages.users"),
				permission: "routeUsers",
			},
			{
				path: "/app/companies",
				component: CompaniesPage,
				icon: <IconBriefcase />,
				label: t("pages.companies"),
				permission: "routeCompanies",
			},
			{
				path: "/app/permissions",
				component: PermissionsPage,
				icon: <IconRule />,
				label: t("pages.permissions"),
				permission: "routePermissions",
			},
			{
				path: "/app/roles",
				component: RolesPage,
				icon: <IconBadge />,
				label: t("pages.roles"),
				permission: "routeRoles",
			},
			{
				path: "/app/settings",
				component: SettingsPage,
				icon: <IconSettings />,
				label: t("pages.settings"),
				permission: "routeSettings",
			},
			//VIEW PAGES
			{
				path: "/app/users/:id",
				component: UsersViewPage,
				permission: "userReadSingle",
			},
			{
				path: "/app/companies/:id",
				component: CompaniesViewPage,
				permission: "companyReadSingle",
			},
			{
				path: "/app/products/:id",
				component: ProductsViewPage,
				permission: "productReadSingle",
			},
			{
				path: "/app/orders/:id",
				component: OrdersViewPage,
				permission: ["orderReadSingle", "orderReadSingleTheir"],
			},
			{
				path: "/app/plans/:id",
				component: ShippingPlansViewPage,
				permission: "planReadSingle",
			},
		];
	}, [t]);

	return (
		<Router>
			{user && userPermissions && (
				<AdminLayout isLoading={!!isFetching}>
					<SidebarContent pages={pages} />
					<TopbarContent />
					<AdminLayout.Content>
						<Container className='px--3'>
							<Suspense fallback={<div />}>
								<Switch>
									{pages.map((page) => {
										if (userCan(page.permission)) {
											return (
												<Route
													key={page.path}
													path={page.path}
													exact={page?.exact ?? true}
													component={page.component}
												/>
											);
										}
										return null;
									})}
									{userCan("routeDashboard") ? <Redirect push to='/app/dashboard' /> : <Route component={NotFoundPage} />}
								</Switch>
							</Suspense>
						</Container>
					</AdminLayout.Content>
					<FooterContent />
				</AdminLayout>
			)}
			<BackTop>
				<IconArrowUp />
			</BackTop>
		</Router>
	);
};

export default UserLayout;
