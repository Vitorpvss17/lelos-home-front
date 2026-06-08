// As categorias agora vêm do backend (ver getCategories em ./api).
// KitItem/Product já carregam o nome legível da categoria, então o
// "label" é apenas o próprio valor.
export const categoryLabel = (value: string) => value;
