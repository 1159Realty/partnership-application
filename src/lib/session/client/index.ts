"use client";

import { Session, Token } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { SESSION } from "@/utils/constants";
import { getCookie, setCookie } from "cookies-next/client";

function getClientSession(): Session | null {
  try {
    const sessionValue = getCookie(SESSION);
    let session: Session | null = null;

    if (sessionValue) {
      session = JSON.parse(sessionValue);
    }

    return session;
  } catch (error) {
    console.error(`Unable to retrieve tokens from cookie --client side. Reason= ${error}`);
    return null;
  }
}

async function saveClientSession(session: Session) {
  try {
    const stringifiedSession = JSON.stringify(session);

    setCookie(SESSION, stringifiedSession, {
      maxAge: 60 * 60 * 24 * 365 * 100,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

async function updateClientSessionUser(user: User) {
  try {
    const sessionValue = getCookie(SESSION);

    if (sessionValue) {
      let session: Session = JSON.parse(sessionValue);
      session = { ...session, user };
      const stringifiedSession = JSON.stringify(session);

      setCookie(SESSION, stringifiedSession, {
        maxAge: 60 * 60 * 24 * 365 * 100,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

async function updateClientSessionToken(token: Token) {
  try {
    const sessionValue = getCookie(SESSION);

    if (sessionValue) {
      let session: Session = JSON.parse(sessionValue);
      session = { ...session, token };
      const stringifiedSession = JSON.stringify(session);

      setCookie(SESSION, stringifiedSession, {
        maxAge: 60 * 60 * 24 * 365 * 100,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

export { getClientSession, saveClientSession, updateClientSessionUser, updateClientSessionToken };
