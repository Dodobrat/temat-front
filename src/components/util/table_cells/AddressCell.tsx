import { Table, Flex } from "@dodobrat/react-ui-kit";
import { IconLocation } from "../../ui/icons";

interface Props {
	cell: any;
}

const AddressCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	const mainAddress = [rowValues?.country, rowValues?.city, rowValues?.zipCode].filter((item) => item);
	const secondaryAddress = [rowValues?.streetName, rowValues?.streetNumber].filter((item) => item);

	const hasAddress = mainAddress.length > 0 || secondaryAddress.length > 0 || rowValues?.officeName;

	return (
		<Table.Cell {...rest}>
			{hasAddress && (
				<Flex spacingY={null} spacingX='sm' wrap='nowrap' align='center'>
					<Flex.Col col='auto'>
						<IconLocation className='dui__icon' />
					</Flex.Col>
					<Flex.Col>
						<Flex spacingY={null}>
							{mainAddress.length > 0 && (
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
							)}
							{secondaryAddress.length > 0 && (
								<Flex.Col col='12'>
									<Flex wrap='nowrap' align='center' spacingX='xs' spacingY={null}>
										{secondaryAddress.map((entry, idx) => (
											<Flex.Col col='auto' key={idx}>
												{entry}
											</Flex.Col>
										))}
									</Flex>
								</Flex.Col>
							)}
							{rowValues?.officeName && <Flex.Col col='12'>{rowValues?.officeName}</Flex.Col>}
						</Flex>
					</Flex.Col>
				</Flex>
			)}
		</Table.Cell>
	);
};

export default AddressCell;
