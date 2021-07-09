import { useEffect, Suspense, lazy } from "react";
import { AdminLayout, BackTop, Container } from "@dodobrat/react-ui-kit";
import { IconDashboard, IconUsers, IconRule, IconArrowUp, IconBadge, IconInventory } from "../../components/ui/icons";
import { useLoadUser } from "../../actions/fetchHooks";
import { useAuth } from "../../context/AuthContext";
import { useIsFetching } from "react-query";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import SidebarContent from "./SidebarContent";
import TopbarContent from "./TopbarContent";
import FooterContent from "./FooterContent";
import { PagesOptionsType } from "../../types/global.types";
import React from "react";

//ADMIN PAGES
const UsersPage = lazy(() => import("../../pages/admin/Users/UsersPage"));
const PermissionsPage = lazy(() => import("../../pages/admin/Permissions/PermissionsPage"));
const RolesPage = lazy(() => import("../../pages/admin/Roles/RolesPage"));
//COMMON PAGES
const DashboardPage = lazy(() => import("../../pages/common/Dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("../../pages/common/Products/ProductsPage"));
const ProductsViewPage = lazy(() => import("../../pages/common/Products/ProductsViewPage"));
// FALLBACK
const NotFoundPage = lazy(() => import("../../pages/common/NotFoundPage"));

const pages: PagesOptionsType[] = [
	{
		path: "/app/dashboard",
		component: DashboardPage,
		icon: <IconDashboard />,
		label: "Dashboard",
		permission: "routeDashboard",
	},
	{
		path: "/app/users",
		component: UsersPage,
		icon: <IconUsers />,
		label: "Users",
		permission: "routeUsers",
	},
	{
		path: "/app/permissions",
		component: PermissionsPage,
		icon: <IconRule />,
		label: "Permissions",
		permission: "routePermissions",
	},
	{
		path: "/app/roles",
		component: RolesPage,
		icon: <IconBadge />,
		label: "Roles",
		permission: "routeRoles",
	},
	{
		path: "/app/products",
		component: ProductsPage,
		icon: <IconInventory />,
		label: "Products",
		permission: "routeProducts",
	},
	{
		path: "/app/products/:id",
		component: ProductsViewPage,
		permission: "productReadSingle",
	},
];

const UserLayout = () => {
	const {
		tokenValue: { token },
		userValue: { user, setUser },
		userPermissionsValue: { userPermissions, setUserPermissions },
		userCan,
	} = useAuth();

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
