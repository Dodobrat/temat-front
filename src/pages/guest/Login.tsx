import React from "react";
import { Flex, Form, FormControl, Heading, IconUser, Input, IconLock, Button, Card, useLocalStorage } from "@dodobrat/react-ui-kit";
import { useLogin } from "../../actions/mutateHooks";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
	const {
		tokenValue: { setToken },
	} = useAuth();

	const [, setStorageToken] = useLocalStorage(process.env.REACT_APP_TOKEN_KEY);

	const { mutate: login, isLoading } = useLogin({
		queryConfig: {
			onSuccess: (res: any) => {
				setStorageToken(res.token);
				setToken(res.token);
			},
			onError: (err: any) => console.log(err),
		},
	});

	const handleSubmit = ({ values }) => {
		login(values);
	};

	return (
		<Flex>
			<Flex.Col col={{ base: "12", xs: "10", sm: "8", md: "6" }}>
				<Card elevation='medium' className='p--base--0 p--sm--4'>
					<Card.Body>
						<Form onFormSubmit={handleSubmit}>
							<Heading>Login</Heading>
							<Flex>
								<Flex.Col col='12'>
									<FormControl label='Username' htmlFor='username'>
										<Input
											name='username'
											placeholder='Username'
											sizing={{ base: "md", lg: "lg" }}
											preffix={<IconUser />}
											required
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12'>
									<FormControl label='Password' htmlFor='password'>
										<Input
											type='password'
											name='password'
											placeholder='Password'
											sizing={{ base: "md", lg: "lg" }}
											preffix={<IconLock />}
											required
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12'>
									<Button type='submit' sizing={{ base: "md", lg: "lg" }} isLoading={isLoading}>
										Login
									</Button>
								</Flex.Col>
							</Flex>
						</Form>
					</Card.Body>
				</Card>
			</Flex.Col>
		</Flex>
	);
};

export default Login;
