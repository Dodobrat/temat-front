import { useAdminLayout } from "@dodobrat/react-ui-kit";
import { AdminLayout, Button, Text, Skeleton } from "@dodobrat/react-ui-kit";
import { IconUserCircle, IconMenu, IconHamburger } from "../../components/ui/icons/index";
import { forwardRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PagesOptionsType } from "../../types/global.types";

interface Props {
	pages: PagesOptionsType[];
}

const SidebarContent = forwardRef(({ pages = [] }: Props, ref) => {
	const {
		userValue: { user },
		userPermissionsValue: { userPermissions },
	} = useAuth();

	const {
		toggleSidebar,
		sidebarValue: { sidebarState },
	} = useAdminLayout();

	return (
		<AdminLayout.Sidebar ref={ref}>
			<AdminLayout.Sidebar.Item
				className='py--2'
				main={
					<Button onClick={toggleSidebar} flavor='rounded' equalDimensions pigment='default'>
						{sidebarState ? <IconMenu /> : <IconHamburger />}
					</Button>
				}
				extended={<Text className='mb--0'>Temat</Text>}
			/>
			<AdminLayout.Sidebar.Item
				as={Link}
				to={`/app/users/${user?.id}`}
				className='py--3'
				main={
					<Button flavor='rounded' equalDimensions pigment='secondary'>
						<IconUserCircle />
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
			{pages.map((page) => {
				if (userPermissions?.some((permission) => permission.name === page.permission)) {
					return (
						<AdminLayout.Sidebar.Item
							as={NavLink}
							key={page.path}
							to={page.path}
							main={<Text className='mb--0'>{page.icon}</Text>}
							extended={<Text className='mb--0'>{page.label}</Text>}
							className='py--2'
						/>
					);
				}
				return null;
			})}
		</AdminLayout.Sidebar>
	);
});

SidebarContent.displayName = "AdminLayoutSidebar";

export default SidebarContent;
