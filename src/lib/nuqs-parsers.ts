import {createMultiParser, createParser, parseAsInteger, type SingleParser} from 'nuqs';
import type {SortingState} from "@tanstack/react-table";
import {z} from "zod";

import {dataTableConfig} from "#/config/data-table";
import type {ExtendedColumnFilter, ExtendedColumnSort} from "#/types/data-table";

// ============================================================================
// Schemas
// ============================================================================

const sortingItemSchema = z.object({
    id: z.string(),
    desc: z.boolean(),
});

const filterItemSchema = z.object({
    id: z.string(),
    value: z.union([z.string(), z.array(z.string())]),
    variant: z.enum(dataTableConfig.filterVariants),
    operator: z.enum(dataTableConfig.operators),
    filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

// ============================================================================
// Custom Parsers (Value Formatters)
// ============================================================================

/**
 * Parses range values: "100~200" <=> { gte: 100, lte: 200 } or "150" <=> { eq: 150 }
 */
export const parseAsFromTo = createParser<{ eq?: number; gte?: number; lte?: number }>({
    parse: (value) => {
        const [min = null, max = null] = value.split('~').map(parseAsInteger.parse);
        if (min === null) return null;
        return max === null ? { eq: min } : { gte: min, lte: max };
    },
    serialize: (value) => (value.eq !== undefined ? String(value.eq) : `${value.gte}~${value.lte}`),
});

/**
 * Parses colon key-values: "foo:bar" <=> { key: "foo", value: "bar" }
 */
export const parseAsKeyValue = createParser<{ key: string; value: string }>({
    parse: (value) => {
        const [key, val] = value.split(':');
        return key && val ? { key, value: val } : null;
    },
    serialize: ({ key, value }) => `${key}:${value}`,
});

/**
 * Dynamic Multi-Filter Parser (e.g. ["status:active", "status:inactive"] -> { status: "inactive" })
 */
export const parseAsFilters = <TItem extends {}>(itemParser: SingleParser<TItem>) => 
    createMultiParser<Record<string, TItem>>({
        parse: (values) => {
            const parsedEntries = values
                .map(parseAsKeyValue.parse)
                .filter((v): v is { key: string; value: string } => v !== null)
                .flatMap(({ key, value }) => {
                    const parsed = itemParser.parse(value);
                    return parsed === null ? [] : [[key, parsed]];
                });

            return parsedEntries.length ? Object.fromEntries(parsedEntries) : null;
        },
        serialize: (values) => 
            Object.entries(values)
                .map(([key, value]) => {
                    const serializedValue = itemParser.serialize?.(value);
                    return serializedValue ? parseAsKeyValue.serialize({ key, value: serializedValue }) : null;
                })
                .filter((v): v is string => v !== null),
    });

// ============================================================================
// TanStack Table State Parsers
// ============================================================================

/**
 * Spatie Laravel-compatible Sort Parser.
 * Maps: "?sort=-createdAt,status" <=> SortingState
 */
export const parseAsSpatieSort = createParser<SortingState>({
    parse: (value) => 
        value.split(',').map((part) => {
            const desc = part.startsWith('-');
            return { id: desc ? part.slice(1) : part, desc };
        }),
    serialize: (state) => 
        state.map(({ id, desc }) => `${desc ? '-' : ''}${id}`).join(','),
});

/**
 * Parses React Table JSON Sorting State 
 */
export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
    const validKeys = columnIds instanceof Set ? columnIds : columnIds ? new Set(columnIds) : null;

    return createParser<ExtendedColumnSort<TData>[]>({
        parse: (value) => {
            try {
                const parsed = JSON.parse(value);
                const result = z.array(sortingItemSchema).safeParse(parsed);
                if (!result.success) return null;
                if (validKeys && result.data.some((item) => !validKeys.has(item.id))) return null;
                return result.data as ExtendedColumnSort<TData>[];
            } catch {
                return null;
            }
        },
        serialize: (value) => JSON.stringify(value),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    });
};

/**
 * Parses React Table JSON Advanced Column Filters State
 */
export const getFiltersStateParser = <TData>(columnIds?: string[] | Set<string>) => {
    const validKeys = columnIds instanceof Set ? columnIds : columnIds ? new Set(columnIds) : null;

    return createParser<ExtendedColumnFilter<TData>[]>({
        parse: (value) => {
            try {
                const parsed = JSON.parse(value);
                const result = z.array(filterItemSchema).safeParse(parsed);
                if (!result.success) return null;
                if (validKeys && result.data.some((item) => !validKeys.has(item.id))) return null;
                return result.data as ExtendedColumnFilter<TData>[];
            } catch {
                return null;
            }
        },
        serialize: (value) => JSON.stringify(value),
        eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    });
};