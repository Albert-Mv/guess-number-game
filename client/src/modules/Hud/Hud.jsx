import s from "./Hud.module.scss";
import React, { useEffect } from "react";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useDispatch, useSelector } from "react-redux";
import Label from "../../components/Label/Label";
import LineChart from "../../components/LineChart/LineChart";
import { setScore } from "../../redux/slices/userSlice";

const Hud = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.game.players);
  const isGameFinished = useSelector(state=>state.game.isGameFinished);
  const score = useSelector((state) => state.user.score);
  const username = useSelector((state) => state.user.name);
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  useEffect(() => {
    if (isGameFinished) {
      players.map((item) => {
        if (item.name == username) {
          if (item?.isWinner) {
            dispatch(setScore(score + item.points * item.multiplyer));
          } else {
            dispatch(setScore(score - item.points * item.multiplyer));
          }
        }
      });
    }
  }, [isGameFinished]);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <Label Icon={AccountCircleIcon} text={score} />
        <Label Icon={WorkspacePremiumIcon} text={username} />
        <Label Icon={AccessTimeIcon} text={`${hour}:${minute}`} />
      </div>
      <LineChart />
    </div>
  );
};

export default Hud;
