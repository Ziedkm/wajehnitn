declare module 'react-responsive-masonry' {
  import * as React from 'react';
  export const ResponsiveMasonry: React.FC<{ columnsCountBreakPoints?: { [key: number]: number }, children?: React.ReactNode }>;
  const Masonry: React.FC<{ columnsCount?: number, gutter?: string, children?: React.ReactNode }>;
  export default Masonry;
}