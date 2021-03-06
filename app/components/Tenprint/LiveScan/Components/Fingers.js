import React from 'react';
import Svg from "../../../Svg/Svg";


export const Small = (props) => (
	<Svg
		id={props.id}
		className={`one smallfinger ${ props.className }`}
		width="35"
		height="180"
		viewBox="-5 0 38 165"
		d="M 12.9799 -9.03782e-07C 20.1448 -9.03782e-07 25.9597 7.18409 25.9597 13.0145L 25.9597 100.963C 25.9597 108.147 20.1542 113.978 12.9799 113.978C 5.81489 113.978 -1.67984e-06 106.794 -1.67984e-06 100.963L -1.67984e-06 13.0145C -1.67984e-06 5.83041 5.8055 -9.03782e-07 12.9799 -9.03782e-07Z"
	/>
);

export const Ring = (props) => (
	<Svg
		id={props.id}
		className={`two ringfinger ${ props.className }`}
      width="35"
      height="180"
      viewBox="-5 0 38 168"
      d="M 12.9799 0C 20.1448 0 25.9597 7.18409 25.9597 13.0145L 25.9597 141.854C 25.9597 149.038 20.1542 154.869 12.9799 154.869C 5.81489 154.869 0 147.684 0 141.854L 0 13.0145C 0 5.83041 5.80549 0 12.9799 0Z"
	/>
);

export const Middle = (props) => (
	<Svg
		id={props.id}
		className={`three middlefinger ${ props.className }`}
    width="35"
    height="180"
    viewBox="-5 0 38 168"
    d="M 12.9799 0C 20.1448 0 25.9597 7.18409 25.9597 13.0145L 25.9597 158.816C 25.9597 166 20.1542 171.83 12.9799 171.83C 5.81489 171.83 0 164.646 0 158.816L 0 13.0145C 0 5.83041 5.80549 0 12.9799 0Z"
	/>
);

export const Index = (props) => (
	<Svg
		id={props.id}
		className={`four indexfinger ${ props.className }`}
    width="35"
    height="180"
    viewBox="-5 0 38 168"
    d="M 12.9799 0C 20.1448 0 25.9597 7.18409 25.9597 13.0145L 25.9597 144.277C 25.9597 151.461 20.1542 157.292 12.9799 157.292C 5.81489 157.292 0 150.108 0 144.277L 0 13.0145C 0 5.83041 5.80549 0 12.9799 0Z"
	/>
);

export const Thumb = (props) => (
	<Svg
		id={props.id}
		className={`five thumb ${ props.className }`}
    width="35"
    height="250"
    viewBox="-5 0 38 200"
    d="M 13.4654 0C 20.6344 0 26.4415 7.18813 26.4415 13.0107L 25.9522 81.2798C 25.9522 88.468 20.1448 94.2905 12.9761 94.2905C 5.8071 94.2905 0 87.1024 0 81.2798L 0.489296 13.0107C 0.489296 5.8226 6.29666 0 13.4654 0Z"
	/>
);

export const UpperPalm = (props) => (
	<Svg
    id={props.id}
    className={`middle normal-finger ${props.className}`}
    width="0"
    height="0"
    // d="M 15.1061 0.000258279C 16.5456 0.000258279 17.7116 7.14877 17.7116 12.9393L 17.7116 114.571C 17.7116 121.719 16.5455 127.51 15.1061 127.51C 14.0716 127.51 7.27879 127.51 3.15414 127.51C 0 127.51 4.67653e-19 116.2 4.67653e-19 114.571L 4.67653e-19 12.9393C 4.67653e-19 10.928 0 0.000302661 3.15414 0.000520163C 5.09515 -0.000470421 14.0716 0.000258279 15.1061 0.000258279Z"
	/>
);

export const LowerPalm = (props) => (
	<Svg
    id={props.id}
    className={`palm normal-finger ${props.className}`}
    width={ props.width || "250" }
    height="130"
    d="M 58.9136 0.000258279C 64.5278 0.000258279 69.0754 7.14877 69.0754 12.9393L 69.0754 114.571C 69.0754 121.719 64.5275 127.51 58.9136 127.51C 54.8791 127.51 28.3873 127.51 12.3012 127.51C 0 127.51 1.82385e-18 116.2 1.82385e-18 114.571L 1.82385e-18 12.9393C 1.82385e-18 10.928 0 0.000302661 12.3012 0.000520163C 19.8711 -0.000470421 54.8792 0.000258279 58.9136 0.000258279Z"
	/>
);


export const WriterPalm = (props) => (
	<Svg
		id={props.id}
		className={`palm normal-finger ${ props.className }`}
    width="35"
    height="80"
    viewBox="0 0 40 70"
    d="M 13.4654 0C 20.6344 0 26.4415 7.18813 26.4415 13.0107L 25.9522 81.2798C 25.9522 88.468 20.1448 94.2905 12.9761 94.2905C 5.8071 94.2905 0 87.1024 0 81.2798L 0.489296 13.0107C 0.489296 5.8226 6.29666 0 13.4654 0Z"
	/>
);



// export const UpperPalm = (props) => (
//   <Svg
//     id={props.id}
//     className={`middle normal-finger ${props.className}`}
//     width={ props.width || "150" }
//     height={ props.height || "150" }
//     d="M 15.1061 0.000258279C 16.5456 0.000258279 17.7116 7.14877 17.7116 12.9393L 17.7116 114.571C 17.7116 121.719 16.5455 127.51 15.1061 127.51C 14.0716 127.51 7.27879 127.51 3.15414 127.51C 0 127.51 4.67653e-19 116.2 4.67653e-19 114.571L 4.67653e-19 12.9393C 4.67653e-19 10.928 0 0.000302661 3.15414 0.000520163C 5.09515 -0.000470421 14.0716 0.000258279 15.1061 0.000258279Z"
//   />
// );
