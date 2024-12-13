import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  SOCKET_URL: string;
  SOCKET_TOKEN: string;
  SOCKET_CHANNEL: string;
  SOCKET_LOCATION: string;
  BOT_TOKEN: string;
  CHAT_ID: string;
  CLIENT_URL: string;
}

const getEnvConfig = (): EnvConfig => {
  return {
    SOCKET_URL: process.env.SOCKET_URL || "",
    SOCKET_TOKEN: process.env.SOCKET_TOKEN || "",
    SOCKET_CHANNEL: process.env.SOCKET_CHANNEL || "",
    SOCKET_LOCATION: process.env.SOCKET_LOCATION || "",
    BOT_TOKEN: process.env.BOT_TOKEN || "",
    CHAT_ID: process.env.CHAT_ID || "",
    CLIENT_URL: process.env.CLIENT_URL || "",
  };
};

export default getEnvConfig;
