import s from "./Label.module.scss";
import React from "react";

const Label = ({ Icon, text }) => {
  return (
    <div className={s.container}>
      <div className={s.icon}>
        <Icon />
      </div>
      <span className={s.label}>{text}</span>
    </div>
  );
};

export default Label;
