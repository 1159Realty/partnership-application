// import { BASE_URL } from "@/utils/constants";
// import { ApiResponse, Session, Token } from "./api.types";
// import { logout } from "./auth/server.auth";

// async function getFreshToken(refreshToken: string): Promise<Token | null> {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({ refreshToken }),
//     });

//     const data = await response.json();
//     const access = data?.result?.accessToken;
//     const refresh = data?.result?.refreshToken;

//     if (access) {
//       const token = { access, refresh };
//       return token;
//     } else {
//       logout();
//     }

//     return null;
//   } catch (error) {
//     console.error("Token refresh error:", error);
//     logout();
//     return null;
//   }
// }

// function createHeaders(token?: string | null): Headers {
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   if (token) {
//     headers.append("Authorization", `Bearer ${token}`);
//   }

//   return headers;
// }

// // get
// async function GetRequest<T>(endpoint: string, token?: string | null): Promise<ApiResponse<T>> {
//   const response = await fetch(`${BASE_URL}/${endpoint}`, {
//     method: "GET",
//     headers: createHeaders(token),
//   });

//   return await response?.json();
// }

// async function get<T>(
//   session: Session | null,

//   endpoint: string): Promise<ApiResponse<T>> {
//   try {
//     let response = await GetRequest<T>(endpoint, session?.token?.access);

//     if (response?.statusCode === 401 && session?.token?.refresh) {
//       const newToken = await getFreshToken(session.token.refresh);
//       response = await GetRequest(endpoint, newToken?.access);
//     }
//     return response;
//   } catch (error) {
//     console.error("Error in get():", error);
//     return new Promise((_, reject) => {
//       reject(error);
//     });
//   }
// }

// // Post
// async function PostRequest<T>(endpoint: string, payload: unknown, token?: string | null): Promise<ApiResponse<T>> {
//   const response = await fetch(`${BASE_URL}/${endpoint}`, {
//     method: "POST",
//     headers: createHeaders(token),
//     body: JSON.stringify(payload),
//   });

//   return await response?.json();
// }

// async function post<T>(session: Session | null, endpoint: string, payload?: unknown): Promise<ApiResponse<T>> {
//   try {
//     let response = await PostRequest<T>(endpoint, payload, session?.token?.access);

//     if (response?.statusCode === 401 && session?.token?.refresh) {
//       const newToken = await getFreshToken(session.token.refresh);
//       response = await PostRequest(endpoint, payload, newToken?.access);
//     }

//     return response;
//   } catch (error) {
//     console.error("Error in post:", error);
//     return new Promise((_, reject) => {
//       reject(error);
//     });
//   }
// }

// // Put
// async function PutRequest<T>(endpoint: string, payload: unknown, token?: string | null): Promise<ApiResponse<T>> {
//   const response = await fetch(`${BASE_URL}/${endpoint}`, {
//     method: "PUT",
//     headers: createHeaders(token),
//     body: JSON.stringify(payload),
//   });

//   return await response?.json();
// }

// async function put<T>(session: Session | null, endpoint: string, payload?: unknown): Promise<ApiResponse<T>> {
//   try {
//     let response = await PutRequest<T>(endpoint, payload, session?.token?.access);

//     if (response?.statusCode === 401 && session?.token?.refresh) {
//       const newToken = await getFreshToken(session.token.refresh);
//       response = await PutRequest(endpoint, payload, newToken?.access);
//     }

//     return response;
//   } catch (error) {
//     console.error("Error in put:", error);
//     return new Promise((_, reject) => {
//       reject(error);
//     });
//   }
// }

// export { get, post, put };
