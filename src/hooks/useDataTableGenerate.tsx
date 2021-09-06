import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { errorToast } from "../helpers/toastEmitter";
import { useDataTableGenerateType } from "../types/global.types";

const useDataTableGenerate: useDataTableGenerateType = ({ useFetch, columns, actions = [] }) => {
	const { userCan } = useAuthContext();

	const [queryParams, setQueryParams] = useState({
		sortBy: [],
		filters: {
			page: 0,
			perPage: 10,
			searchString: "",
		},
	});

	const { data, refetch, isFetching, isStale } = useFetch({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: queryParams,
	});

	const fetchedData = data?.data ?? [];
	const fetchedMeta = data?.meta ?? null;

	const memoColumns = useMemo(() => {
		if (data) {
			let mergedColumns = [];
			const allColumns = [];

			if (columns && Array.isArray(columns)) {
				mergedColumns = [...data.columns, ...columns].reduce((prev, curr) => {
					const duplicateCol = prev.find((entry) => entry?.type === curr?.type);

					if (duplicateCol && "action" in curr) {
						return prev.map((entry) => {
							if (entry?.type === curr?.type) {
								return { ...curr, ...entry };
							}
							return entry;
						});
					}

					return [...prev, curr];
				}, []);
			} else {
				mergedColumns = data.columns;
			}

			for (const col of mergedColumns) {
				allColumns.push({
					...col,
					Header: col.title,
					accessor: col.accessor,
					disableSortBy: !col.canSort,
					type: col?.type,
					id: col?.id,
				});
			}

			return allColumns;
		}
		return [];
	}, [data, columns]);

	const memoActions = useMemo(() => {
		if (data) {
			const permittedActions = [];

			if (actions && Array.isArray(actions)) {
				for (const action of actions) {
					if (userCan(action.permission)) {
						permittedActions.push({
							type: action.type,
							withConfirmation: action?.withConfirmation,
							action: action?.action,
							props: action?.props,
						});
					}
				}
			}

			return permittedActions;
		}
		return [];
	}, [data, actions, userCan]);

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
		if (isStale) {
			refetch();
		}
	}, [queryParams, refetch, isStale]);

	return {
		tableProps: {
			columns: memoColumns,
			data: fetchedData,
			fetchData,
			loading: isFetching,
			actions: memoActions,
			serverPageCount: fetchedMeta?.lastPage,
			serverTotalResults: fetchedMeta?.total,
		},
		state: {
			queryParams,
			setQueryParams,
		},
		query: {
			data,
			refetch,
			isFetching,
			isStale,
		},
	};
};

export default useDataTableGenerate;
