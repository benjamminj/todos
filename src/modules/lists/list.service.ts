import { getMockLists } from './__mocks__/list.data'
import { List, ListColorScheme } from './types'
import { generateId } from '../../utils/generateId'

const NotFoundError = new Error('Not found')

export class ListService {
  static getAllLists() {
    return Object.values(getMockLists())
  }

  static getListById(id: string) {
    const lists = getMockLists()
    const list = lists[id]

    if (!list) throw NotFoundError

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
}
