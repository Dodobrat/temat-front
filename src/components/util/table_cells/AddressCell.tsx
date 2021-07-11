import { Table, Flex } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}

const AddressCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	const mainAddress = [rowValues?.country, rowValues?.city, rowValues?.zipCode].filter((item) => item);
	const secondaryAddress = [rowValues?.streetName, rowValues?.streetNumber].filter((item) => item);

	return (
		<Table.Cell {...rest}>
			<Flex spacingY={null}>
				<Flex.Col col='12'>
					<Flex wrap='nowrap' align='center' spacingX='xs' spacingY={null}>
						{mainAddress.map((entry, idx) => (
							<Flex.Col col='auto' key={idx}>
								{entry}
								{idx !== mainAddress.length - 1 ? "," : ""}
							</Flex.Col>
						))}
					</Flex>
				</Flex.Col>
				<Flex.Col col='12'>
					<Flex wrap='nowrap' align='center' spacingX='xs' spacingY={null}>
						{secondaryAddress.map((entry, idx) => (
							<Flex.Col col='auto' key={idx}>
								{entry}
							</Flex.Col>
						))}
					</Flex>
				</Flex.Col>
			</Flex>
		</Table.Cell>
	);
};

export default AddressCell;
