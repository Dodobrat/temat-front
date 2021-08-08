import { useTranslation } from "react-i18next";
import { useOrdersContext } from "../../../../context/OrdersContext";
import { Heading } from "@dodobrat/react-ui-kit";
import { IconEdit, LogoPdf } from "../../../../components/ui/icons";
import { Flex } from "@dodobrat/react-ui-kit";
import { Button } from "@dodobrat/react-ui-kit";
import Image from "../../../../components/ui/Image";
import { ListGroup } from "@dodobrat/react-ui-kit";
import { FormControl } from "@dodobrat/react-ui-kit";
import { TextArea } from "@dodobrat/react-ui-kit";
import { parseDate } from "../../../../helpers/dateHelpers";

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
	const { t } = useTranslation();
	const values = Object.values(item[1]);

	if (values.length === 0) return <EmptyEntry />;

	const parseShippingEntry = (entry) => {
		if (entry) {
			if (entry.label) {
				return entry.label;
			}
			if (typeof entry === "boolean") {
				return entry.toString();
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
			{Object.entries(item[1])
				.filter((entryItem) => entryItem[1])
				.map((entry: any) => (
					<ListGroup.Item key={entry[0]}>
						<Flex align='center' wrap='nowrap' {...rest}>
							<Flex.Col>{t(`orders.${entry[0]}`)}</Flex.Col>
							<Flex.Col col='auto'>{parseShippingEntry(entry[1])}</Flex.Col>
						</Flex>
					</ListGroup.Item>
				))}
		</ListGroup>
	);
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

const FilesDetails = ({ item, ...rest }) => {
	if (item[1].length === 0) return <EmptyEntry />;
	return (
		<ListGroup elevation='none'>
			{item[1].map((entry) => (
				<ListGroup.Item key={entry.name}>
					<Flex align='center' wrap='nowrap' {...rest}>
						<Flex.Col col='auto'>
							<LogoPdf height='2rem' width='2rem' />
						</Flex.Col>
						<Flex.Col>{entry?.name}</Flex.Col>
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
		dataValue: { data, setData },
	} = useOrdersContext();

	return (
		<>
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
							{item[0] === "files" && <FilesDetails item={item} />}
						</ListGroup.Collapse.Content>
					</ListGroup.Collapse>
				))}
			</ListGroup>
			<FormControl label='Delivery Note' htmlFor='customerNote'>
				<TextArea
					name='customerNote'
					placeholder='Enter Delivery Note'
					style={{ minHeight: "unset" }}
					value={data.shipping?.customerNote}
					onChange={(e) =>
						setData((prev) => ({
							...prev,
							shipping: {
								...prev.shipping,
								customerNote: e.target.value,
							},
						}))
					}
					maxLength={250}
				/>
			</FormControl>
		</>
	);
};

export default OrderStepSummary;
