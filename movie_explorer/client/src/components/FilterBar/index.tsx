import { Button, Select, Slider } from "antd";
import {
  Panel,
  Head,
  HeadTitle,
  HeadActions,
  MobileOnlyButton,
  Grid,
  Field,
  Label,
} from "./components";
import { SORT_OPTIONS, RATING_MARKS } from "./config";
import type { Props, SortOption } from "./types/types";

export type { SortOption } from "./types/types";

function FilterBar({
  genres,
  availableYears,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  minRating,
  setMinRating,
  sortOption,
  setSortOption,
  resetFilters,
  onCloseMobile,
}: Props) {
  return (
    <Panel aria-labelledby="filters-heading">
      <Head>
        <HeadTitle id="filters-heading">Filters</HeadTitle>
        <HeadActions>
          <Button size="small" onClick={resetFilters}>
            Reset
          </Button>
          {onCloseMobile && (
            <MobileOnlyButton
              size="small"
              type="primary"
              onClick={onCloseMobile}
            >
              Done
            </MobileOnlyButton>
          )}
        </HeadActions>
      </Head>

      <Grid>
        <Field>
          <Label htmlFor="genre">Genre</Label>
          <Select
            id="genre"
            showSearch
            optionFilterProp="label"
            style={{ width: "100%" }}
            value={selectedGenre}
            onChange={setSelectedGenre}
            options={[
              { value: "all", label: "All" },
              ...genres.map((g) => ({ value: String(g.id), label: g.name })),
            ]}
          />
        </Field>

        <Field>
          <Label htmlFor="year">Release Year</Label>
          <Select
            id="year"
            showSearch
            optionFilterProp="label"
            style={{ width: "100%" }}
            value={selectedYear}
            onChange={setSelectedYear}
            options={[
              { value: "all", label: "All" },
              ...availableYears.map((y) => ({
                value: String(y),
                label: String(y),
              })),
            ]}
          />
        </Field>

        <Field>
          <Label>Min Rating: {minRating || "Any"}</Label>
          <Slider
            min={0}
            max={9}
            value={minRating}
            onChange={setMinRating}
            marks={RATING_MARKS}
          />
        </Field>

        <Field $wide>
          <Label htmlFor="sort">Sort By</Label>
          <Select<SortOption>
            id="sort"
            style={{ width: "100%" }}
            value={sortOption}
            onChange={setSortOption}
            options={SORT_OPTIONS}
          />
        </Field>
      </Grid>
    </Panel>
  );
}

export default FilterBar;
