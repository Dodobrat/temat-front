import React from "react";
import { Table, Heading } from "@dodobrat/react-ui-kit";

const NoDataRow = () => {
	return (
		<Table.Row>
			<Table.Cell colSpan='1000'>
				<Heading as='h6' className='my--4' centered>
					No Data
				</Heading>
			</Table.Cell>
		</Table.Row>
	);
};

export default NoDataRow;
