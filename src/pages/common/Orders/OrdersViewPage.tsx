import { ListGroup } from "@dodobrat/react-ui-kit";
import { Badge } from "@dodobrat/react-ui-kit";
import { useLocalStorage } from "@dodobrat/react-ui-kit";
import { Collapse } from "@dodobrat/react-ui-kit";
import { Heading, Card, Flex, Text } from "@dodobrat/react-ui-kit";
import cn from "classnames";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useOrderById } from "../../../actions/fetchHooks";
import PageContent from "../../../components/ui/wrappers/PageContent";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import { parseDate } from "../../../helpers/dateHelpers";
import { errorToast } from "../../../helpers/toastEmitter";

interface Props {}

const OrdersViewPage = (props: Props) => {
	const { id: orderId }: any = useParams();
	const { t } = useTranslation();

	const [isCollapsedDetails, setIsCollapsedDetails] = useLocalStorage("orderDetailsCollapseState", true);

	const { data: orderData } = useOrderById({
		queryConfig: {
			onError: (err: any) => errorToast(err),
		},
		specialKey: orderId,
	});

	const { data: order } = orderData ?? { data: null };

	console.log(order);

	const ListText = ({ children, className, ...rest }: any) => (
		<Text className={cn("mb--0", className)} {...rest}>
			{children}
		</Text>
	);

	const ListHeading = ({ children, className, ...rest }: any) => (
		<ListGroup.Header className={cn("py--1 temat__view__list__header text--opaque", className)} {...rest}>
			{children}
		</ListGroup.Header>
	);

	ListHeading.displayName = "ListGroupHeader";

	return (
		<PageWrapper>
			<Helmet>
				<title>Temat | Order #{orderId}</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							Order #{orderId}
						</Heading>
					</Flex.Col>
					<Flex.Col col='auto'>
						<Badge sizing={{ base: "md", xl: "lg" }}>{parseDate(order?.dateCreated, true)}</Badge>
					</Flex.Col>
				</Flex>
			</PageHeader>
			<PageContent>
				<Flex wrap={{ base: "wrap", xl: "nowrap" }} spacingX='md'>
					<Flex.Col>
						<Flex direction='column' spacingY='md'>
							<Flex.Col className='w--100'>
								<Collapse
									isCollapsed={isCollapsedDetails}
									onToggle={(isColapsed: boolean) => setIsCollapsedDetails(!isColapsed)}>
									<Collapse.Toggle>
										<Heading as='p' className='mb--1'>
											{t("orders.orderDetails")}
										</Heading>
									</Collapse.Toggle>
									<Collapse.Content className='pt--0'>
										<hr className='mb--3 mt--0' />
										<Flex align='stretch'>
											<Flex.Col col={{ base: "12", xl: "6" }} className='h--100'>
												<Heading as='p'>{t("orders.addressInfo")}</Heading>
												<ListGroup elevation='none' className='outline'>
													<ListHeading>{t("orders.country")}</ListHeading>
													<ListGroup.Item>
														<ListText>{order?.country ?? <span className='text--opaque'>N/A</span>}</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.city")}</ListHeading>
													<ListGroup.Item>
														<ListText>{order?.city ?? <span className='text--opaque'>N/A</span>}</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.zipCode")}</ListHeading>
													<ListGroup.Item>
														<ListText>{order?.zipCode ?? <span className='text--opaque'>N/A</span>}</ListText>
													</ListGroup.Item>
													<ListHeading>
														{t("orders.streetName") ?? <span className='text--opaque'>N/A</span>}
													</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.streetName ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.streetNumber")}</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.streetNumber ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
												</ListGroup>
											</Flex.Col>
											<Flex.Col col={{ base: "12", xl: "6" }}>
												<Heading as='p'>{t("orders.clientInfo")}</Heading>
												<ListGroup elevation='none' className='outline'>
													<ListHeading>{t("orders.agentName")}</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.receiverAgentName ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.agentPhone")}</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.receiverAgentPhone ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.receiverName")}</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.receiverName ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.phone")}</ListHeading>
													<ListGroup.Item>
														<ListText>{order?.phone ?? <span className='text--opaque'>N/A</span>}</ListText>
													</ListGroup.Item>
													<ListHeading>{t("orders.email")}</ListHeading>
													<ListGroup.Item>
														<ListText>{order?.email ?? <span className='text--opaque'>N/A</span>}</ListText>
													</ListGroup.Item>
												</ListGroup>
											</Flex.Col>
											<Flex.Col col='12'>
												<Heading as='p'>{t("orders.additionalInfo")}</Heading>
												<ListGroup elevation='none' className='outline'>
													<ListHeading>{t("orders.customerNote")}</ListHeading>
													<ListGroup.Item>
														<ListText>
															{order?.customerNote ?? <span className='text--opaque'>N/A</span>}
														</ListText>
													</ListGroup.Item>
												</ListGroup>
											</Flex.Col>
										</Flex>
									</Collapse.Content>
								</Collapse>
							</Flex.Col>
							<Flex.Col className='w--100'>
								<Card>
									<Card.Header>
										<Heading as='p' className='mb--0'>
											{t("orders.orderProgress")}
										</Heading>
									</Card.Header>
									<Card.Body>Progress</Card.Body>
								</Card>
							</Flex.Col>
						</Flex>
					</Flex.Col>
					<Flex.Col col='auto' className='temat__view__aside'>
						<Card className='temat__view__aside__card'>
							<Card.Body>Prducts</Card.Body>
						</Card>
					</Flex.Col>
				</Flex>
			</PageContent>
		</PageWrapper>
	);
};

export default OrdersViewPage;
