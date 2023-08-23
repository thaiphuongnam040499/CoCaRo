import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Board from "./components/Board";
import socketIOClient from "socket.io-client";
const host = "http://localhost:4002";
export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xo, setXo] = useState([]);
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [playerIsX, setPlayerIsX] = useState(true);

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("getId", (data) => {
      setId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
      scrollToBottom();
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      setXo(dataGot.data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
      };
      socketRef.current.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.content}
    </div>
  ));

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };

  const handleClick = (i) => {
    if (checkWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[i] = playerIsX ? "X" : "O";
    socketRef.current.emit("sendDataClient", newSquares);
    setSquares(newSquares);
    setPlayerIsX(!playerIsX);
  };

  const winner = checkWinner(squares);

  let status;
  if (winner) {
    status = "Win: " + winner;
  } else {
    status = "Next player: " + (playerIsX ? "X" : "O");
  }

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <Board squares={xo} onClick={(i) => handleClick(i)} />
        </div>
      </div>
      <div className="game-info">
        <div>{status}</div>
      </div>
      <div className="box-chat">
        <div className="box-chat_message">
          {renderMess}
          <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
        </div>

        <div className="send-box">
          <textarea
            value={message}
            onKeyDown={onEnterPress}
            onChange={handleChange}
            placeholder="Nhập tin nhắn ..."
          />
          <button className="btn-send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
