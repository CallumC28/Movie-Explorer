import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { App, Button, Empty, Select } from "antd";
import type { Movie } from "@/api/types";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useConfirm } from "@/hooks/useConfirm";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import SectionTitle from "@/components/SectionTitle";
import {
  Main,
  Content,
  PageHead,
  CountText,
  Controls,
  ButtonRow,
  Grid,
  CardWrap,
  RemoveButton,
} from "./components";
import { SORT_OPTIONS } from "./config";
import type { WatchlistSort } from "./types/types";

function Watchlist() {
  const { list, remove, clear } = useWatchlist();
  const { message } = App.useApp();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<WatchlistSort>("added_desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = list.slice();

    if (q) {
      rows = rows.filter((m) => {
        const title = (m.title || m.name || "").toLowerCase();
        const year = (m.release_date || m.first_air_date || "").slice(0, 4);
        return title.includes(q) || year.includes(q);
      });
    }

    const getYear = (m: Movie) =>
      Number((m.release_date || m.first_air_date || "").slice(0, 4)) || 0;
    const getRating = (m: Movie) => m.vote_average || 0;

    switch (sort) {
      case "title_asc":
        rows.sort((a, b) =>
          (a.title || a.name || "").localeCompare(b.title || b.name || ""),
        );
        break;
      case "rating_desc":
        rows.sort((a, b) => getRating(b) - getRating(a));
        break;
      case "year_desc":
        rows.sort((a, b) => getYear(b) - getYear(a));
        break;
      default:
        break; // added_desc = insertion order
    }

    return rows;
  }, [query, sort, list]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watchlist.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const handleRemove = (movie: Movie) => {
    remove(movie.id);
    message.success(`Removed “${movie.title || movie.name}”`);
  };

  const handleClear = () => {
    clear();
    message.success("Watchlist cleared");
  };

  const count = filtered.length;

  return (
    <Main>
      <Header
        search={query}
        setSearch={setQuery}
        searchPlaceholder="Search in watchlist..."
        subtitle="Find trending & hidden gems"
      >
        <Link to="/">
          <Button type="primary">Home</Button>
        </Link>
      </Header>

      <Content>
        <PageHead>
          <div>
            <SectionTitle>My Watchlist</SectionTitle>
            <CountText>
              {count} saved {count === 1 ? "title" : "titles"}
            </CountText>
          </div>

          <Controls>
            <Select<WatchlistSort>
              value={sort}
              onChange={setSort}
              style={{ minWidth: 180 }}
              options={SORT_OPTIONS}
            />

            <ButtonRow>
              <Button onClick={exportJson}>Export</Button>
              <Button
                danger
                disabled={list.length === 0}
                onClick={() =>
                  confirm({
                    title: "Clear watchlist?",
                    content: "This removes all saved titles.",
                    okText: "Clear",
                    danger: true,
                    onOk: handleClear,
                  })
                }
              >
                Clear
              </Button>
            </ButtonRow>
          </Controls>
        </PageHead>

        {count === 0 ? (
          <Empty
            style={{ margin: "4rem auto" }}
            description="No titles saved yet."
          >
            <Link to="/">
              <Button type="primary">Browse movies</Button>
            </Link>
          </Empty>
        ) : (
          <section>
            <Grid>
              {filtered.map((m) => (
                <CardWrap key={m.id}>
                  <MovieCard movie={m} />
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemove(m)}
                    aria-label={`Remove ${m.title || m.name} from watchlist`}
                  >
                    <FaXmark aria-hidden="true" />
                  </RemoveButton>
                </CardWrap>
              ))}
            </Grid>
          </section>
        )}
      </Content>
    </Main>
  );
}

export default Watchlist;
