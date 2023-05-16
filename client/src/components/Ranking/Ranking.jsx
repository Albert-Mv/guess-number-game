import BarChartIcon from "@mui/icons-material/BarChart";
import s from "./Ranking.module.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useSelector } from "react-redux";

const Ranking = () => {
  const isGameFinished = useSelector(state => state.game.isGameFinished);
  const players = useSelector((state) => state.game.players);
  const username = useSelector(state=>state.user.name);
  console.log(players)
  const rows = players.map((item, index) => {
    return {
      id: index + 1,
      name: username ? item.name : "-",
      score: isGameFinished && !players.some(item=>!item.isReady) ? (item.points * item.multiplyer).toFixed(2) : "-",
      isWinner: item?.isWinner || false,
    };
  });

  const columns = [
    { field: "id", headerName: "No" },
    { field: "name", headerName: "Name" },
    { field: "score", headerName: "Score" },
  ];

  return (
    <div className={s.container}>
      <div className={s.title}>
        <BarChartIcon fontSize="small" />
        <span>Ranking</span>
      </div>
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

export default Ranking;
