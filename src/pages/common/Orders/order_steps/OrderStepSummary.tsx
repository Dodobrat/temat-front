import { useTranslation } from "react-i18next";
import { useOrdersContext } from "../../../../context/OrdersContext";
import { Heading } from "@dodobrat/react-ui-kit";
import { IconEdit } from "../../../../components/ui/icons";
import { Flex } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import Image from "../../../../components/ui/Image";
import { ListGroup } from "@dodobrat/react-ui-kit";

const EmptyEntry = () => (
	<Heading as='p' centered className='my--3'>
		No Data!
	</Heading>
);

const ProductsDetails = ({ item, ...rest }) => {
	if (item[1].length === 0) return <EmptyEntry />;
	return (
		<ListGroup elevation='none'>
			{item[1].map((entry) => (
				<ListGroup.Item key={entry.value}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col className='temat__table__img'>
							<Image imgSrc={entry?.data?.image} alt={entry?.data?.description ?? entry?.label} />
						</Flex.Col>
						<Flex.Col>{entry?.label}</Flex.Col>
						<Flex.Col col='auto'>Qty. {entry?.quantity}</Flex.Col>
					</Flex>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
};

const ShippingDetails = ({ item, ...rest }) => {
	const values = Object.values(item[1]);

	if (values.length === 0) return <EmptyEntry />;

	return <div {...rest}></div>;
};

const PaymentDetails = ({ item, ...rest }) => {
	const { t } = useTranslation();
	const values = Object.values(item[1]);

	if (values.length === 0) return <EmptyEntry />;

	return (
		<ListGroup elevation='none'>
			{Object.entries(item[1]).map((entry: any) => (
				<ListGroup.Item key={entry[0]}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col>{t(`orders.${entry[0]}`)}</Flex.Col>
						<Flex.Col col='auto'>{entry[1]?.label ?? entry[1]}</Flex.Col>
					</Flex>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
};

const OrderStepSummary = () => {
	const { t } = useTranslation();

	const {
		stepValue: { setCurrStep },
		panelsValue: { toggledSummaryPanels, setToggledSummaryPanels },
		dataValue: { data },
	} = useOrdersContext();

	return (
		<ListGroup elevation={null} className='mt--2 outline'>
			{Object.entries(data).map((item, idx) => (
				<ListGroup.Collapse
					key={item[0]}
					isCollapsed={toggledSummaryPanels[item[0]]}
					onToggle={(collapsed) => setToggledSummaryPanels((prev) => ({ ...prev, [item[0]]: !collapsed }))}>
					<ListGroup.Collapse.Toggle>
						<Flex wrap='nowrap' align='center' spacingX={null} spacingY={null}>
							<Flex.Col>
								<Heading as='p' className='mb--0'>
									{t(`orders.${item[0]}`)}
								</Heading>
							</Flex.Col>
							<Flex.Col
								col='auto'
								as={Button}
								equalDimensions
								pigment='warning'
								sizing='sm'
								onClick={() => setCurrStep(idx + 1)}>
								<IconEdit />
							</Flex.Col>
						</Flex>
					</ListGroup.Collapse.Toggle>
					<ListGroup.Collapse.Content className='p--1'>
						{item[0] === "products" && <ProductsDetails item={item} />}
						{item[0] === "shipping" && <ShippingDetails item={item} />}
						{item[0] === "payment" && <PaymentDetails item={item} />}
					</ListGroup.Collapse.Content>
				</ListGroup.Collapse>
			))}
		</ListGroup>
	);
};

export default OrderStepSummary;
