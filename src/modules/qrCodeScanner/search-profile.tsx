"use client";

import { useRef, useState } from "react";
import { Search } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import {
  PublicProfile,
  result,
} from "@/lib/api/public-profile/public-profile.types";
import UserInfo from "./search-result";

interface SearchButton {
  search: string;
  cancel: string;
}

const SearchProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const searchButton: SearchButton = {
    search: "Search",
    cancel: "Cancel",
  };

  const handleSearch = async () => {
    const id = searchTerm.trim();
    if (!id) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const res = await fetch(
        `/api/public-profile?publicId=${encodeURIComponent(id)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Profile not found");

      const response = await res.json();
      const data: result = response;
      console.log(response, "response");

      setProfile(data);
      setSearchTerm("");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request aborted");
      } else {
        setError("User not found ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    controllerRef.current?.abort();
    setLoading(false);
    setSearchTerm("");
    setProfile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col pb-5 items-center gap-4 w-full">
      <div className="flex flex-row items-center gap-2 w-full lg:max-w-5xl">
        {/* Wrapper to make Search input take all available space */}
        <div className="flex relative flex-grow">
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User ID"
            handleClick={handleSearch}
            loading={loading}
          />
          {profile && (
            <div className="absolute z-10 top-8 mt-4 w-full max-w-4xl ">
              <UserInfo profile={profile} />
            </div>
          )}
        </div>

        {/* Button will take only the space it needs */}
        <Button onClick={loading ? handleCancel : handleSearch}>
          {loading ? searchButton.cancel : searchButton.search}
        </Button>

        {/* Conditional profile info display */}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchProfile;
