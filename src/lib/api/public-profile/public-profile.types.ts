interface PublicProfile {
  result: result;
  message: string;
  status: number;
}

interface result {
  firstName: string;
  lastName: string;
  profilePic: string;
}

export type { PublicProfile, result };
