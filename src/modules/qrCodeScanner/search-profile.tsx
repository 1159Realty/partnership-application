"use client";

import { useState } from "react";
import { Search } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { useCustomer } from "@/lib/api/customer/client";
import { useRouter } from "next/navigation";

interface SearchButton {
  search: string;
  cancel: string;
}

const SearchProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const { fetchCustomerProfile } = useCustomer();

  const searchButton: SearchButton = {
    search: "Search",
    cancel: "Cancel",
  };

  const handleSearch = async () => {
    const id = searchTerm.trim();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const customer = await fetchCustomerProfile(id);
      if (customer) {
        router.push(`/client-profile/${id}`);
        //redirect
      } else {
        setError("Customer not found ");
      }
      setSearchTerm("");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
      } else {
        setError("Customer not found ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    setSearchTerm("");
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
