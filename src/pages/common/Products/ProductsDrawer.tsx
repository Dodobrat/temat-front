import { Drawer, Card, Heading } from "@dodobrat/react-ui-kit";
import ComingSoon from "../../../components/ui/ComingSoon";

interface Props {
	onClose: () => void;
}

const ProductsDrawer = (props: Props) => {
	const { onClose, ...rest } = props;

	return (
		<Drawer isOpen onClose={onClose} position='right' sizing='xl' animation='none' {...rest}>
			<Card elevation='none'>
				<Card.Body>
					<Heading as='h6' className='my--0'>
						<ComingSoon compact elevation='none' />
					</Heading>
				</Card.Body>
			</Card>
		</Drawer>
	);
};

export default ProductsDrawer;
