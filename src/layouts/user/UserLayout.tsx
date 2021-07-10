import { useEffect, Suspense, lazy, useMemo } from "react";
import { AdminLayout, BackTop, Container } from "@dodobrat/react-ui-kit";
import { IconDashboard, IconUsers, IconRule, IconArrowUp, IconBadge, IconInventory, IconBriefcase } from "../../components/ui/icons";
import { useLoadUser } from "../../actions/fetchHooks";
import { useAuth } from "../../context/AuthContext";
import { useIsFetching } from "react-query";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import SidebarContent from "./SidebarContent";
import TopbarContent from "./TopbarContent";
import FooterContent from "./FooterContent";
import { PagesOptionsType } from "../../types/global.types";
import { useTranslation } from "react-i18next";
import { IconSettings } from "@dodobrat/react-ui-kit";

//ADMIN PAGES
const UsersPage = lazy(() => import("../../pages/admin/Users/UsersPage"));
const PermissionsPage = lazy(() => import("../../pages/admin/Permissions/PermissionsPage"));
const RolesPage = lazy(() => import("../../pages/admin/Roles/RolesPage"));
const CompaniesPage = lazy(() => import("../../pages/admin/Companies/CompaniesPage"));
//COMMON PAGES
const DashboardPage = lazy(() => import("../../pages/common/Dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("../../pages/common/Products/ProductsPage"));
const SettingsPage = lazy(() => import("../../pages/common/Settings/SettingsPage"));
//VIEW PAGES
const CompaniesViewPage = lazy(() => import("../../pages/admin/Companies/CompaniesViewPage"));
const ProductsViewPage = lazy(() => import("../../pages/common/Products/ProductsViewPage"));
// FALLBACK
const NotFoundPage = lazy(() => import("../../pages/common/NotFoundPage"));

const UserLayout = () => {
	const {
		tokenValue: { token },
		userValue: { user, setUser },
		userPermissionsValue: { userPermissions, setUserPermissions },
		userCan,
	} = useAuth();

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
				path: "/app/users",
				component: UsersPage,
				icon: <IconUsers />,
				label: t("pages.users"),
				permission: "routeUsers",
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
				path: "/app/companies",
				component: CompaniesPage,
				icon: <IconBriefcase />,
				label: t("pages.companies"),
				permission: "routeCompanies",
			},
			{
				path: "/app/products",
				component: ProductsPage,
				icon: <IconInventory />,
				label: t("pages.products"),
				permission: "routeProducts",
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
				path: "/app/companies/:id",
				component: CompaniesViewPage,
				permission: "companyReadSingle",
			},
			{
				path: "/app/products/:id",
				component: ProductsViewPage,
				permission: "productReadSingle",
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
