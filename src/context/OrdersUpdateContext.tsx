import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrdersUpdateContext = createContext(null);

interface OrdersUpdateProviderProps {
	initialData?: any;
	initialStep?: number;
	children?: React.ReactNode;
}

const OrdersUpdateProvider: React.FC<OrdersUpdateProviderProps> = ({ children, initialData }) => {
	const [data, setData] = useState(
		initialData ?? {
			orderId: null,
			payment: {},
			shipping: {},
			receiver: {},
			products: [],
			extras: {},
		}
	);
	const [currStep, setCurrStep] = useState(0);

	useEffect(() => {
		if (initialData) {
			setData(initialData);
		}
	}, [initialData]);

	const dataValue = useMemo(() => ({ data, setData }), [data, setData]);
	const stepValue = useMemo(() => ({ currStep, setCurrStep }), [currStep, setCurrStep]);

	return (
		<OrdersUpdateContext.Provider
			value={{
				dataValue,
				stepValue,
			}}>
			{children}
		</OrdersUpdateContext.Provider>
	);
};

export const useOrdersUpdateContext = () => {
	const context = useContext(OrdersUpdateContext);

	if (context === undefined) {
		throw new Error("useOrdersUpdateContext must be used within a OrdersUpdateProvider");
	}

	return context;
};

export default OrdersUpdateProvider;
