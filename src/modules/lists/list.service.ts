import { List, ListColorScheme, ListItem } from './types'
import { db, firebase } from '../../lib/firebase'

const NotFoundError = new Error('Not found')
const InvalidInputError = new Error('Invalid input')

const timestamp = firebase.firestore.FieldValue.serverTimestamp

export class ListService {
  static async getAllLists() {
    const listsCollection = await db.collection('lists').get()

    const lists = listsCollection.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      }
    })

    const itemPromises: Promise<object>[] = []

    lists.forEach((list) => {
      const promise = async () => {
        const items = await db
          .collection('lists')
          .doc(list.id)
          .collection('items')
          .get()

        return { ...list, itemIds: items.docs.map((item) => item.id) }
      }

      itemPromises.push(promise())
    })

    const listsWithItems = await Promise.all(itemPromises)

    return listsWithItems
  }

  static async getListById(id: string, params: { expand?: 'items' } = {}) {
    const listRef = db.collection('lists').doc(id)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    const listData = { ...list.data(), id: list.id }

    if (params.expand === 'items') {
      const itemsRef = await listRef.collection('items').get()
      const items = itemsRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      return {
        ...listData,
        items,
      }
    }

    return listData
  }

  static async createList({
    name,
    colorScheme,
  }: Pick<List, 'name' | 'colorScheme'>) {
    const listRef = await db.collection('lists').doc()

    listRef.set({ name, colorScheme, createdAt: timestamp() })

    const list = await listRef.get()
    return { ...list.data(), id: list.id }
  }

  static async updateList(
    id: string,
    updates: { name?: string; colorScheme?: ListColorScheme }
  ) {
    const listRef = db.collection('lists').doc(id)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    await listRef.update(updates)
    const updated = await listRef.get()

    return { ...updated.data(), id: updated.id }
  }

  static async deleteList(id: string) {
    const listRef = db.collection('lists').doc(id)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    await listRef.delete()

    const items = await listRef.collection('items').get()

    const itemDeletions: Promise<unknown>[] = []
    items.docs.forEach((item) => {
      itemDeletions.push(listRef.collection('items').doc(item.id).delete())
    })

    await Promise.all(itemDeletions)

    return { ...list.data(), id: list.id }
  }

  static async getListItems(listId: string) {
    const listRef = db.collection('lists').doc(listId)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    const items = await listRef.collection('items').orderBy('createdAt').get()
    return items.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  static async createNewListItem(
    listId: string,
    item: { name: ListItem['name']; status?: ListItem['status'] }
  ) {
    if (!item.name) throw InvalidInputError
    if (item.status && ['todo', 'completed'].includes(item.status) === false) {
      throw InvalidInputError
    }

    const listRef = db.collection('lists').doc(listId)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    const itemRef = listRef.collection('items').doc()

    await itemRef.set({ status: 'todo', ...item, createdAt: timestamp() })
    const createdItem = await itemRef.get()

    return { ...createdItem.data(), id: createdItem.id }
  }

  static async updateListItem(
    listId: string,
    itemId: string,
    updates: Partial<Pick<ListItem, 'name' | 'status'>>
  ) {
    const hasNameError = 'name' in updates && !updates.name
    const hasStatusError =
      'status' in updates &&
      ['todo', 'completed'].includes(updates.status as string) === false
    if (hasNameError || hasStatusError) throw InvalidInputError

    const listRef = db.collection('lists').doc(listId)
    const list = await listRef.get()

    if (!list.exists) throw NotFoundError

    const itemRef = listRef.collection('items').doc(itemId)
    const item = await itemRef.get()
    if (!item.exists) throw NotFoundError

    await itemRef.update(updates)
    const updated = await itemRef.get()

    return { ...updated.data(), id: updated.id }
  }
}
