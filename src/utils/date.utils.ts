export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
