import axios from "axios";
import https from "https";
import { getSession } from "next-auth/react";

const base_url = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: base_url,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

instance.interceptors.request.use(async (config) => {
  const session = await getSession();

  config.headers = config.headers || {};
  config.headers.Accept = "application/json;charset=UTF-8";
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  if (session?.user?.auth_token) {
    config.headers.Authorization = `Token ${session.user.auth_token}`;
  }

  return config;
});

export default instance;

