import { getMockLists, getMockListItems } from './__mocks__/list.data'
import { List, ListColorScheme, ListItem } from './types'
import { generateId } from '../../utils/generateId'

const NotFoundError = new Error('Not found')
const InvalidInputError = new Error('Invalid input')

export class ListService {
  static getAllLists() {
    return Object.values(getMockLists())
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

    delete lists[id]
    return list
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
