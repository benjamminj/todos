/** Key for a single list containing todo items */
export const getListByIdKey = (id: string) => ['lists', id] as [string, string]

/** Key for the items contained in a list */
export const getListItemsKey = (listId: string) => {
  return ['listItems', listId] as [string, string]
}
