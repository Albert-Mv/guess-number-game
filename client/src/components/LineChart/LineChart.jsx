import s from "./LineChart.module.scss";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  setGameFinished,
  setGameStarted,
  setGuessNumber,
} from "../../redux/slices/gameSlice";

const LineChart = () => {
  const dispatch = useDispatch();
  const speed = useSelector((state) => state.user.speed);
  const guessNumber = useSelector((state) => state.game.guessNumber);
  const isGameFinished = useSelector(state=> state.game.isGameFinished);
  const isGameStarted = useSelector((state) => state.game.isGameStarted);
  const interval = useRef(null);
  const [points, setPoints] = useState([]);
  const [time, setTime] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const defautTime = 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;
    canvas.height = canvasRef.current.clientHeight;
    canvas.width = canvasRef.current.clientWidth;
    setHeight(canvasRef.current.clientHeight);
    setWidth(canvasRef.current.clientWidth);

    const context = canvas.getContext("2d");
    context.fillStyle = "#242734";
    context.fillRect(
      0,
      0,
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    contextRef.current = context;
    drawScale(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
  }, []);

  useEffect(() => {
    const numFromTime = (Math.round((time / defautTime) * 1000)/100).toFixed(2);
    console.log(numFromTime);
    if (time >= defautTime || numFromTime == guessNumber) {
      dispatch(setGameStarted(false));
      dispatch(setGameFinished(true));
      setTime(0);
    }
  }, [time]);

  useEffect(() => {
    if (isGameStarted) {
      let x = 0;
      let y = 0;
      interval.current = setInterval(() => {
        cleanCanvas();
        if (time < defautTime) {
          x = (time / defautTime) * (width - 40) + 20;
          y =
            height -
            (Math.pow(time, 3) / Math.pow(defautTime, 3)) * (height - 160) -
            80;
          points.push({ x, y });
          setPoints(() => points);
          fillBackground();
          drawScale(width, height);
          drawLine();
          drawDot(x, y);
          drawText();
          setTime((time) => time + 1);
        }
      }, 10 / speed);
    }

    return () => clearInterval(interval.current);
  }, [isGameStarted, time]);

  const drawDot = (x, y) => {
    contextRef.current.beginPath();
    contextRef.current.fillStyle = "#f3c24d";
    contextRef.current.arc(x, y, 10, 0, 2 * Math.PI, true);
    contextRef.current.closePath();
    contextRef.current.fill();
  };

  const drawScale = (width, height) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(20, height - 80);
    contextRef.current.lineTo(width - 20, height - 80);
    contextRef.current.lineCap = "round";
    contextRef.current.strokeStyle = "#707580";
    contextRef.current.lineWidth = 2;
    contextRef.current.textAlign = "center";
    contextRef.current.fillStyle = "#707580";
    contextRef.current.font = "12px Arial";
    for (let i = 0; i < 11; i++) {
      contextRef.current.fillText(i, 20 + (i * (width - 40)) / 10, height - 60);
    }
    contextRef.current.closePath();
    contextRef.current.stroke();
  };

  const fillBackground = () => {
    contextRef.current.fillStyle = "#242734";
    contextRef.current.fillRect(0, 0, width, height);
  };

  const drawLine = () => {
    if (points.length > 2) {
      contextRef.current.beginPath();
      points.map((item, index) => {
        if (index > 1) {
          const { x, y } = item;
          contextRef.current.moveTo(x, y);
          const { x: x1, y: y1 } = points[index - 1];
          contextRef.current.lineTo(x1, y1);
        }
      });
      contextRef.current.lineCap = "round";
      contextRef.current.strokeStyle = "#e55c57";
      contextRef.current.lineWidth = 3;
      contextRef.current.closePath();
      contextRef.current.stroke();
    }
  };

  const cleanCanvas = () => {
    contextRef.current.clearRect(0, 0, width, height);
  };

  const drawText = () => {
    contextRef.current.beginPath();
    contextRef.current.textAlign = "center";
    contextRef.current.fillStyle = "white";
    contextRef.current.font = "60px Arial";
    contextRef.current.fillText(
      `${(Math.round((time / defautTime) * 1000)/100).toFixed(2)}`,
      width / 2,
      height / 2
    );
    contextRef.current.closePath();
  };

  return <canvas className={s.container} ref={canvasRef}></canvas>;
};

export default LineChart;
