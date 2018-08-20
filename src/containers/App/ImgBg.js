import React from "react";
import classNames from "classnames"
import "./ImgBg.scss"


export const ImgBg = ({src, className}) =>
	<i className={classNames("img-bg", className)} style={{backgroundImage: `url(${src})`}} />;
