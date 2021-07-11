import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { AdminLayoutProvider } from "@dodobrat/react-ui-kit";

import AuthRoute from "./components/util/AuthRoute";

const GuestLayout = lazy(() => import("./layouts/guest/GuestLayout"));
const UserLayout = lazy(() => import("./layouts/user/UserLayout"));

function App() {
	return (
		<Router>
			<AdminLayoutProvider>
				<Suspense fallback={<div />}>
					<Switch>
						<Route path='/guest' component={GuestLayout} />
						<AuthRoute path='/app' component={UserLayout} />
						<Redirect to='/guest' />
					</Switch>
				</Suspense>
			</AdminLayoutProvider>
		</Router>
	);
}

export default App;
