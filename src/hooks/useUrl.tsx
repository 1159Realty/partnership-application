import { SearchParams } from "@/utils/global-types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUrl = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const removeQuery = (query: keyof SearchParams, scroll?: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.delete(query);
    push(`${pathname}?${params.toString()}`, { scroll: scroll || false });
  };

  const addQuery = (query: keyof SearchParams, value: string, replace = true, scroll = false) => {
    const params = replace ? new URLSearchParams() : new URLSearchParams(searchParams);
    const term = value.trim();

    if (term) {
      params.set(query, term);
    } else {
      params.delete(term);
    }

    push(`${pathname}?${params.toString()}`, { scroll });
  };

  const getQuery = (query: keyof SearchParams) => {
    return searchParams.get(query);
  };

  return {
    removeQuery,
    getQuery,
    addQuery,
  };
};
