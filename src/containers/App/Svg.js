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
			<g id="svg-smile">
				<path d="M18.5 9.5C18.5 14.4706 14.4706 18.5 9.5 18.5C4.52944 18.5 0.5 14.4706 0.5 9.5C0.5 4.52944 4.52944 0.5 9.5 0.5C14.4706 0.5 18.5 4.52944 18.5 9.5Z" fill="transparent"/>
				<path fillRule="evenodd" clipRule="evenodd" d="M2 2C2 3.10461 1.55273 4 1 4C0.447266 4 0 3.10461 0 2C0 0.895386 0.447266 0 1 0C1.55273 0 2 0.895386 2 2ZM7 2C7 3.10461 6.55273 4 6 4C5.44727 4 5 3.10461 5 2C5 0.895386 5.44727 0 6 0C6.55273 0 7 0.895386 7 2Z" transform="translate(6 6)" stroke="transparent"/>
				<path fillRule="evenodd" clipRule="evenodd" d="M0 0C0.5 1 2 3.5 5 3.5C8 3.5 9.50773 0.984539 10 0C8.5 1.5 6.5 2 5 2C3.5 2 1.5 1.5 0 0Z" transform="translate(4.5 11)" stroke="transparent"/>
			</g>
			<g id="svg-mic">
				<path d="M1 0V1.5" transform="translate(5.5 19)" strokeLinecap="square" fill="transparent"/>
				<path d="M0.5 1.5H10.5" transform="translate(1 20)"strokeLinecap="square" fill="transparent"/>
				<path d="M0 0C0 0 0 2.5 0 5C0 7.5 1.50694 10.5 6 10.5C10.4931 10.5 12 7.5 12 5C12 2.5 12 0 12 0" transform="translate(0.5 8)" fill="transparent"/>
				<path d="M8.5 13C8.5 14.105 8.06315 14.9647 7.36453 15.5558C6.65759 16.154 5.65343 16.5 4.5 16.5C3.34657 16.5 2.34241 16.154 1.63547 15.5558C0.936851 14.9647 0.5 14.105 0.5 13V4C0.5 2.89496 0.936851 2.03533 1.63547 1.44419C2.34241 0.846013 3.34657 0.5 4.5 0.5C5.65343 0.5 6.65759 0.846013 7.36453 1.44419C8.06315 2.03533 8.5 2.89496 8.5 4V13Z" transform="translate(2)" fill="transparent"/>
				<path fillRule="evenodd" clipRule="evenodd" d="M4 0V1H5V0H4ZM4 5V4H5V5H4ZM4 7V6H5V7H4ZM2 6V7H3V6H2ZM0 7V6H1V7H0ZM2 4V5H3V4H2ZM0 5V4H1V5H0ZM2 1V0H3V1H2ZM0 0V1H1V0H0ZM4 3V2H5V3H4ZM2 2V3H3V2H2ZM0 3V2H1V3H0Z" transform="translate(4 5)" stroke="transparent"/>
			</g>
			<g id="svg-share">
				<path d="M18.5 9.5C18.5 14.4706 14.4706 18.5 9.5 18.5C4.52944 18.5 0.5 14.4706 0.5 9.5C0.5 4.52944 4.52944 0.5 9.5 0.5C14.4706 0.5 18.5 4.52944 18.5 9.5Z" fill="transparent"/>
				<path d="M0 0V7H1V0H0Z" transform="translate(9 7)" stroke="transparent"/>
				<path d="M0 6L5 0L10 6L5 2L0 6Z" transform="translate(4.5 5)" stroke="transparent"/>
			</g>
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
