import React from "react";
import { Badge, Table } from "@dodobrat/react-ui-kit";
import { useMemo } from "react";
import { Flex } from "@dodobrat/react-ui-kit";

interface Props {
	cell: any;
}
const PermissionRolesCell = (props: Props) => {
	const { cell, ...rest } = props;

	const roles = useMemo(() => {
		if (cell.value) {
			const explodedRoles = cell.value.split(",");
			const parsedRoles = [];

			for (const role of explodedRoles) {
				parsedRoles.push(role.split(":").pop());
			}

			return parsedRoles;
		}
		return [];
	}, [cell.value]);

	return (
		<Table.Cell {...rest}>
			<Flex wrap='nowrap' spacingX='xs'>
				{roles?.map((role) => (
					<Flex.Col key={role} col='auto'>
						<Badge pigment='warning'>{role}</Badge>
					</Flex.Col>
				))}
			</Flex>
		</Table.Cell>
	);
};

export default PermissionRolesCell;
