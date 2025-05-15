import { Session, Token } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { SESSION } from "@/utils/constants";
import { cookies } from "next/headers";

async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get(SESSION)?.value;
    let session: Session | null = null;

    if (sessionValue) {
      session = JSON.parse(sessionValue);
    }

    return session;
  } catch (error) {
    console.error(`Unable to retrieve tokens from cookie--server side. Reason= ${error}`);
    return null;
  }
}

async function saveServerSession(session: Session) {
  try {
    const cookieStore = await cookies();
    const stringifiedSession = JSON.stringify(session);

    cookieStore.set(SESSION, stringifiedSession, {
      maxAge: 60 * 60 * 24 * 365 * 100,
      path: "/",
      secure: process.env.NODE_ENV === "production", // Only in https
      sameSite: "lax",
    });
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

async function updateServerSessionUser(user: User) {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get(SESSION)?.value;

    if (sessionValue) {
      const session: Session = JSON.parse(sessionValue);
      session.user = user;

      const stringifiedSession = JSON.stringify(session);
      cookieStore.set(SESSION, stringifiedSession, {
        maxAge: 60 * 60 * 24 * 365 * 100,
        path: "/",
        secure: process.env.NODE_ENV === "production", // Only in https
        sameSite: "lax",
      });
    }
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

async function updateServerSessionToken(token: Token) {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get(SESSION)?.value;

    if (sessionValue) {
      const session: Session = JSON.parse(sessionValue);
      session.token = token;

      const stringifiedSession = JSON.stringify(session);
      cookieStore.set(SESSION, stringifiedSession, {
        maxAge: 60 * 60 * 24 * 365 * 100,
        path: "/",
        secure: process.env.NODE_ENV === "production", // Only in https
        sameSite: "lax",
      });
    }
  } catch (error) {
    console.error(`Unable to save session in cookie. Reason=${error}`);
    return null;
  }
}

export { getServerSession, saveServerSession, updateServerSessionUser, updateServerSessionToken };
