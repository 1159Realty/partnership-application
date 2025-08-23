import React from "react";
import { SearchWrapper } from "./input.styles";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Spinner } from "../loaders";

type Props = {
  value?: string;
  loading?: boolean;
  handleClick?: () => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Search = ({
  value,
  placeholder,
  loading = false,
  handleClick,
  ...props
}: Props) => {
  return (
    <SearchWrapper>
      <input
        {...props}
        value={value}
        placeholder={placeholder || "Search"}
        type="search"
      />
      {loading ? (
        <div className="absolute right-2 ">
          <Spinner />
        </div>
      ) : (
        <MagnifyingGlass
          onClick={handleClick}
          className="hover:cursor-pointer"
          size={18}
          weight="bold"
        />
      )}
    </SearchWrapper>
  );
};

export { Search };
