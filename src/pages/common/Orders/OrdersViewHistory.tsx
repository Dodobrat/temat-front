import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOrderHistoryById } from "../../../actions/fetchHooks";
import DataTable from "../../../components/util/DataTable";
import { errorToast } from "../../../helpers/toastEmitter";
import { ResponseColumnType } from "../../../types/global.types";

interface Props {
	order: any;
}

const OrdersViewHistory = (props: Props) => {
	const { order } = props;

	const [queryParams, setQueryParams] = useState({
		sortBy: [],
		filters: {
			page: 0,
			perPage: 10,
		},
	});

	const { data, refetch, isStale, isFetching, isError } = useOrderHistoryById({
		specs: queryParams,
		queryConfig: {
			retry: 2,
			retryDelay: 1000 * 10,
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: { order, queryParams },
	});

	const fetchedData = useMemo(() => data?.data ?? [], [data]);
	const fetchedMeta = useMemo(() => data?.meta ?? null, [data]);

	const columns = useMemo(() => {
		if (data) {
			return data.columns.map((col: ResponseColumnType) => {
				return {
					Header: col.title,
					accessor: col.accessor,
					disableSortBy: !col.canSort,
					type: col?.type,
					id: col?.id,
				};
			});
		}
		return [];
	}, [data]);

	const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
		setQueryParams((prev) => ({
			...prev,
			sortBy,
			filters: {
				...prev.filters,
				page: pageIndex,
				perPage: pageSize,
			},
		}));
	}, []);

	useEffect(() => {
		if (isStale && !isFetching && !isError) {
			refetch();
		}
	}, [queryParams, refetch, isStale, isFetching, isError]);

	return (
		<DataTable
			columns={columns}
			data={fetchedData}
			fetchData={fetchData}
			loading={isFetching}
			actions={[]}
			serverPageCount={fetchedMeta?.lastPage}
			serverTotalResults={fetchedMeta?.total}
			elevation='none'
			stackHeader={false}
		/>
	);
};

export default OrdersViewHistory;
