import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import Input from "../Input/Input";
import s from "./Chat.module.scss";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import React, { useEffect, useState } from "react";
import { recieveMessage, sendMessage } from "../../redux/slices/socketSlice";

const Chat = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.name);
  const messages = useSelector((state) => state.socket.messages);
  const socket = useSelector((state) => state.socket.socket);
  
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = () => {
    dispatch(sendMessage({message, username}))
    setMessage("");
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      dispatch(recieveMessage(data));
    });

    return ()=>{
      socket.off('recieve_message');
    }
  }, [dispatch]);

  console.log(messages)

  return (
    <div className={s.container}>
      <div className={s.title}>
        <QuestionAnswerIcon fontSize="small" />
        <span>Chat</span>
      </div>
      <div className={s.chat}>
        <div className={s.chatMessages}>
          {messages.map((item) => {
            return (<div className={s.chatMessageWrapper}>
              <span className={s.chatMessageSender}>{item.username}:</span>
              <span className={s.chatMessage}>{item.message}</span>
              </div>)
          })}
        </div>
        <div className={s.chatInput}>
          <Input value={message} onChange={onChange} />
          <div className={s.chatButton}>
            <Button
              title={"Send"}
              disabled={!username && message?.length == 0}
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
