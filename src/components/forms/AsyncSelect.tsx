import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

interface Props {
	useFetch: any;
	[key: string]: any;
}

const AsyncSelect = (props: Props) => {
	const { useFetch, ...rest } = props;

	const [queryParams, setQueryParams] = useState({
		filters: {
			withColumns: "false",
			page: 0,
			perPage: 20,
			searchString: "",
		},
	});

	const { refetch } = useFetch({
		specs: queryParams,
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => console.log(err),
		},
		specialKey: ["select", queryParams],
	});

	const updateQueryPage = async ({ page, searchString }) => {
		return setQueryParams((prev) => ({
			filters: {
				...prev.filters,
				page,
				searchString,
			},
		}));
	};

	const loadOptions = async (search: string, loadedOptions: Array<any>, { page }: any) => {
		if (search.length < 3 && search.length !== 0)
			return {
				options: [{ value: "min_char", label: "Min 3 characters", isDisabled: true }],
				hasMore: false,
				additional: {
					page: page + 1,
				},
			};
		await updateQueryPage({ page, searchString: search });
		const { data } = await refetch();
		const fetchedData = await data;

		const responseData = await fetchedData?.data?.reduce(
			(final: any, item: { id: number; name: string }) => [
				...final,
				{
					value: item.id,
					label: item.name,
				},
			],
			[]
		);

		const { currentPage, lastPage } = await fetchedData?.meta;
		const nextPage = currentPage + 1;

		return {
			options: responseData ?? [],
			hasMore: nextPage < lastPage,
			additional: {
				page: page + 1,
			},
		};
	};

	return (
		<AsyncPaginate
			debounceTimeout={300}
			loadOptions={loadOptions}
			{...rest}
			// isOptionDisabled={(option) => option.value === "min_char"}
			additional={{
				page: 0,
			}}
		/>
	);
};

export default AsyncSelect;
