import React from "react";
import classes from "./Modal.module.css";
const PopupModal = (props) => {
  return (
    <>
      <div className={classes.backdrop} onClick={props.onClick} />

      <dialog open={true} className={classes.modal}>
        {props.children}
      </dialog>
    </>
  );
};

export default PopupModal;
