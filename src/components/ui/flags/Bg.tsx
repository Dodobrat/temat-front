import * as React from "react";

function SvgBg(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 60 36"
      ref={svgRef}
      {...props}
    >
      <path d="M0 0h60v36H0z" fill="#fff" />
      <path d="M0 12h60v24H0z" fill="#00966e" />
      <path d="M0 24h60v12H0z" fill="#d62612" />
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgBg);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
