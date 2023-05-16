import s from "./App.module.scss";
import { useEffect } from "react";
import { setName } from "./redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import ControlPanel from "./modules/ControlPanel/ControlPanel";
import Onboarding from "./modules/Onboarding/Onboarding";
import Hud from "./modules/Hud/Hud";
import Ranking from "./components/Ranking/Ranking";
import Chat from "./components/Chat/Chat";
import { setPlayers } from "./redux/slices/gameSlice";

const App = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    socket.on("users_updated", (data) => {
      dispatch(setPlayers(data.players));
    });
  }, []);

  const loadUser = () => {
    const user = localStorage.getItem("username");

    if (user) {
      dispatch(setName(user));
    }
  };

  useEffect(() => {
    if (!name) {
      loadUser();
    }
  }, []);

  return (
    <div className={s.app}>
      <div className={classNames(s.row, s.stretchH, s.stretchV)}>
        <div className={s.controller}>
          {name ? <ControlPanel /> : <Onboarding />}
        </div>
        <div className={s.chartWrapper}>
          <Hud />
        </div>
      </div>
      <div className={classNames(s.row, s.stretchH)}>
        <Ranking />
        <Chat />
      </div>
    </div>
  );
};

export default App;
