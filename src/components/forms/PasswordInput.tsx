import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Flex, InputComponent } from "@dodobrat/react-ui-kit";

import { IconEyeCrossed, IconEye } from "../ui/icons";

const PasswordInput = forwardRef((props: any, ref) => {
	const { t } = useTranslation();

	const [isVisible, setIsVisible] = useState(false);

	const toggleVisible = () => setIsVisible((prev) => !prev);

	return (
		<Flex wrap='nowrap' align='center' spacingX={null} className='w--100'>
			<Flex.Col>
				<InputComponent {...props} placeholder={t("field.password")} type={isVisible ? "text" : "password"} ref={ref} />
			</Flex.Col>
			<Flex.Col col='auto' className='ml--1'>
				<Button as='span' equalDimensions pigment='default' onClick={toggleVisible}>
					{isVisible ? <IconEyeCrossed /> : <IconEye />}
				</Button>
			</Flex.Col>
		</Flex>
	);
});

export default PasswordInput;
