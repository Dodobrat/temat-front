import { Container, Flex, Heading, SwitchGroup, useConfig } from "@dodobrat/react-ui-kit";
import { IconMoon, IconSun } from "../../components/ui/icons";
import { useAuthContext } from "../../context/AuthContext";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Footer from "../../components/ui/Footer";
import Login from "../../pages/guest/Login";

const GuestLayout = () => {
	const location = useLocation();

	const {
		tokenValue: { token },
	} = useAuthContext();

	const {
		themeConfig: { dark, setDark },
	} = useConfig();

	if (token) return <Redirect to='/app' />;
	return (
		<Container className='px--4' sizing='lg'>
			<Flex direction='column' className='auth__wrapper'>
				<Flex.Col col='auto' className='w--100'>
					<Flex align='center' justify='space-between'>
						<Flex.Col>
							{/* TUKA E ZA LOGO */}
							<Heading as='h6' className='auth__brand my--4'>
								{process.env.REACT_APP_NAME} Group
							</Heading>
						</Flex.Col>
						<Flex.Col col='auto'>
							<SwitchGroup
								name='theme-switch'
								sizing='sm'
								onSwitch={({ option }) => setDark(option.value)}
								options={[
									{ label: <IconSun />, value: false },
									{ label: <IconMoon />, value: true },
								]}
								activeOption={dark}
							/>
						</Flex.Col>
					</Flex>
				</Flex.Col>
				<Flex.Col className='auth__forms d--grid w--100'>
					<TransitionGroup component={null}>
						<CSSTransition key={location.key} timeout={400} classNames='auth__animated__page'>
							<Switch location={location}>
								<Route path='/guest/login' exact component={Login} />
								<Redirect to='/guest/login' />
							</Switch>
						</CSSTransition>
					</TransitionGroup>
				</Flex.Col>
				<Flex.Col col='auto' className='w--100'>
					<Footer />
				</Flex.Col>
			</Flex>
		</Container>
	);
};

export default GuestLayout;
