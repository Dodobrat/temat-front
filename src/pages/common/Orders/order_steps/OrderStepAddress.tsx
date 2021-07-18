import { useOrdersContext } from "../../../../context/OrdersContext";

interface Props {}

const OrderStepAddress = (props: Props) => {
	const {
		stepValue: { currStep, setCurrStep },
		dataValue: { data, setData },
	} = useOrdersContext();

	return <div>Address</div>;
};

export default OrderStepAddress;
