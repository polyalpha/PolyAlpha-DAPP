import React, { Component, Fragment } from 'react';


export const SvgIcons = () => (
	<svg width="0" height="0" className="hide">
		<defs>
			<path id="svg-back" fillRule="evenodd" clipRule="evenodd"
						d="M8 1.39746L6.76953 0L0 7.68579L0.277344 8L0 8.31421L6.76953 16L8 14.6025L2.18555 8L8 1.39746Z"
						strokeWidth="0"/>
			<path id="svg-crown"
						d="M27 0L20.25 6.66667L13.5 0L6.75 6.66667L0 0V18.3333C0 19.2538 0.75552 20 1.6875 20H25.3125C26.2445 20 27 19.2538 27 18.3333V0Z"
						strokeWidth="0"/>
			<path id="svg-lightning" d="M7.87037 0L0 14.0741H6.85185L5.55556 25L13.4259 10H6.85185L7.87037 0Z"
						transform="translate(1 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<path id="svg-select"
						d="M6 4.31137L1.72153 0.278417C1.3277 -0.0928057 0.68919 -0.0928057 0.295367 0.278417C-0.0984557 0.64964 -0.0984557 1.25151 0.295367 1.62273L6 7L11.7046 1.62273C12.0985 1.25151 12.0985 0.64964 11.7046 0.278417C11.3108 -0.0928057 10.6723 -0.0928057 10.2785 0.278417L6 4.31137Z"
						strokeWidth="0"/>
		</defs>
	</svg>
)


export const Svg = (props) => {
	let {id, className, ...params} = props;
	let cc = `svg ${id} ${(className || "")}`.trim();
	return (
		<svg className={cc} {...params}>
			<use xlinkHref={"#"+id} />
		</svg>
	)
};
