import { useEffect } from "react";

import { useOrderCourierHistoryById } from "../../../actions/fetchHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import DataTable from "../../../components/util/DataTable";

interface Props {
	order: any;
}

const OrdersViewCourierHistory = (props: Props) => {
	const { order } = props;

	const {
		tableProps,
		state: { setQueryParams },
	} = useDataTableGenerate({
		useFetch: useOrderCourierHistoryById,
	});

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			order,
		}));
	}, [order, setQueryParams]);

	return <DataTable {...tableProps} elevation='none' stackHeader={false} />;
};

export default OrdersViewCourierHistory;
