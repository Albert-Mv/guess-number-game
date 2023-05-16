import s from "./ControlPanel.module.scss";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import NumUpDown from "../../components/NumUpDown/NumUpDown";
import Button from "../../components/Button/Button";
import {
  setMultiplyer,
  setPoints,
  setSpeed,
} from "../../redux/slices/userSlice";
import { DataGrid } from "@mui/x-data-grid";
import { Slider } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SpeedIcon from "@mui/icons-material/Speed";
import { createTheme } from "@mui/material/styles";
import { setGameFinished, setGameStarted, setGuessNumber, setPlayers } from "../../redux/slices/gameSlice";

const ControlPanel = () => {
  const dispatch = useDispatch();
  const isGameFinished = useSelector(state=>state.game.isGameFinished);
  const name = useSelector(state=>state.user.name);
  const players = useSelector(state=>state.game.players);
  const socket = useSelector((state) => state.socket.socket);
  const points = useSelector((state) => state.user.points);
  const multiplyer = useSelector((state) => state.user.multiplyer);
  const speed = useSelector((state) => state.user.speed);

  const getSetters = () => {
    return (
      <div className={s.settersWrapper}>
        <NumUpDown
          title={"Points"}
          value={points}
          step={25}
          setter={(val) => dispatch(setPoints(val))}
        />
        <NumUpDown
          title={"Multiplyer"}
          value={multiplyer}
          step={0.25}
          setter={(val) => dispatch(setMultiplyer(val))}
        />
      </div>
    );
  };

  const startGame = () => {
    socket.emit("start_game", {
      name,
      multiplyer,
      points,
    })
  };

  const rows = players.map((item, index) => {
    return {
      id: index,
      ...item
    }
  });
    // [
    // { id: 1, name: "Thomas", point: "100", multiplyer: "1" },
    // { id: 2, name: "Jhon", point: "200", multiplyer: "2" },
    // { id: 3, name: "Doe", point: "150", multiplyer: "1.25" },
  // ];

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "points", headerName: "Point" },
    { field: "multiplyer", headerName: "Multiplyer" },
  ];

  const getBlockTitle = useCallback((Icon, text) => {
    return (
      <div className={s.roundTitle}>
        <Icon fontSize="small" />
        <span>{text}</span>
      </div>
    );
  }, []);

  const currentRoundBlock = () => {
    return (
      <div>
        {getBlockTitle(EmojiEventsIcon, "Current Round")}
        <DataGrid
          style={{ color: "#b2b5bc", borderColor: "#474c53" }}
          hideFooter
          columnHeaderHeight={20}
          rowHeight={30}
          columns={columns}
          rows={rows}
          getRowClassName={(params) =>
            params.row.isWinner && isGameFinished ?  s.green :
            params.indexRelativeToCurrentPage % 2 === 0 ? s.white : s.black
          }
        />
      </div>
    );
  };

  const theme = createTheme({
    overrides: {
      MuiSlider: {
        marks: { color: "#b2b5bc" },
        track: { background: "linear-gradient(-90deg, #e8725b, #d54f84)" },
        rail: { background: "linear-gradient(-90deg, #e8725b, #d54f84)" },
      },
    },
  });

  const speedBlock = () => {
    const marks = [
      {
        value: 1,
        label: "x1",
      },
      {
        value: 2,
        label: "x2",
      },
      {
        value: 3,
        label: "x3",
      },
      {
        value: 4,
        label: "x4",
      },
      {
        value: 5,
        label: "x5",
      },
    ];
    const CustomSliderStyles = {
      "& .MuiSlider-thumb": {
        background: "linear-gradient(-90deg, #e8725b, #d54f84)",
      },
      "& .MuiSlider-track": {
        background: "linear-gradient(-90deg, #e8725b, #d54f84)",
      },
      "& .MuiSlider-rail": {
        background: "#b2b5bc",
      },
      "& .MuiSlider-markLabel": {
        color: "white",
      },
      color: "#d54f84",
    };

    return (
      <div>
        {getBlockTitle(SpeedIcon, "Speed")}
        <div className={s.slider}>
          <Slider
            onChangeCommitted={(e, val) => {
              dispatch(setSpeed(val));
            }}
            theme={theme}
            aria-label="Speed"
            defaultValue={speed}
            sx={CustomSliderStyles}
            valueLabelDisplay="auto"
            marks={marks}
            step={0.01}
            min={1}
            max={5}
          />
        </div>
      </div>
    );
  };

  const header = () => {
    return (
      <>
        {getSetters()}
        <Button title={"Start"} onClick={startGame} />
      </>
    );
  };

  useEffect(() => {
    socket.on("game_started", (data) => {
      dispatch(setPlayers(data.players));
      dispatch(setGuessNumber(data.guessNumber));
      dispatch(setGameStarted(true));
      dispatch(setGameFinished(false));
    });

    return () => {
      socket.off("game_started");
    };
  }, []);

  return (
    <div className={s.container}>
      {header()}
      {currentRoundBlock()}
      {speedBlock()}
    </div>
  );
};

export default ControlPanel;
