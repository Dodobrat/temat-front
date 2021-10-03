const PhoneCode = ({ data }) => (
	<span style={{ display: "flex", alignItems: "center" }}>
		<img
			src={data?.flag}
			alt={data?.country ?? data?.code}
			style={{ height: "1em", width: "1em", marginRight: "0.5rem", overflow: "hidden" }}
		/>{" "}
		{data?.code}
	</span>
);

export default PhoneCode;
