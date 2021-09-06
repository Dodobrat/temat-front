import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { Flex, Form, FormControl, Heading, Input, Button, Card, useLocalStorage } from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useLogin } from "../../actions/mutateHooks";

import { useAuthContext } from "../../context/AuthContext";

import { IconEye, IconEyeCrossed, IconLock, IconUser } from "../../components/ui/icons";

import { errorToast } from "../../helpers/toastEmitter";
import { useTranslation } from "react-i18next";

const Login = () => {
	const { t } = useTranslation();

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
				<title>Temat | {t("common.login")}</title>
			</Helmet>
			<Flex.Col col={{ base: "12", xs: "10", sm: "8", md: "6" }}>
				<Card elevation='medium' className='p--base--0 p--sm--4'>
					<Card.Body>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Heading>{t("common.login")}</Heading>
							<Flex>
								<Flex.Col col='12'>
									<FormControl
										label={t("field.username")}
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
														placeholder={t("field.username")}
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
												required: t("validation.required"),
												minLength: {
													value: 2,
													message: t("validation.minLength", { value: 2 }),
												},
												maxLength: {
													value: 50,
													message: t("validation.maxLength", { value: 50 }),
												},
												pattern: {
													value: /^[a-zA-Z0-9]+$/,
													message: t("validation.pattern"),
												},
											}}
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12'>
									<FormControl
										label={t("field.password")}
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
														placeholder={t("field.password")}
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
												required: t("validation.required"),
												pattern: {
													value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,250}$/,
													message: t("validation.passRequirements"),
												},
											}}
										/>
									</FormControl>
								</Flex.Col>
								<Flex.Col col='12' className='pt--3'>
									<Button type='submit' isLoading={isLoading}>
										{t("common.login")}
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
