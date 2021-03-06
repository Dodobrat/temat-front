import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from "react";
import WindowedSelect from "react-windowed-select";
import { useDebounce } from "@dodobrat/react-ui-kit";
import cn from "classnames";
interface Props {
	useFetch: any;
	querySpecs?: any;
	queryFilters?: any;
	querySpecialKey?: any;
	defaultSearchString?: string;
	searchStringLength?: number;
	labelComponent?: React.ReactNode | any;
	defaultOptions?: boolean;
	preSelectOption?: boolean;
	isFetchedAtOnce?: boolean;
	valueKey?: string;
	labelKey?: string;
	[key: string]: any;
}

const WindowedAsyncSelect = forwardRef((props: Props, ref) => {
	const {
		useFetch,
		querySpecs = {},
		queryFilters = {},
		querySpecialKey,
		defaultSearchString = "",
		searchStringLength = 2,
		labelComponent = null,
		defaultOptions = false,
		preSelectOption = false,
		isFetchedAtOnce = false,
		valueKey = "id",
		labelKey = "name",
		filterKey,
		value,
		onChange,
		className,
		...rest
	} = props;

	const [searchString, setSearchString] = useState("");
	const debouncedSearchString = useDebounce(searchString, 250);

	const _onChange = useCallback((option) => onChange(option), [onChange]);

	const { data, isStale, isFetching, refetch } = useFetch({
		specs: {
			filters: {
				withColumns: "false",
				searchString: debouncedSearchString,
				...queryFilters,
			},
			...querySpecs,
		},
		queryConfig: {
			enabled: false,
		},
		specialKey: ["select", queryFilters, querySpecs, querySpecialKey, debouncedSearchString],
	});

	useEffect(() => {
		if (defaultOptions && isStale) {
			refetch();
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!isFetchedAtOnce && debouncedSearchString.length >= searchStringLength && isStale) {
			refetch();
		}
	}, [isFetchedAtOnce, debouncedSearchString, searchStringLength, refetch, isStale]);

	const parsedOptions = useMemo(() => {
		if (data) {
			return data?.data?.reduce((prev, curr, idx, arr) => {
				const parsedCurr = {
					value: curr?.[valueKey],
					label: labelComponent?.(curr) ?? curr?.[labelKey],
					data: curr,
				};
				if (data?.meta?.total > data?.meta?.perPage) {
					if (idx === arr.length - 1) {
						return [
							...prev,
							parsedCurr,
							{
								value: null,
								isDisabled: true,
								label: <strong>{`+ ${data?.meta?.total - data?.meta?.perPage}`}</strong>,
							},
						];
					}
					return [...prev, parsedCurr];
				}
				return [...prev, parsedCurr];
			}, []);
		}
		return [];
	}, [data, labelComponent, labelKey, valueKey]);

	const filterOption = ({ label, data }, string) => {
		const searchKey = string?.toLowerCase();
		const filterKeyOption = data.data?.[filterKey]?.toLowerCase();

		if (searchKey.length > 0 && data?.isDisabled) {
			return false;
		} else if (searchKey.length === 0 && data?.isDisabled) {
			return true;
		}
		if (!!labelComponent) {
			if (string) {
				return filterKeyOption?.includes(searchKey);
			}
		} else {
			const optionLabel = label?.toLowerCase();
			if (string) {
				return optionLabel.includes(searchKey) || filterKeyOption?.includes(searchKey);
			}
		}
		return true;
	};

	const filterOptions = useCallback(
		(options, key) => {
			if (typeof key === "string" && key?.length > 0) {
				return options.find((option) => {
					if (option?.isDisabled) return null;
					const searchKey = key?.toLowerCase();
					const filterKeyOption = option.data?.[filterKey]?.toLowerCase();

					if (!!labelComponent) {
						if (filterKeyOption.includes(searchKey)) {
							return option;
						}
					} else {
						const optionLabel = option?.label?.toLowerCase();
						if (optionLabel.includes(searchKey) || filterKeyOption.includes(searchKey)) {
							return option;
						}
					}
					return null;
				});
			}
			return options[0];
		},
		[labelComponent, filterKey]
	);

	const preSelect = useCallback(
		(options) => {
			if (!value && preSelectOption && defaultOptions) {
				_onChange(filterOptions(options, defaultSearchString));
			}
		},
		[value, _onChange, preSelectOption, defaultOptions, defaultSearchString, filterOptions]
	);

	useEffect(() => {
		if (parsedOptions?.length > 0) {
			preSelect(parsedOptions);
		}
	}, [parsedOptions, preSelect]);

	return (
		<WindowedSelect
			className={cn("temat__select__container", className)}
			onMenuOpen={() => isStale && refetch()}
			classNamePrefix='temat__select'
			options={parsedOptions}
			isLoading={isFetching}
			menuPlacement='auto'
			onInputChange={(string) => setSearchString(string)}
			filterOption={filterOption}
			value={value}
			onChange={onChange}
			{...rest}
			selectRef={ref}
		/>
	);
});

export default memo(WindowedAsyncSelect);
