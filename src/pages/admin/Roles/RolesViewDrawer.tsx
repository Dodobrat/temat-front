import { Drawer, Card, Button, Text, Flex, Badge } from "@dodobrat/react-ui-kit";
import { IconClose } from "../../../components/ui/icons/index";
import cn from "classnames";
import { parseDate } from "../../../helpers/dateHelpers";

interface Props {
	onClose: () => void;
	[key: string]: any;
}

const viewKeyProps = {
	col: { base: "12", sm: "3" },
	className: "d--flex justify--flex-end",
};
const viewValueProps = {
	col: { base: "12", sm: "9" },
};

const RolesViewDrawer = (props: Props) => {
	const { onClose, payload, ...rest } = props;

	return (
		<Drawer isOpen onClose={onClose} position='right' sizing='xl' animation='none' {...rest}>
			<Card elevation='none'>
				<Card.Header
					actions={
						<Button equalDimensions pigment='default' onClick={onClose}>
							<IconClose />
						</Button>
					}>
					<Text className='mb--0'>Role</Text>
				</Card.Header>
				<Card.Body>
					<Flex spacingY={{ base: "sm", sm: "lg" }}>
						<Flex.Col {...viewKeyProps}>
							<Badge pigment='secondary'>Name</Badge>
						</Flex.Col>
						<Flex.Col {...viewValueProps}>
							<Text className='mb--0 ellipsis'>{payload?.name}</Text>
						</Flex.Col>
						{console.log(payload)}
					</Flex>
				</Card.Body>
			</Card>
		</Drawer>
	);
};

export default RolesViewDrawer;
