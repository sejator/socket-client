import { io } from "socket.io-client";
import getEnvConfig from "./env";
import axios from "axios";

const env = getEnvConfig();

async function notifTelegram(pesan: string, chat_id?: string, parse_mode: string = "html") {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?`;
  const text = {
    channel: env.SOCKET_CHANNEL,
    location: env.SOCKET_LOCATION,
    message: pesan,
  };
  const message = `<pre>${JSON.stringify(text, null, 2)}</pre>`;
  axios
    .post(url, {
      chat_id: chat_id === undefined ? env.CHAT_ID : chat_id,
      text: message,
      parse_mode: parse_mode,
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });
}

async function sendWebhook(payload: any) {
  const url = env.CLIENT_URL;
  if (!url) {
    console.error("CLIENT_URL tidak ditemukan di environment variables");
    return;
  }

  axios
    .post(url, payload)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

const socket = io(env.SOCKET_URL, {
  auth: {
    token: env.SOCKET_TOKEN,
  },
  query: {
    channel: env.SOCKET_CHANNEL,
  },
});

// cek koneksi websoket
socket.on("connect", () => {
  console.log("OK websocket connecting...");
  notifTelegram("OK websocket connecting...");
});

// koneksi websoket terputus
socket.on("disconnect", (reason) => {
  console.log(reason);
  notifTelegram(`Koneksi terputus : ${reason}`);
  if (reason === "io server disconnect") {
    // koneksi terputus, coba ulang koneksi manual
    socket.connect();
  }
});

// koneksi error karena parameter auth token dan query param channel tidak diisi
socket.on("connect_error", (err) => {
  console.log(err.message);
  notifTelegram(`Koneksi error : ${err.message}`);
});

// websoket error
socket.on("error", (error) => {
  console.log("Websoket error", error);
  notifTelegram(`Websoket error : ${error}`);
});

// koneksi websoket gagal
socket.on("reconnect_failed", () => {
  console.log("reconnect_failed");
  notifTelegram(`Koneksi gagal`);
});

// menerima data yang di kirim dari websocket
socket.on("transaksi", (payload) => {
  sendWebhook(payload);
  notifTelegram(JSON.parse(payload));
});
