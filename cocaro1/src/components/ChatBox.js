import React, { useEffect, useRef, useState } from "react";
import "../../src/assets/board.css";
import socketIOClient from "socket.io-client";

const host = "http://localhost:4002";

export default function ChatBox({ handleOffShowChat }) {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const socketRef = useRef();
  const messagesEnd = useRef();
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("getId", (data) => {
      setId(data.id);
    });

    socketRef.current.on("sendDataServerMess", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
      setId(dataGot.data.id);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: userLogin.id,
      };
      socketRef.current.emit("sendDataClientMess", msg);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${
        m.id === userLogin.id ? "your-message" : "other-people"
      } chat-item`}
    >
      <span className="text-dark">{m.content}</span>
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
  return (
    <div className="chat-box bg-light ms-3 p-3">
      <div className="d-flex justify-content-between align-items-center">
        <p className="p-0 m-0">Chat</p>
        <button onClick={handleOffShowChat} className="btn btn-light">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="box-chat_message border rounded">
        {renderMess}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>
      <div className="d-flex send-mess mt-2">
        <input
          value={message}
          onKeyDown={onEnterPress}
          onChange={handleChange}
          type="text"
          className="border rounded me-2 w-100"
        />
        <div>
          <button className="btn btn-success" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
