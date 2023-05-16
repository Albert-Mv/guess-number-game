import React from "react";
import classNames from "classnames";
import arrow from "../../media/arrow.png";
import s from "./NumUpDown.module.scss";

const NumUpDown = ({ title, value, step, setter }) => {
  const onDec = () => {
    setter(value - step);
  };

  const onInc = () => {
    setter(value + step);
  };

  const onChange = (e) => {
    setter(Number(e.target.value));
  };

  return (
    <div className={classNames([s.container, s.column, s.center])}>
      <span className={s.title}>{title}</span>
      <div className={s.row}>
        <div className={s.arrowWrapper} onClick={onDec}>
          <img className={s.arrowTop} src={arrow} />
        </div>
        <input
          className={s.styledInput}
          value={value}
          type="number"
          onChange={onChange}
        />
        <div className={s.arrowWrapper} onClick={onInc}>
          <img className={s.arrowBot} src={arrow} />
        </div>
      </div>
    </div>
  );
};

export default NumUpDown;
