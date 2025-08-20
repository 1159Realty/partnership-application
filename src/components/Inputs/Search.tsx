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
      <MagnifyingGlass className="hover:" size={18} weight="bold" />
    </SearchWrapper>
  );
};

export { Search };
