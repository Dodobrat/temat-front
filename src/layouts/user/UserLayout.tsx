import React, { useEffect, Suspense, lazy } from "react";
import {
	Button,
	AdminLayout,
	IconUsers,
	IconUser,
	IconLock,
	IconHamburger,
	BackTop,
	IconClock,
	Container,
	Text,
	Flex,
	Skeleton,
	useAdminLayout,
} from "@dodobrat/react-ui-kit";
import { useLoadUser } from "../../actions/fetchHooks";
import { useAuth } from "../../context/AuthContext";
import { useIsFetching } from "react-query";
import { BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch } from "react-router-dom";
import PageFooter from "../../components/ui/PageFooter";

const DashboardPage = lazy(() => import("../../pages/common/DashboardPage"));
const UsersPage = lazy(() => import("../../pages/admin/UsersPage"));

const appPages = [
	{
		path: "/app/dashboard",
		component: DashboardPage,
		icon: (
			<Text className='mb--0'>
				<IconClock className='dui__icon' />
			</Text>
		),
		label: <Text className='mb--0'>Dashboard</Text>,
	},
	{
		path: "/app/users",
		component: UsersPage,
		icon: (
			<Text className='mb--0'>
				<IconUsers className='dui__icon' />
			</Text>
		),
		label: <Text className='mb--0'>Users</Text>,
	},
];

const UserLayout = () => {
	const {
		tokenValue: { token },
		userValue: { user, setUser },
		userPermissionsValue: { setUserPermissions },
		logout,
	} = useAuth();

	const { toggleSidebar } = useAdminLayout();

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
			<AdminLayout isLoading={!!isFetching}>
				<AdminLayout.Sidebar>
					<AdminLayout.Sidebar.Item
						className='py--2'
						main={
							<Button onClick={toggleSidebar} flavor='round' pigment='default'>
								<IconHamburger className='dui__icon' />
							</Button>
						}
						extended={<Text className='mb--0'>Temat</Text>}
					/>
					<AdminLayout.Sidebar.Item
						as={Link}
						to={`/app/users/${user?.id}`}
						className='py--3'
						main={
							<Button flavor='round' pigment='secondary'>
								<IconUser className='dui__icon' />
							</Button>
						}
						extended={
							<div>
								<Text className='mb--0'>
									{user ? (
										<>
											{user?.firstName} {user?.lastName}
										</>
									) : (
										<Skeleton as='span' style={{ minWidth: "12rem" }} />
									)}
								</Text>
								<Text className='mb--0 text--secondary'>{user?.username ?? <Skeleton as='span' />}</Text>
							</div>
						}
					/>
					{appPages.map((page) => (
						<AdminLayout.Sidebar.Item
							as={NavLink}
							key={page.path}
							to={page.path}
							main={page.icon}
							extended={page.label}
							className='py--2'
						/>
					))}
				</AdminLayout.Sidebar>
				<AdminLayout.Topbar>
					<Container className='px--3 h--100'>
						<Flex wrap='nowrap' align='center' justify='flex-end' spacingY={null} spacingX={null} className='h--100'>
							<Flex.Col className='d--sm--none'>
								<Button flavor='round' pigment='default' onClick={toggleSidebar}>
									<IconHamburger className='dui__icon' />
								</Button>
							</Flex.Col>
							<Flex.Col col='auto'>
								<Flex spacingY={null} align='center' disableNegativeSpace>
									<Flex.Col as={Text} col='auto' className='mb--0'>
										{user?.username ?? <Skeleton as='span' />}
									</Flex.Col>
									<Flex.Col
										as={Button}
										col='auto'
										onClick={logout}
										flavor='round'
										pigment='default'
										hoverPigment='danger'>
										<IconLock className='dui__icon' />
									</Flex.Col>
								</Flex>
							</Flex.Col>
						</Flex>
					</Container>
				</AdminLayout.Topbar>
				<AdminLayout.Content>
					<Container className='px--3'>
						<Suspense fallback={<div />}>
							<Switch>
								{appPages.map((page) => (
									<Route key={page.path} path={page.path} exact component={page.component} />
								))}
								<Redirect to='/app/dashboard' />
							</Switch>
						</Suspense>
					</Container>
				</AdminLayout.Content>
				<AdminLayout.Footer className='mt--4'>
					<PageFooter />
				</AdminLayout.Footer>
			</AdminLayout>
			<BackTop />
		</Router>
	);
};

export default UserLayout;
