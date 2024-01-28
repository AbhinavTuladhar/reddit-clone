/**
 * A simple function which converts 'one_two' to 'One Two', 'first_second' and 'First Second'
 * ie split by underscores, capitalise the first letter of each word and then join using a space.
 * @param subName { string } The name of the subreddit name to format.
 * @returns { string } The formatted subreddit name.
 */
const formatSubName = (subName: string): string => {
  const splitWords = subName.split('_')

  const formattedWords = splitWords.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))

  return formattedWords.join(' ')
}

export default formatSubName
