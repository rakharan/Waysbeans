import React from "react";

const Button = (props) => {
  return (
    <>
      <button
        onClick={props.onClick}
        className={` w-[100px] h-[30px] rounded-[5px] border-2 border-[#613D2B] font-bold text-sm text-center leading-[17px] transition-all duration-500 ${props.className}`}
        type={props.type}
        value={props.value}
      >
        {props.children}
      </button>
    </>
  );
};

export default Button;
