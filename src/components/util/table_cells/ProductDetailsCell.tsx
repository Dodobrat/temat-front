import React from "react";
import { Flex, Table } from "@dodobrat/react-ui-kit";
import { IconHeight, IconLength, IconWeight } from "../../ui/icons";
import cn from "classnames";

interface Props {
	cell: any;
}

const ProductDetailsCell = (props: Props) => {
	const { cell, ...rest } = props;

	const rowValues = cell.row.original;

	return (
		<Table.Cell {...rest} className='temat__table__product__details'>
			<Flex align='center' wrap='nowrap'>
				<Flex.Col col='6'>
					<span className={cn({ "text--opaque": !rowValues?.height })}>
						<IconHeight /> {rowValues?.height ?? "N/A"}
					</span>
				</Flex.Col>
				<Flex.Col col='6'>
					<span className={cn({ "text--opaque": !rowValues?.width })}>
						<IconHeight className='rotate-90' /> {rowValues?.width ?? "N/A"}
					</span>
				</Flex.Col>
			</Flex>
			<Flex align='center' wrap='nowrap'>
				<Flex.Col col='6'>
					<span className={cn({ "text--opaque": !rowValues?.length })}>
						<IconLength /> {rowValues?.length ?? "N/A"}
					</span>
				</Flex.Col>
				<Flex.Col col='6'>
					<span className={cn({ "text--opaque": !rowValues?.weight })}>
						<IconWeight /> {rowValues?.weight ?? "N/A"}
					</span>
				</Flex.Col>
			</Flex>
		</Table.Cell>
	);
};

export default ProductDetailsCell;
