import { Tooltip, SwitchComponent, Table } from "@dodobrat/react-ui-kit";
import { useTranslation } from "react-i18next";

interface Props {
	cell: any;
}

const SwitchCell = (props: Props) => {
	const { cell, ...rest } = props;

	const { t } = useTranslation();

	return (
		<Table.Cell {...rest}>
			<Tooltip
				sizing='xs'
				content={<strong>{t("action.toggle", { entry: cell.value > 0 ? t("common.off") : t("common.on") }).toUpperCase()}</strong>}
				spacing={10}
				position='left-center'>
				<div>
					<SwitchComponent
						defaultChecked={cell.value}
						onChange={(e: any) => cell.column.action({ value: e.target.checked, entry: cell.row.original })}
						sizing='lg'
					/>
				</div>
			</Tooltip>
		</Table.Cell>
	);
};

export default SwitchCell;
