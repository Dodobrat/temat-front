import { useEffect } from "react";

import { useOrderHistoryById } from "../../../actions/fetchHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import DataTable from "../../../components/util/DataTable";

interface Props {
	order: any;
}

const OrdersViewHistory = (props: Props) => {
	const { order } = props;

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useOrderHistoryById,
	});

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			order,
		}));
	}, [order, setQueryParams]);

	return <DataTable {...tableProps} elevation='none' stackHeader={false} />;
};

export default OrdersViewHistory;
