// types/slugify.d.ts
declare module 'slugify' {
  interface SlugifyOptions {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  }

  function slugify(
    string: string,
    options?: SlugifyOptions
  ): string;

  export = slugify;
}
