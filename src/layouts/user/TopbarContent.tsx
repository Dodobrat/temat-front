import { useAdminLayout, AdminLayout, Button, Text, Flex, Container, Skeleton } from "@dodobrat/react-ui-kit";

import { useAuthContext } from "../../context/AuthContext";

import { IconHamburger, IconLogout } from "../../components/ui/icons";

const TopbarContent = () => {
	const {
		userValue: { user },
		logout,
	} = useAuthContext();

	const { toggleSidebar } = useAdminLayout();

	return (
		<AdminLayout.Topbar>
			<Container className='px--3 h--100'>
				<Flex wrap='nowrap' align='center' justify='flex-end' spacingY={null} spacingX={null} className='h--100'>
					<Flex.Col className='d--sm--none'>
						<Button flavor='rounded' equalDimensions pigment='default' onClick={toggleSidebar}>
							<IconHamburger />
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
								flavor='rounded'
								equalDimensions
								pigment='default'
								hoverPigment='danger'>
								<IconLogout />
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
