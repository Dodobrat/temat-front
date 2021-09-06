import { useTranslation } from "react-i18next";
import { Tooltip, Flex, Table } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { IconHeight, IconLength, IconWeight } from "../../ui/icons";

interface Props {
	cell: any;
}

const ProductDetailsCell = (props: Props) => {
	const { cell, ...rest } = props;

	const { t } = useTranslation();

	const rowValues = cell.row.original;

	return (
		<Table.Cell {...rest} className='temat__table__product__details'>
			<Flex align='center' wrap='nowrap'>
				<Flex.Col col='6'>
					<Tooltip content={t("field.heightCm")} position='left-center'>
						<span className={cn({ "text--opaque": !rowValues?.height })}>
							<IconHeight /> {rowValues?.height ?? t("common.na")}
						</span>
					</Tooltip>
				</Flex.Col>
				<Flex.Col col='6'>
					<Tooltip content={t("field.widthCm")} position='right-center'>
						<span className={cn({ "text--opaque": !rowValues?.width })}>
							<IconHeight className='rotate-90' /> {rowValues?.width ?? t("common.na")}
						</span>
					</Tooltip>
				</Flex.Col>
			</Flex>
			<Flex align='center' wrap='nowrap'>
				<Flex.Col col='6'>
					<Tooltip content={t("field.lengthCm")} position='left-center'>
						<span className={cn({ "text--opaque": !rowValues?.length })}>
							<IconLength /> {rowValues?.length ?? t("common.na")}
						</span>
					</Tooltip>
				</Flex.Col>
				<Flex.Col col='6'>
					<Tooltip content={t("field.weightKg")} position='right-center'>
						<span className={cn({ "text--opaque": !rowValues?.weight })}>
							<IconWeight /> {rowValues?.weight ?? t("common.na")}
						</span>
					</Tooltip>
				</Flex.Col>
			</Flex>
		</Table.Cell>
	);
};

export default ProductDetailsCell;
