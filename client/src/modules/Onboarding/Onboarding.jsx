import s from "./Onboarding.module.scss";
import React, { useCallback, useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { setName } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

const Onboarding = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const [username, setUsername] = useState("");

  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const saveUser = useCallback(() => {
    localStorage.setItem("username", username);
    dispatch(setName(username));
    socket.emit("update_username", {username});
  }, [username]);

  return (
    <div className={classNames(s.container, s.column)}>
      <span className={s.welcome}>Welcome</span>
      <div className={s.content}>
        <span className={s.inputHint}>Please insert Your Name</span>
        <Input value={username} onChange={onChangeUsername} />
        <Button
          title={"Accept"}
          disabled={username?.length < 3}
          onClick={saveUser}
        />
      </div>
      <div></div>
    </div>
  );
};

export default Onboarding;
