export const listColors = {
  red: {
    name: 'Red',
  },
  pink: {
    name: 'Pink',
  },
  purple: {
    name: 'Purple',
  },
  blue: {
    name: 'Blue',
  },
  cyan: {
    name: 'Cyan',
  },
  teal: {
    name: 'Teal',
  },
  green: {
    name: 'Green',
  },
  yellow: {
    name: 'Yellow',
  },
  orange: {
    name: 'Orange',
  },
  gray: {
    name: 'Gray',
  },
}

export type ListColorScheme = keyof typeof listColors

export interface List {
  id: string
  name: string
  colorScheme: ListColorScheme
  itemIds: string[]
  items?: ListItem[]
}

export interface ListItem {
  id: string
  listId: string
  status: 'completed' | 'todo'
  name: string
  description?: string | null
}
