// Branded Type
export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };