// density → min column width; `auto-fill minmax` does the responsive column math natively
// spacious: 320 caps the 80rem container at 3 columns (4 would need ~1352px)
export const MIN_COL = { compact: 150, comfy: 185, spacious: 320 } as const;
