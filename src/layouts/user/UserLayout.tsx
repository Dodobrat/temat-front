import React, { useEffect, Suspense, lazy } from "react";
import { AdminLayout, IconUsers, BackTop, IconClock, Container } from "@dodobrat/react-ui-kit";
import { useLoadUser } from "../../actions/fetchHooks";
import { useAuth } from "../../context/AuthContext";
import { useIsFetching } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SidebarContent from "./SidebarContent";
import TopbarContent from "./TopbarContent";
import FooterContent from "./FooterContent";
import { PagesOptionsType } from "../../types/global.types";

const DashboardPage = lazy(() => import("../../pages/common/DashboardPage"));
const UsersPage = lazy(() => import("../../pages/admin/UsersPage"));
const PermissionsPage = lazy(() => import("../../pages/admin/PermissionsPage"));
// FALLBACK
const NotFoundPage = lazy(() => import("../../pages/common/NotFoundPage"));

const pages: PagesOptionsType[] = [
	{
		path: "/app/dashboard",
		component: DashboardPage,
		icon: <IconClock className='dui__icon' />,
		label: "Dashboard",
		permission: "routeDashboard",
	},
	{
		path: "/app/users",
		component: UsersPage,
		icon: <IconUsers className='dui__icon' />,
		label: "Users",
		permission: "routeUsers",
	},
	{
		path: "/app/permissions",
		component: PermissionsPage,
		icon: <IconUsers className='dui__icon' />,
		label: "Permissions",
		permission: "routePermissions",
	},
];

const UserLayout = () => {
	const {
		tokenValue: { token },
		userValue: { user, setUser },
		userPermissionsValue: { userPermissions, setUserPermissions },
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
										if (userPermissions.some((permission) => permission.name === page.permission)) {
											return <Route key={page.path} path={page.path} exact component={page.component} />;
										}
										return null;
									})}
									<Route component={NotFoundPage} />
								</Switch>
							</Suspense>
						</Container>
					</AdminLayout.Content>
					<FooterContent />
				</AdminLayout>
			)}
			<BackTop />
		</Router>
	);
};

export default UserLayout;
