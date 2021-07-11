import { Flex, Form, FormControl, Heading, IconUser, Input, IconLock, Button, Card, useLocalStorage } from "@dodobrat/react-ui-kit";
import { useForm } from "react-hook-form";
import { useLogin } from "../../actions/mutateHooks";
import { useAuth } from "../../context/AuthContext";
import cn from "classnames";
import { errorToast } from "../../helpers/toastEmitter";

const Login = () => {
	const {
		tokenValue: { setToken },
	} = useAuth();

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

	const { ref: innerRefUsername, ...restUsername } = register("username", { required: "Field is required" });
	const { ref: innerRefPassword, ...restPassword } = register("password", {
		required: "Field is required",
		// pattern: {
		// 	value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,50}$/g,
		// 	message: "Password format doesn't match requirements",
		// },
	});

	return (
		<Flex>
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
