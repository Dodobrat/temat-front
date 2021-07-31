import { useTranslation } from "react-i18next";
import { FormControl } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useOrdersContext } from "../../../../context/OrdersContext";
import { useCompanies } from "../../../../actions/fetchHooks";

const OrderStepCompany = () => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useOrdersContext();

	const handleValueUpdate = (key, val) => {
		setData((prev) => ({
			...prev,
			payment: {
				...prev.payment,
				[key]: val,
			},
		}));
	};

	return (
		<FormControl label={t("orders.companyId")} htmlFor='companyId'>
			<AsyncSelect
				useFetch={useCompanies}
				isClearable={false}
				value={data.payment?.companyId}
				onChange={(option) => handleValueUpdate("companyId", option)}
			/>
		</FormControl>
	);
};

export default OrderStepCompany;
