import { Tooltip, Flex, Table } from "@dodobrat/react-ui-kit";
import Image from "../../ui/Image";

interface Props {
	cell: any;
}

const WithImageCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	return (
		<Table.Cell {...rest}>
			<Flex align='center' wrap='nowrap' className='temat__table__img__container'>
				<Flex.Col className='temat__table__img'>
					<Image imgSrc={cell.row.original?.image} alt={cell.row.original?.description ?? cell.row.original?.name} />
				</Flex.Col>
				<Flex.Col>
					<Tooltip content={cell.value ?? `${rowValues?.firstName} ${rowValues?.lastName}`}>
						<div className='ellipsis'>
							{cell.value ?? (
								<Flex spacingY={null}>
									{(rowValues?.firstName || rowValues?.lastName) && (
										<Flex.Col col='12'>
											{rowValues?.firstName} {rowValues?.lastName}
										</Flex.Col>
									)}
									<Flex.Col col='12'>
										<span className='text--opaque'>{rowValues?.username}</span>
									</Flex.Col>
								</Flex>
							)}
						</div>
					</Tooltip>
				</Flex.Col>
			</Flex>
		</Table.Cell>
	);
};

export default WithImageCell;
