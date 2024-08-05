// types/gray-matter.d.ts
declare module 'gray-matter' {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
    isEmpty?: boolean;
    matter?: string;
    path?: string;
    stringify?: (data: T) => string;
  }

  interface GrayMatterOption<T> {
    /** Engines for parsing and stringify front-matter. */
    engines?: {
      [index: string]: any;
    };
    /** Function to transform data to a different format. */
    language?: string;
    /** delims to use for the front-matter. */
    delimiters?: string | [string, string];
    /** Array of files to process. */
    files?: string | string[];
    /** Define a custom function for extracting the excerpt. */
    excerpt?: boolean | ((file: GrayMatterFile<T>, options: GrayMatterOption<T>) => string);
    /** Optionally remove the front-matter from the returned content. */
    excerpt_separator?: string;
    /** Callback function to handle errors. */
    error?: (e: Error) => void;
  }

  export default function matter<T extends object = any>(
    input: string | Buffer,
    options?: GrayMatterOption<T>
  ): GrayMatterFile<T>;
}
