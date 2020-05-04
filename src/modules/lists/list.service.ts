import { getMockLists, getMockListItems } from './__mocks__/list.data'
import { List, ListColorScheme, ListItem } from './types'
import { generateId } from '../../lib/generateId'
import { query, db } from '../../lib/db'

const NotFoundError = new Error('Not found')
const InvalidInputError = new Error('Invalid input')

export class ListService {
  static async getAllLists() {
    return await query(`
      SELECT
        list.id as id,
        list.name as name,
        color_scheme as "colorScheme",
        COALESCE(
          array_agg(item.id) FILTER(WHERE item.id IS NOT NULL), 
          '{}'
        )  as "itemIds"
      FROM lists list
      LEFT JOIN list_items item ON item.list_id = list.id
      GROUP BY list.id
    `)
  }

  static getListById(id: string, params: { expand?: 'items' } = {}) {
    const lists = getMockLists()
    const list = lists[id]

    if (!list) throw NotFoundError

    if (params.expand === 'items') {
      const items = getMockListItems()

      const attachedItems = list.itemIds
        .map((itemId) => items[itemId])
        .filter((item) => item)

      return {
        ...list,
        items: attachedItems,
      }
    }

    return list
  }

  static createList({ name, colorScheme }: Pick<List, 'name' | 'colorScheme'>) {
    const id = generateId()

    const lists = getMockLists()
    lists[id] = {
      id,
      name,
      colorScheme,
      itemIds: [],
    }

    return lists[id]
  }

  static updateList(
    id: string,
    updates: { name?: string; colorScheme?: ListColorScheme }
  ) {
    const lists = getMockLists()
    const list = lists[id]

    if (!list) throw NotFoundError

    lists[id] = {
      ...list,
      ...updates,
    }

    return lists[id]
  }

  static deleteList(id: string) {
    const lists = getMockLists()
    const list = lists[id]

    if (!list) throw NotFoundError

    // TODO: should we do a cascading delete?
    delete lists[id]
    return list
  }

  static getListItems(listId: string) {
    const lists = getMockLists()
    const list = lists[listId]

    if (!list) throw NotFoundError

    const items = getMockListItems()

    return list.itemIds.map((itemId) => items[itemId]).filter((item) => item)
  }

  static createNewListItem(
    listId: string,
    item: { name: ListItem['name']; status?: ListItem['status'] }
  ) {
    const id = generateId()
    const listItems = getMockListItems()
    const lists = getMockLists()

    const list = lists[listId]

    if (!list) throw NotFoundError
    if (!item.name) throw InvalidInputError
    if (item.status && ['todo', 'completed'].includes(item.status) === false) {
      throw InvalidInputError
    }

    const newItem: ListItem = {
      id,
      listId,
      description: null,
      status: 'todo',
      ...item,
    }

    listItems[id] = newItem
    list.itemIds.push(id)

    return newItem
  }

  static updateListItem(
    itemId: string,
    updates: Partial<Pick<ListItem, 'name' | 'status'>>
  ) {
    const listItems = getMockListItems()
    const item = listItems[itemId]

    const hasNameError = 'name' in updates && !updates.name
    const hasStatusError =
      'status' in updates &&
      ['todo', 'completed'].includes(updates.status as string) === false

    if (hasNameError || hasStatusError) throw InvalidInputError
    if (!item) throw NotFoundError

    listItems[itemId] = {
      ...item,
      ...updates,
    }

    return listItems[itemId]
  }
}
