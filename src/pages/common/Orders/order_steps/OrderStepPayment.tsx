import { Flex, FormControl } from "@dodobrat/react-ui-kit";
import { useOrdersContext } from "../../../../context/OrdersContext";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import WindowedSelect from "react-windowed-select";
import { Input } from "@dodobrat/react-ui-kit";
import AsyncSelect from "../../../../components/forms/AsyncSelect";
import { useCurrency, usePaymentMethods } from "../../../../actions/fetchHooks";

const selectProps = {
	className: "temat__select__container",
	classNamePrefix: "temat__select",
	menuPlacement: "auto",
	isSearchable: false,
};

const paidByOptions = [
	{ value: "receiver", label: "Receiver" },
	{ value: "sender", label: "Sender" },
];
const payAfterOptions = [
	{ value: "none", label: "Delivery" },
	{ value: "view", label: "Delivery and View" },
	{ value: "test", label: "Delivery and Test" },
];

const OrderStepPayment = ({ useContext = useOrdersContext }) => {
	const { t } = useTranslation();

	const {
		dataValue: { data, setData },
	} = useContext();

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
		<Flex>
			<Flex.Col col='12'>
				<FormControl label={t("orders.paymentMethod")} htmlFor='paymentMethodId' className={cn("")} hintMsg={""}>
					<AsyncSelect
						useFetch={usePaymentMethods}
						value={data?.payment?.paymentMethodId}
						onChange={(option) => handleValueUpdate("paymentMethodId", option)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='7'>
				<FormControl label={t("orders.amount")} htmlFor='totalAmount' className={cn("")} hintMsg={""}>
					<Input
						type='number'
						name='totalAmount'
						value={data?.payment?.totalAmount ?? ""}
						onChange={({ target }) => handleValueUpdate("totalAmount", target.value)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='5'>
				<FormControl label={t("orders.currency")} htmlFor='currencyId' className={cn("")} hintMsg={""}>
					<AsyncSelect
						useFetch={useCurrency}
						labelComponent={(item) => `${item?.abbreviation} - ${item?.symbol}`}
						value={data?.payment?.currencyId}
						onChange={(option) => handleValueUpdate("currencyId", option)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl label={t("orders.paidBy")} htmlFor='shippingPaidBy' className={cn("")} hintMsg={""}>
					<WindowedSelect
						{...selectProps}
						options={paidByOptions}
						value={data?.payment?.shippingPaidBy}
						onChange={(option) => handleValueUpdate("shippingPaidBy", option)}
					/>
				</FormControl>
			</Flex.Col>
			<Flex.Col col='12'>
				<FormControl label={t("orders.payAfter")} htmlFor='payAfter' className={cn("")} hintMsg={""}>
					<WindowedSelect
						{...selectProps}
						options={payAfterOptions}
						value={data?.payment?.payAfter}
						onChange={(option) => handleValueUpdate("payAfter", option)}
					/>
				</FormControl>
			</Flex.Col>
		</Flex>
	);
};

export default OrderStepPayment;
