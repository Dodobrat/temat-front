import { useTranslation } from "react-i18next";
import { Table, Heading } from "@dodobrat/react-ui-kit";

const NoDataRow = () => {
	const { t } = useTranslation();

	return (
		<Table.Row>
			<Table.Cell colSpan='1000'>
				<Heading as='h6' className='my--4' centered>
					{t("table.noData")}
				</Heading>
			</Table.Cell>
		</Table.Row>
	);
};

export default NoDataRow;
