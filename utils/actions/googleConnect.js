// app/actions/googleAuth.js

"use server";

import { redirect } from "next/navigation";
import axios from "axios";

export async function authConsentScreen() {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const redirectUri = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .redirect_uris[0];
  const scope = "https://www.googleapis.com/auth/photoslibrary.readonly";
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`;

  redirect(url);
}

export async function codeForRefreshToken(code) {
  if (!code) {
    throw new Error("No code was given for exchange");
  }
  const res = await getNewRefreshToken(code);
  return { token: res.refresh_token };
}

export async function exchangeRefreshTokenForAccessToken(googlePhotosToken) {
  if (!googlePhotosToken) {
    throw new Error("No token was passed");
  }
  const res = await getNewAccessToken(googlePhotosToken);
  return { token: res.access_token };
}

async function getNewRefreshToken(code) {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const clientSecret = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .client_secret;
  const redirectUri = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .redirect_uris[0];
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  };

  const axioConfig = {
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: data,
  };

  try {
    const response = await axios(axioConfig);
    return response.data;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    throw error;
  }
}

async function getNewAccessToken(refresh_token) {
  const clientId = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web.client_id;
  const clientSecret = JSON.parse(process.env.WEBAPP_CONTEXT_SCREEN).web
    .client_secret;
  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token,
    grant_type: "refresh_token",
  };

  const axioConfig = {
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: data,
  };

  try {
    const response = await axios(axioConfig);
    return response.data;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}
