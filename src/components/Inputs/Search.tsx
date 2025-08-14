import React from "react";
import { SearchWrapper } from "./input.styles";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

type Props = {
  value?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Search = ({ value, placeholder, ...props }: Props) => {
  return (
    <SearchWrapper>
      <input
        {...props}
        value={value}
        placeholder={placeholder || "Search"}
        type="search"
      />
      <button>
        <MagnifyingGlass size={18} weight="bold" />
      </button>
    </SearchWrapper>
  );
};

export { Search };
