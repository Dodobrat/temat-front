import ReactDOM from "react-dom";
import "./assets/app.scss";
import "./i18n";
import { ConfigProvider } from "@dodobrat/react-ui-kit";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthProvider from "./context/AuthContext";

import { GlobalOptions } from "@dodobrat/react-ui-kit/build/helpers/global.types";
import { PortalWrapper } from "@dodobrat/react-ui-kit";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retryDelay: 5000,
			retry: 0,
		},
	},
});

const appConfig: GlobalOptions = {
	containerSize: "fhd",
	tooltipShowOnFocus: false,
	portalAnimation: "zoom",
};

ReactDOM.render(
	<ConfigProvider config={appConfig}>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
		<PortalWrapper>
			<ToastContainer
				position='bottom-left'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</PortalWrapper>
	</ConfigProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
