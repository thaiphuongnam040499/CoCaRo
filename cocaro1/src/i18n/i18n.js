import React from "react";
import { createRoot } from "react-dom/client";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          login: "Login",
          username: "Username",
          pass: "Password",
          signIn: "Sign in",
          playMachine: "Play Machine",
          createRoom: "Create room",
          playFriend: "Play with friends",
          exits: "Exit",
          player: "Player",
          wait: "Wait for the opponent to enter the room",
          you: "You",
          chat: "Chat box",
          playAgain: "Play Again",
          giveIn: "Give In",
          ready: "Ready",
          unReady: "Cancel ready",
          winner: "Winner",
          next: "Next player",
          seconds: "seconds",
          register: "Register",
          rePass: "RePassword",
          send: "Send",
        },
      },
      vi: {
        translation: {
          login: "Đăng nhập",
          username: "Tên đăng nhập",
          pass: "Mật khẩu",
          signIn: "Đăng nhập",
          playMachine: "Chơi với máy",
          createRoom: "Tạo phòng",
          playFriend: "Chơi với bạn bè",
          exits: "Thoát",
          player: "Đối thủ",
          wait: "Chờ đối thủ vào phòng",
          you: "Bạn",
          chat: "Khung chat",
          playAgain: "Chơi lại",
          giveIn: "Đầu hàng",
          ready: "Sãn sàng",
          unReady: "Hủy sẵn sàng",
          winner: "Chiến thắng",
          next: "Lượt tiếp theo",
          seconds: "Giây",
          register: "Đăng ký",
          rePass: "Nhập lại mật khẩu",
          send: "Gửi",
        },
      },
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
