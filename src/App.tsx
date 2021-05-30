import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import AuthRoute from "./components/util/AuthRoute";

const GuestLayout = lazy(() => import("./layouts/guest/GuestLayout"));
const UserLayout = lazy(() => import("./layouts/user/UserLayout"));

function App() {
	return (
		<Router>
			<Suspense fallback={<div />}>
				<Switch>
					<Route path='/guest' component={GuestLayout} />
					<AuthRoute path='/app' component={UserLayout} />
					<Redirect to='/guest' />
				</Switch>
			</Suspense>
		</Router>
	);
}

export default App;
