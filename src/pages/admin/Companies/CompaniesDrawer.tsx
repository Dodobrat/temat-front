import { Drawer, Card, Heading } from "@dodobrat/react-ui-kit";

interface Props {
	onClose: () => void;
}

const CompaniesDrawer = (props: Props) => {
	const { onClose, ...rest } = props;

	return (
		<Drawer isOpen onClose={onClose} position='right' sizing='xl' animation='none' {...rest}>
			<Card elevation='none'>
				<Card.Body>
					<Heading as='h6' className='my--0'>
						Coming Soon!
					</Heading>
				</Card.Body>
			</Card>
		</Drawer>
	);
};

export default CompaniesDrawer;
