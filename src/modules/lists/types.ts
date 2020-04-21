export type ListColorScheme =
  | 'red'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'gray'

export interface List {
  id: string
  name: string
  // TODO: union type for possible schemes
  colorScheme: ListColorScheme
  itemIds: string[]
  items?: ListItem[]
}

export interface ListItem {
  id: string
  listId: string
  status: 'completed' | 'todo'
  name: string
  description: string | null
}
