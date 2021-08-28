import { Flex, Form, FormControl, Heading, IconUser, Input, IconLock, Button, Card, useLocalStorage } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { useLogin } from "../../actions/mutateHooks";
import { useAuthContext } from "../../context/AuthContext";
import cn from "classnames";
import { errorToast } from "../../helpers/toastEmitter";
import { Helmet } from "react-helmet";

const Login = () => {
	const {
		tokenValue: { setToken },
	} = useAuthContext();

	const {
		register,
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

	const { ref: innerRefUsername, ...restUsername } = register("username", {
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
	});
	const { ref: innerRefPassword, ...restPassword } = register("password", {
		required: "Field is required",
		pattern: {
			value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,250}$/,
			message: "Password format doesn't match requirements",
		},
	});

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
										<Input
											placeholder='Username'
											preffix={<IconUser />}
											{...restUsername}
											innerRef={innerRefUsername}
											pigment={errors?.username ? "danger" : "primary"}
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
										<Input
											type='password'
											placeholder='Password'
											preffix={<IconLock />}
											{...restPassword}
											innerRef={innerRefPassword}
											pigment={errors?.password ? "danger" : "primary"}
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
