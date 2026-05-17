export const BAZAAR_DEFAULT_LIMIT = 8;
export const BAZAAR_MAX_PRICE = 1000;

export interface BazaarFilterState {
  searchTerm: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
}

const toStringValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

const normalizeCategoryList = (value: string | string[] | undefined): string[] => {
  const source = Array.isArray(value) ? value : toStringValue(value).split(",");

  return source
    .map((item) => item.trim())
    .filter(Boolean);
};

const toNumber = (value: string | string[] | undefined, fallback: number): number => {
  const str = toStringValue(value);
  if (!str) return fallback;

  const parsed = Number(str);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function parseBazaarSearchParams(params: {
  searchTerm?: string | string[];
  category?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  page?: string | string[];
  limit?: string | string[];
  search?: string | string[];
}): BazaarFilterState {
  const minPrice = Math.max(0, toNumber(params.minPrice, 0));
  const maxPrice = Math.max(minPrice, toNumber(params.maxPrice, BAZAAR_MAX_PRICE));

  return {
    searchTerm: toStringValue(params.searchTerm || params.search),
    categories: normalizeCategoryList(params.category),
    minPrice,
    maxPrice,
    page: Math.max(1, toNumber(params.page, 1)),
    limit: Math.max(1, toNumber(params.limit, BAZAAR_DEFAULT_LIMIT)),
  };
}

export function buildBazaarQueryParams(filters: BazaarFilterState): string {
  const params = new URLSearchParams();

  if (filters.searchTerm.trim()) {
    params.set("searchTerm", filters.searchTerm.trim());
  }

  if (filters.categories.length > 0) {
    params.set("category", filters.categories.join(","));
  }

  if (filters.minPrice > 0) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice < BAZAAR_MAX_PRICE) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== BAZAAR_DEFAULT_LIMIT) {
    params.set("limit", String(filters.limit));
  }

  return params.toString();
}
