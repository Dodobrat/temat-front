import * as React from "react";

function SvgEn(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 60 30"
      ref={svgRef}
      {...props}
    >
      <defs>
        <clipPath id="en_svg__a">
          <path d="M0 0v30h60V0z" />
        </clipPath>
        <clipPath id="en_svg__b">
          <path d="M30 15h30v15zm0 0v15H0zm0 0H0V0zm0 0V0h30z" />
        </clipPath>
      </defs>
      <g clipPath="url(#en_svg__a)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth={6} />
        <g clipPath="url(#en_svg__b)">
          <path d="M0 0l60 30m0-30L0 30" stroke="#c8102e" strokeWidth={4} />
        </g>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth={10} />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth={6} />
      </g>
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgEn);
const MemoForwardRef = React.memo(ForwardRef);
export default MemoForwardRef;
