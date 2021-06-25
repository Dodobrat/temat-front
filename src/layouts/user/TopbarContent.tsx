import React from "react";
import { useAdminLayout } from "@dodobrat/react-ui-kit";
import { AdminLayout, Button, IconHamburger, Text, Flex, Container, IconLock, Skeleton } from "@dodobrat/react-ui-kit";
import { useAuth } from "../../context/AuthContext";

const TopbarContent = () => {
	const {
		userValue: { user },
		logout,
	} = useAuth();

	const { toggleSidebar } = useAdminLayout();

	return (
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
							<Flex.Col as={Button} col='auto' onClick={logout} flavor='round' pigment='default' hoverPigment='danger'>
								<IconLock className='dui__icon' />
							</Flex.Col>
						</Flex>
					</Flex.Col>
				</Flex>
			</Container>
		</AdminLayout.Topbar>
	);
};

TopbarContent.displayName = "AdminLayoutTopbar";

export default TopbarContent;
