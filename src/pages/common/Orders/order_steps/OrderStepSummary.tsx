import { useTranslation } from "react-i18next";
import { ListGroup, Button, Flex, Heading, Text } from "@dodobrat/react-ui-kit";

import { useOrdersContext } from "../../../../context/OrdersContext";

import Image from "../../../../components/ui/Image";
import { IconEdit, LogoPdf, IconCheck, IconClose } from "../../../../components/ui/icons";

import { parseDate } from "../../../../helpers/dateHelpers";

const EmptyEntry = () => {
	const { t } = useTranslation();
	return (
		<Heading as='p' centered className='my--3'>
			{t("table.noData")}
		</Heading>
	);
};

const ProductsDetails = ({ products, ...rest }) => {
	const { t } = useTranslation();
	if (products.length === 0) return <EmptyEntry />;
	const totalAmount = products?.reduce((prev, curr) => {
		const productCost = parseInt(curr?.quantity) * Number(curr?.price);
		return prev + productCost;
	}, 0);
	const totalAmountFinal = `${parseFloat(totalAmount.toString()).toFixed(2)} ${products[0]?.currency}`;
	return (
		<ListGroup elevation='none'>
			{products.map((entry) => (
				<ListGroup.Item key={entry.value}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col className='temat__table__img'>
							<Image imgSrc={entry?.data?.image} alt={entry?.data?.description ?? entry?.label} />
						</Flex.Col>
						<Flex.Col>{entry?.label}</Flex.Col>
						<Flex.Col col='auto'>
							{entry?.price} {entry?.currency}
						</Flex.Col>
						<Flex.Col col='auto'>
							{t("common.qty")} {entry?.quantity}
						</Flex.Col>
					</Flex>
				</ListGroup.Item>
			))}
			<ListGroup.Item>
				<Flex>
					<Flex.Col>{t("common.total")}</Flex.Col>
					<Flex.Col col='auto'>{totalAmountFinal}</Flex.Col>
				</Flex>
			</ListGroup.Item>
		</ListGroup>
	);
};

const ShippingDetails = ({ details, ...rest }) => {
	const { t } = useTranslation();
	const values = Object.values(details);

	if (values.length === 0) return <EmptyEntry />;

	const parseShippingEntry = (entry) => {
		if (entry) {
			if (entry.label) {
				return entry.label;
			}
			if (entry instanceof Date) {
				return parseDate(entry.toString());
			}
			return entry;
		}
		return null;
	};

	return (
		<ListGroup elevation='none'>
			{Object.entries(details)
				.filter((entryItem) => entryItem[1])
				.map((entry: any) => (
					<ListGroup.Item key={entry[0]}>
						<Flex align='center' wrap='nowrap' {...rest}>
							<Flex.Col>{t(`field.${entry[0].replace("Id", "")}`)}</Flex.Col>
							<Flex.Col col='auto'>{parseShippingEntry(entry[1])}</Flex.Col>
						</Flex>
					</ListGroup.Item>
				))}
		</ListGroup>
	);
};

const ReceiverDetails = ({ details, ...rest }) => {
	const { t } = useTranslation();
	const values = Object.values(details);

	if (values.length === 0) return <EmptyEntry />;

	const parseShippingEntry = (entry) => {
		if (entry) {
			if (entry.label) {
				return entry.label;
			}
			if (typeof entry === "boolean") {
				return entry.toString() === "true" ? (
					<div className='px--2 bg--success bgtext--success flavor--default'>
						<IconCheck className='dui__icon' />
					</div>
				) : (
					<div className='px--2 bg--danger bgtext--danger flavor--default'>
						<IconClose className='dui__icon' />
					</div>
				);
			}
			return entry;
		}
		return null;
	};

	return (
		<ListGroup elevation='none'>
			{Object.entries(details)
				.filter((entryItem) => entryItem[1])
				.map((entry: any) => {
					const sanitizedEntryKey = entry[0].replace("receiver", "").replace("Id", "");
					const entryKey = sanitizedEntryKey.charAt(0).toLowerCase() + sanitizedEntryKey.slice(1);
					return (
						<ListGroup.Item key={entry[0]}>
							<Flex align='center' wrap='nowrap' {...rest}>
								<Flex.Col>{t(`field.${entryKey}`)}</Flex.Col>
								<Flex.Col col='auto'>{parseShippingEntry(entry[1])}</Flex.Col>
							</Flex>
						</ListGroup.Item>
					);
				})}
		</ListGroup>
	);
};

