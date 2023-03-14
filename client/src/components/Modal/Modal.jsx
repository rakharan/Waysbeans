import React from "react";
import classes from "./Modal.module.css";
const Modal = (props) => {
  return (
    <>
      <div className={classes.backdrop} onClick={props.onClick} />

      <dialog open={true} className={classes.modal}>
        {props.children}
      </dialog>
    </>
  );
};

export default Modal;
