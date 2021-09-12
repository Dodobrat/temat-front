import { useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useQueryClient } from "react-query";
import { Heading, Flex, Button, ZoomPortal, SlideIn } from "@dodobrat/react-ui-kit";

import { useRoles } from "../../../actions/fetchHooks";
import { useRoleDelete } from "../../../actions/mutateHooks";
import useDataTableGenerate from "../../../hooks/useDataTableGenerate";

import { useAuthContext } from "../../../context/AuthContext";
import { errorToast, successToast } from "../../../helpers/toastEmitter";

import { IconAdd } from "../../../components/ui/icons";
import DataTable from "../../../components/util/DataTable";
import PageWrapper from "../../../components/ui/wrappers/PageWrapper";
import PageHeader from "../../../components/ui/wrappers/PageHeader";
import PageContent from "../../../components/ui/wrappers/PageContent";

const RolesForm = lazy(() => import("./RolesForm"));
const RolesViewDrawer = lazy(() => import("./RolesViewDrawer"));

const RolesPage = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { userCan } = useAuthContext();

	const { mutate: deleteRole } = useRoleDelete({
		queryConfig: {
			onSuccess: (res: any) => {
				successToast(res);
				queryClient.invalidateQueries("roles");
			},
			onError: (err: any) => errorToast(err),
		},
	});

	const { tableProps } = useDataTableGenerate({
		useFetch: useRoles,
		actions: [
			{
				permission: "userRoleView",
				type: "view",
				action: (entry: any) => setViewRole({ state: true, payload: entry }),
			},
			{
				permission: "userRoleEdit",
				type: "edit",
				action: (entry: any) => setShowRolesForm({ state: true, payload: entry }),
			},
			{
				permission: "userRoleDelete",
				type: "delete",
				withConfirmation: true,
				action: (entry: any) => deleteRole(entry.id),
			},
		],
	});

	const [showRolesForm, setShowRolesForm] = useState({ state: false, payload: null });
	const [viewRole, setViewRole] = useState({ state: false, payload: null });

	const closeRolesForm = () => setShowRolesForm((prev) => ({ ...prev, state: false }));
	const closeRoleView = () => setViewRole((prev) => ({ ...prev, state: false }));

	return (
		<PageWrapper>
			<Helmet>
				<title>
					{process.env.REACT_APP_NAME} | {t("common.role", { count: 0 })}
				</title>
			</Helmet>
			<PageHeader>
				<Flex align='center'>
					<Flex.Col>
						<Heading as='p' className='mb--0'>
							{t("common.role", { count: 0 })}
						</Heading>
					</Flex.Col>
					{userCan("userRoleAdd") && (
						<Flex.Col col='auto'>
							<Button onClick={() => setShowRolesForm({ state: true, payload: null })} iconStart={<IconAdd />}>
								{t("action.add")}
							</Button>
						</Flex.Col>
					)}
				</Flex>
			</PageHeader>
			<PageContent>
				<DataTable {...tableProps} />
			</PageContent>
			<Suspense fallback={<div />}>
				<ZoomPortal in={showRolesForm.state}>
					<RolesForm onClose={closeRolesForm} payload={showRolesForm.payload} />
				</ZoomPortal>
				<SlideIn position='right' in={viewRole.state}>
					<RolesViewDrawer onClose={closeRoleView} payload={viewRole.payload} />
				</SlideIn>
			</Suspense>
		</PageWrapper>
	);
};

export default RolesPage;