const PaymentDetails = ({ details, ...rest }) => {
	const { t } = useTranslation();
	const values = Object.values(details);

	if (values.length === 0) return <EmptyEntry />;

	return (
		<ListGroup elevation='none'>
			{Object.entries(details).map((entry: any) => (
				<ListGroup.Item key={entry[0]}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col>{t(`field.${entry[0].replace("Id", "")}`)}</Flex.Col>
						<Flex.Col col='auto'>{entry[1]?.label ?? entry[1]}</Flex.Col>
					</Flex>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
};

const ExtraDetails = ({ details, ...rest }) => {
	const values = Object.values(details);
	const { t } = useTranslation();

	if (values.length === 0) return <EmptyEntry />;

	return (
		<ListGroup elevation='none'>
			{details?.files?.map((entry) => (
				<ListGroup.Item key={entry.name}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col col='auto'>
							<LogoPdf height='2rem' width='2rem' />
						</Flex.Col>
						<Flex.Col>{entry?.name}</Flex.Col>
					</Flex>
				</ListGroup.Item>
			))}
			<ListGroup.Item>
				<Text>{t("field.note")}:</Text>
				{!!details?.customerNote ? <Text className='mb--0'>{details?.customerNote}</Text> : <EmptyEntry />}
			</ListGroup.Item>
		</ListGroup>
	);
};

const OrderStepSummary = () => {
	const { t } = useTranslation();

	const {
		stepValue: { setCurrStep },
		panelsValue: { toggledSummaryPanels, setToggledSummaryPanels },
		dataValue: { data },
		closeAllPanelsExcept,
	} = useOrdersContext();

	return (
		<ListGroup elevation={null} className='my--2 outline'>
			{Object.entries(data).map((item, idx) => (
				<ListGroup.Collapse
					key={item[0]}
					isCollapsed={toggledSummaryPanels[item[0]]}
					onToggle={(isCollapsed) => setToggledSummaryPanels((prev) => ({ ...prev, [item[0]]: !isCollapsed }))}>
					<ListGroup.Collapse.Toggle className='list__collapse__toggle'>
						<Flex wrap='nowrap' align='center' spacingX={null} spacingY={null}>
							<Flex.Col>
								<Heading as='p' className='mb--0'>
									{t(`step.${item[0]}`)}
								</Heading>
							</Flex.Col>
							<Flex.Col
								col='auto'
								as={Button}
								equalDimensions
								pigment='warning'
								sizing='sm'
								onClick={() => {
									setCurrStep(idx + 1);
									closeAllPanelsExcept(item[0]);
								}}>
								<IconEdit />
							</Flex.Col>
						</Flex>
					</ListGroup.Collapse.Toggle>
					<ListGroup.Collapse.Content className='p--1'>
						{item[0] === "payment" && <PaymentDetails details={item[1]} />}
						{item[0] === "shipping" && <ShippingDetails details={item[1]} />}
						{item[0] === "receiver" && <ReceiverDetails details={item[1]} />}
						{item[0] === "products" && <ProductsDetails products={item[1]} />}
						{item[0] === "extras" && <ExtraDetails details={item[1]} />}
					</ListGroup.Collapse.Content>
				</ListGroup.Collapse>
			))}
		</ListGroup>
	);
};

export default OrderStepSummary;
