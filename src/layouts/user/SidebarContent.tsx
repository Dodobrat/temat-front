import { forwardRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAdminLayout, AdminLayout, Button, Text, Skeleton } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../context/AuthContext";

import { IconUserCircle, IconMenu, IconHamburger } from "../../components/ui/icons";
import { PagesOptionsType } from "../../types/global.types";
import Image from "../../components/ui/Image";

interface Props {
	pages: PagesOptionsType[];
}

const SidebarContent = forwardRef(({ pages = [] }: Props, ref) => {
	const {
		userValue: { user },
		userCan,
	} = useAuthContext();

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
				extended={<Text className='mb--0'>{process.env.REACT_APP_NAME}</Text>}
			/>
			<AdminLayout.Sidebar.Item
				as={Link}
				to={`/app/users/${user?.id}`}
				className='py--3'
				main={
					user?.image ? (
						<div
							style={{
								width: "2rem",
								height: "2rem",
							}}>
							<Image imgSrc={user?.image} alt={user?.username} />
						</div>
					) : (
						<Button equalDimensions pigment='secondary'>
							<IconUserCircle className='dui__icons' />
						</Button>
					)
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
				if (userCan(page.permission) && (page.icon || page.label)) {
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
