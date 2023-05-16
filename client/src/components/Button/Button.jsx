import React from "react";
import classNames from "classnames";
import s from "./Button.module.scss";

const Button = ({ disabled, title, onClick }) => {
  const styles = classNames(s.container, {
    [s.disabled]: disabled,
  });

  return (
    <div className={styles} {...(disabled ? {} : { onClick: onClick })}>
      <span>{title}</span>
    </div>
  );
};

export default Button;
