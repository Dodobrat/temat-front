import { forwardRef, useCallback, useEffect, useState } from "react";
import cn from "classnames";
import {
	AsyncPaginate,
	// wrapMenuList
} from "react-select-async-paginate";
import { useStateWithPromise } from "../../hooks/useStateWithPromise";
import { errorToast } from "../../helpers/toastEmitter";

// import { WindowedMenuList } from "react-windowed-select";

// const WindowedList = wrapMenuList(WindowedMenuList);

interface Props {
	useFetch: any;
	valueKey?: string;
	labelKey?: string;
	querySpecs?: any;
	cacheUniqs?: any[];
	[key: string]: any;
}

const AsyncSelect = forwardRef((props: Props, ref) => {
	const {
		clearCacheOnMenuOpen,
		searchStringLength = 3,
		defaultSearchString = "",
		useFetch,
		valueKey = "id",
		labelKey = "name",
		labelComponent = null,
		querySpecs = {},
		queryFilters = {},
		querySpecialKey,
		preSelectOption = false,
		className,
		cacheUniqs = [],
		value,
		onChange,
		...rest
	} = props;

	const [clearCacheCounter, setClearCacheCounter] = useState(0);
	const [selectValue, setSelectValue] = useState(value);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const _onChange = useCallback((val) => onChange?.(val), []);

	useEffect(() => {
		setSelectValue(value);
		_onChange(value);
	}, [value, _onChange]);

	const clearCache = () => setClearCacheCounter((prev) => prev + 1);

	const [queryParams, setQueryParams] = useStateWithPromise({
		filters: {
			withColumns: "false",
			page: 0,
			perPage: 10,
			searchString: "",
			...queryFilters,
		},
	});

	const { refetch } = useFetch({
		specs: {
			...queryParams,
			...querySpecs,
		},
		queryConfig: {
			// onSuccess: (data) => console.log(data),
			onError: (err: any) => errorToast(err),
		},
		specialKey: ["select", queryParams, querySpecialKey],
	});

	const updateQueryPage = async ({ page, searchString }) => {
		return setQueryParams((prev) => ({
			filters: {
				...prev.filters,
				page,
				searchString: searchString === "" ? defaultSearchString : searchString,
			},
		}));
	};

	const loadOptions = async (search: string, page: number) => {
		if (search.length < searchStringLength && search.length !== 0) {
			return {
				options: [{ value: "min_char", label: `Min ${searchStringLength} characters`, isDisabled: true }],
				hasMore: false,
				additional: {
					page: page + 1,
				},
			};
		}
		const { data } = await refetch();
		const fetchedData = await data;

		const responseData = await fetchedData?.data?.reduce(
			(final: any, item: any) => [
				...final,
				{
					value: item[valueKey],
					label: labelComponent ? labelComponent(item) : item[labelKey],
					data: item,
				},
			],
			[]
		);

		const { currentPage, lastPage } = await fetchedData?.meta;
		const nextPage = currentPage + 1;

		return {
			options: responseData ?? [],
			hasMore: nextPage <= lastPage,
			additional: {
				page: page + 1,
			},
		};
	};

	return (
		<AsyncPaginate
			className={cn(
				"temat__select__container",
				// 'async-select',
				className
			)}
			onMenuOpen={clearCacheOnMenuOpen && clearCache}
			classNamePrefix='temat__select'
			debounceTimeout={300}
			// components={{ MenuList: WindowedList as any }}
			loadOptions={async (search, _, { page }) => {
				await updateQueryPage({ page, searchString: search });
				const result = await loadOptions(search, page);

				if (preSelectOption && (typeof value !== "object" || typeof value === "undefined" || value === null)) {
					setSelectValue(result?.options?.[0]);
					_onChange(result?.options?.[0]);
				}

				return result;
			}}
			cacheUniqs={[clearCacheCounter, ...cacheUniqs]}
			value={selectValue}
			onChange={_onChange}
			{...rest}
			selectRef={ref}
			additional={{
				page: 0,
			}}
		/>
	);
});

export default AsyncSelect;
