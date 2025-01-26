interface InfiniteQueryData {
  pages: (any[] | undefined)[]
  pageParams: unknown[]
}

/**
 * For checking if there is any data in the response of infinite query
 */
export const hasData = (data: InfiniteQueryData) => !data || data.pages.every((page) => !page || page.length === 0)
