import React, { useEffect, useRef, useState } from "react";
import "../../src/assets/board.css";
import socketIOClient from "socket.io-client";
import { useTranslation } from "react-i18next";

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
    if (message !== "") {
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

  const renderMess = mess.map((m, index) => {
    const formattedContent = formatIcon(m.content);
    return (
      <div
        key={index}
        className={`${
          m.id === userLogin.id ? "your-message" : "other-people"
        } chat-item`}
      >
        <span
          className="text-dark"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </div>
    );
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };
  const { t } = useTranslation();

  function formatIcon(message) {
    //Đây là list icon dùng để duyệt và đổ ra dữ liệu
    const icon = [
      {
        id: 1,
        image: `<img class="w-25 h-25" src='https://s1.img.yan.vn/YanNews/2167221/201612/20161207-041334-f68949ce109e6a2601206ce6f4021463-copy_480x480.jpg' />`,
        category: ":(",
      },
      {
        id: 2,
        image: `<img class="w-25 h-25" src='https://i.pinimg.com/736x/61/8a/74/618a7401f69608d55b14c46e15efbc4b.jpg' />`,
        category: "cut",
      },
      {
        id: 3,
        image: `<img class="w-25 h-25" src='https://vnkings.com/wp-content/uploads/2020/05/tong-hop-icon-mat-cuoi-chat-nhat-13.png' />`,
        category: ":)",
      },
      {
        id: 4,
        image: `<img class="w-25 h-25" src='https://honghot.net/wp-content/uploads/tong-hop-icon-mat-cuoi-chat-nhat-22.png' />`,
        category: ":D",
      },
      {
        id: 5,
        image: `<img class="w-25 h-25" src='https://duoclienthong.edu.vn/anh-mat-cuoi-ngo-nghinh/imager_13_9630_700.jpg' />`,
        category: ";)",
      },
      {
        id: 6,
        image: `<img class="w-25 h-25" src='https://png.pngtree.com/png-clipart/20210418/original/pngtree-red-heart-icon-png-image_6234125.png' />`,
        category: "<3",
      },
    ];
    //Duyệt vòng foreach của list icon để kiểm tra chuỗi truyền vào có tồn tại category không
    //Nếu trong cái chuỗi string đó có tồn tại category của icon thì nó sẽ replace thành thẻ <image>
    icon.forEach((element) => {
      if (message.indexOf(element.category) > -1) {
        console.log("True");
        //Replace
        message = message.replace(element.category, element.image);
      }
    });

    return message;
  }
  //Click hiện danh sách Icon
  const [emotion, setEmotion] = useState(false);
  const onClickEmotion = () => {
    setEmotion(!emotion);
  };

  //Click vào từng icon nó sẽ nhận cái value truyền vào theo từng loại
  const onClickIcon = (value) => {
    setMessage(message + "" + value + " ");
  };
  return (
    <div className="chat-box bg-light ms-3 p-3">
      <div className="d-flex justify-content-between align-items-center">
        <p className="p-0 m-0">{t("chat")}</p>
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
          className="border rounded me-2 w-100 input-chat"
        />
        <i
          onClick={onClickEmotion}
          className="bi bi-emoji-laughing fs-6 btn-icon"
        ></i>
        {emotion ? (
          <div className="show_icon border rounded">
            <div className="list_icon d-flex">
              <div className="icon" onClick={() => onClickIcon(":(")}>
                <img
                  className="img_icon"
                  src="https://s1.img.yan.vn/YanNews/2167221/201612/20161207-041334-f68949ce109e6a2601206ce6f4021463-copy_480x480.jpg"
                  alt=""
                />
              </div>
              <div className="icon" onClick={() => onClickIcon("cut")}>
                <img
                  className="img_icon"
                  src="https://i.pinimg.com/736x/61/8a/74/618a7401f69608d55b14c46e15efbc4b.jpg"
                  alt=""
                />
              </div>
              <div className="icon" onClick={() => onClickIcon(":)")}>
                <img
                  className="img_icon"
                  src="https://vnkings.com/wp-content/uploads/2020/05/tong-hop-icon-mat-cuoi-chat-nhat-13.png"
                  alt=""
                />
              </div>
              <div className="icon" onClick={() => onClickIcon(":D")}>
                <img
                  className="img_icon"
                  src="https://honghot.net/wp-content/uploads/tong-hop-icon-mat-cuoi-chat-nhat-22.png"
                  alt=""
                />
              </div>
              <div className="icon" onClick={() => onClickIcon(";)")}>
                <img
                  className="img_icon"
                  src="https://duoclienthong.edu.vn/anh-mat-cuoi-ngo-nghinh/imager_13_9630_700.jpg"
                  alt=""
                />
              </div>
              <div className="icon" onClick={() => onClickIcon("<3")}>
                <img
                  className="img_icon"
                  src="https://png.pngtree.com/png-clipart/20210418/original/pngtree-red-heart-icon-png-image_6234125.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div>
          <button className="btn btn-success" onClick={sendMessage}>
            {t("send")}
          </button>
        </div>
      </div>
    </div>
  );
}
