import { FaFilm, FaMoon, FaSun } from "react-icons/fa6";
import { Button } from "antd";
import SearchBar from "@/components/SearchBar";
import { useThemeMode } from "@/hooks/useThemeMode";
import {
  Bar,
  Inner,
  Brand,
  Logo,
  Title,
  Subtitle,
  SearchWrap,
  Actions,
} from "./components";
import type { Props } from "./types/types";

function Header({
  search,
  setSearch,
  searchPlaceholder,
  searchRef,
  subtitle = "Trending & hidden gems",
  children,
}: Props) {
  const { mode, toggle } = useThemeMode();

  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <Logo aria-hidden="true">
            <FaFilm />
          </Logo>
          <div>
            <Title>Movie Explorer</Title>
            <Subtitle>{subtitle}</Subtitle>
          </div>
        </Brand>

        <SearchWrap>
          <SearchBar
            ref={searchRef}
            search={search}
            setSearch={setSearch}
            placeholder={searchPlaceholder}
          />
        </SearchWrap>

        <Actions>
          <Button
            shape="circle"
            onClick={toggle}
            aria-label={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={mode === "dark" ? "Light mode" : "Dark mode"}
            icon={mode === "dark" ? <FaSun /> : <FaMoon />}
          />
          {children}
        </Actions>
      </Inner>
    </Bar>
  );
}

export default Header;
