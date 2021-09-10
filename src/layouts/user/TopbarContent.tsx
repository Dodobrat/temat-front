import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
	Input,
	FormControl,
	Form,
	Card,
	Portal,
	useWindowResize,
	useAdminLayout,
	AdminLayout,
	Button,
	Text,
	Flex,
	Container,
	Skeleton,
} from "@dodobrat/react-ui-kit";
import cn from "classnames";

import { useAuthContext } from "../../context/AuthContext";

import { useOrderLocate } from "../../actions/fetchHooks";

import { IconClose, IconHamburger, IconLogout, IconRadar } from "../../components/ui/icons";
import { errorToast } from "../../helpers/toastEmitter";

const TopbarContent = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const { width } = useWindowResize(250);
	const {
		userValue: { user },
		logout,
	} = useAuthContext();

	const { toggleSidebar } = useAdminLayout();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm();

	const [orderDetailsModal, setOrderDetailsModal] = useState(false);
	const [orderSeekKey, setOrderSeekKey] = useState("");

	const closeOrderDetailsModal = () => setOrderDetailsModal(false);

	const {
		data: orderId,
		refetch,
		isFetching,
	} = useOrderLocate({
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: { orderId: orderSeekKey },
	});

	useEffect(() => {
		if (!!orderSeekKey) {
			refetch();
		}
	}, [orderSeekKey, refetch]);

	useEffect(() => {
		if (orderId) {
			console.log(orderId);
			history.push(`/orders/${orderId}`);
			closeOrderDetailsModal();
		}
	}, [orderId, history]);

	const onSubmit = (data: any) => {
		console.log(data);
		setOrderSeekKey(data?.keyword);
	};

	return (
		<AdminLayout.Topbar>
			<Container className='px--3 h--100'>
				<Flex wrap='nowrap' align='center' justify='flex-end' spacingY={null} spacingX={null} className='h--100'>
					<Flex.Col col='auto' className='d--sm--none'>
						<Button flavor='rounded' equalDimensions pigment='default' onClick={toggleSidebar}>
							<IconHamburger />
						</Button>
					</Flex.Col>
					<Flex.Col>
						<Button
							pigment='warning'
							iconStart={width > 719 && <IconRadar />}
							equalDimensions={width <= 719}
							className={width <= 719 ? "mx--2" : "mx--0"}
							onClick={() => setOrderDetailsModal(true)}>
							{width > 719 ? t("common.orderDetails") : <IconRadar />}
						</Button>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Flex spacingY={null} align='center' disableNegativeSpace>
							<Flex.Col as={Text} col='auto' className='mb--0'>
								{user?.username ?? <Skeleton as='span' />}
							</Flex.Col>
							<Flex.Col
								as={Button}
								col='auto'
								onClick={logout}
								flavor='rounded'
								equalDimensions
								pigment='default'
								hoverPigment='danger'>
								<IconLogout />
							</Flex.Col>
						</Flex>
					</Flex.Col>
				</Flex>
			</Container>
			<Portal animation='zoom' isOpen={orderDetailsModal} onClose={closeOrderDetailsModal}>
				<Card>
					<Card.Header
						actions={
							<Button equalDimensions sizing='sm' onClick={closeOrderDetailsModal} pigment='default'>
								<IconClose />
							</Button>
						}>
						<Text className='mb--0'>{t("common.orderDetails")}</Text>
					</Card.Header>
					<Card.Body>
						<Form id='locate-order-form' onSubmit={handleSubmit(onSubmit)}>
							<FormControl
								label={t("field.keyword")}
								htmlFor='keyword'
								className={cn({
									"text--danger": errors?.keyword,
								})}
								hintMsg={errors?.keyword?.message}>
								<Controller
									render={({ field }) => {
										const { ref, ...fieldRest } = field;
										return (
											<Input
												placeholder={t("field.keyword")}
												{...fieldRest}
												autoFocus
												innerRef={ref}
												pigment={errors?.keyword ? "danger" : "primary"}
											/>
										);
									}}
									name='keyword'
									control={control}
									defaultValue=''
									rules={{
										required: t("validation.required"),
									}}
								/>
							</FormControl>
						</Form>
					</Card.Body>
					<Card.Footer justify='flex-end'>
						<Button type='submit' form='locate-order-form' className='ml--2' isLoading={isFetching}>
							{t("common.orderDetails")}
						</Button>
					</Card.Footer>
				</Card>
			</Portal>
		</AdminLayout.Topbar>
	);
};

TopbarContent.displayName = "AdminLayoutTopbar";

export default TopbarContent;
