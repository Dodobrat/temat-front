interface Props {
	children?: React.ReactNode;
}

const SettingsWrapper = ({ children }: Props) => {
	return (
		<div className='d--grid' style={{ gap: "0.625rem" }}>
			{children}
		</div>
	);
};

export default SettingsWrapper;
