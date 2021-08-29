import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { Flex, Form, FormControl, Heading, Input, Button, Card, useLocalStorage } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useLogin } from "../../actions/mutateHooks";

import { useAuthContext } from "../../context/AuthContext";

import { IconEye, IconEyeCrossed, IconLock, IconUser } from "../../components/ui/icons";

import { errorToast } from "../../helpers/toastEmitter";

const Login = () => {
	const {
		tokenValue: { setToken },
	} = useAuthContext();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [, setStorageToken] = useLocalStorage(process.env.REACT_APP_TOKEN_KEY);

	const { mutate: login, isLoading } = useLogin({
		queryConfig: {
			onSuccess: (res: any) => {
				setStorageToken(res.token);
				setToken(res.token);
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const onSubmit = (data: any) => {
		login(data);
	};

	return (
		<Flex>
			<Helmet>
				<title>Temat | Login</title>
			</Helmet>
			<Flex.Col col={{ base: "12", xs: "10", sm: "8", md: "6" }}>
				<Card elevation='medium' className='p--base--0 p--sm--4'>
					<Card.Body>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Heading>Login</Heading>
							<Flex>
								<Flex.Col col='12'>
									<FormControl
										label='Username'
										htmlFor='username'
										className={cn({
											"text--danger": errors?.username,
										})}
										hintMsg={errors?.username?.message}>
										<Controller
											render={({ field }) => {
												const { ref, ...fieldRest } = field;
												return (
													<Input
														placeholder='Username'
														preffix={<IconUser className='dui__icon' />}
														{...fieldRest}
														innerRef={ref}
														pigment={errors?.username ? "danger" : "primary"}
													/>
												);
											}}
											name='username'
											control={control}
											defaultValue=''
											rules={{
												required: "Field is required",
												pattern: {
													value: /^[a-zA-Z0-9]+$/,
													message: "Invalid Username characters",
												},
												minLength: {
													value: 2,
													message: "Min 2 characters",
												},
												maxLength: {
													value: 50,
													message: "Max 50 characters",
												},
											}}
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12'>
									<FormControl
										label='Password'
										htmlFor='password'
										className={cn({
											"text--danger": errors?.password,
										})}
										hintMsg={errors?.password?.message}>
										<Controller
											render={({ field }) => {
												const { ref, ...fieldRest } = field;
												return (
													<Input
														type='password'
														placeholder='Password'
														preffix={<IconLock className='dui__icon' />}
														passwordRevealComponent={(isVisible) =>
															isVisible ? (
																<IconEyeCrossed className='dui__icon' />
															) : (
																<IconEye className='dui__icon' />
															)
														}
														{...fieldRest}
														innerRef={ref}
														pigment={errors?.password ? "danger" : "primary"}
													/>
												);
											}}
											name='password'
											control={control}
											defaultValue=''
											rules={{
												required: "Field is required",
												pattern: {
													value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,250}$/,
													message: "Password format doesn't match requirements",
												},
											}}
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12' className='pt--3'>
									<Button type='submit' isLoading={isLoading}>
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
