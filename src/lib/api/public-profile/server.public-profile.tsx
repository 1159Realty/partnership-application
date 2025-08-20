import { simpleGet } from "../sever.api";
import { PublicProfile } from "./public-profile.types";

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const response = await simpleGet<PublicProfile>(`public/user/${id}`);
  return response?.result as PublicProfile;
};

export { fetchPublicProfile };
