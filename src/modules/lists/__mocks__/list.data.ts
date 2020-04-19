import { List, ListItem } from '../types'

let lists: { [id: string]: List } = {}
let listItems: { [key: string]: ListItem } = {}

export const generateMockLists = () => {
  lists = {
    b9y7rp6wt: {
      id: 'b9y7rp6wt',
      name: 'People',
      colorScheme: 'cyan',
      itemIds: ['0l28pul1z', 'pyq6efgzn', 'ws27so32t'],
    },
    pu74257m9: {
      id: 'pu74257m9',
      name: 'Places',
      colorScheme: 'red',
      itemIds: ['8i1efj9z2', 'jichpr763', 'gzcw77yl5'],
    },
    '0suhn5703': {
      id: '0suhn5703',
      name: 'Things',
      colorScheme: 'purple',
      itemIds: ['aliim5287', '8j5pe6tji', 'pb99ri9dx', 'pb99ri9dx'],
    },
  }
}

export const generateMockListItems = () => {
  listItems = {
    '0l28pul1z': {
      id: '0l28pul1z',
      listId: 'b9y7rp6wt',
      name: 'Bill',
      status: 'todo',
      description: null,
    },
    pyq6efgzn: {
      id: 'pyq6efgzn',
      listId: 'b9y7rp6wt',
      name: 'Susie',
      status: 'todo',
      description: null,
    },
    ws27so32t: {
      id: 'ws27so32t',
      listId: 'b9y7rp6wt',
      name: 'George',
      status: 'todo',
      description: null,
    },
    '8i1efj9z2': {
      id: '8i1efj9z2',
      listId: 'pu74257m9',
      name: 'Russia',
      status: 'todo',
      description: null,
    },
    jichpr763: {
      id: 'jichpr763',
      listId: 'pu74257m9',
      name: 'Scotland',
      status: 'todo',
      description: null,
    },
    gzcw77yl5: {
      id: 'gzcw77yl5',
      listId: 'pu74257m9',
      name: 'Washington',
      status: 'todo',
      description: null,
    },
    aliim5287: {
      id: 'aliim5287',
      listId: '0suhn5703',
      name: 'Soap',
      status: 'todo',
      description: null,
    },
    '8j5pe6tji': {
      id: '8j5pe6tji',
      listId: '0suhn5703',
      name: 'Toilet paper',
      status: 'todo',
      description: null,
    },
    pb99ri9dx: {
      id: 'pb99ri9dx',
      listId: '0suhn5703',
      name: 'Napkins',
      status: 'todo',
      description: null,
    },
    '6hhzn5v5k': {
      id: 'pb99ri9dx',
      listId: '0suhn5703',
      name: 'Chips',
      status: 'todo',
      description: null,
    },
  }
}

generateMockLists()
generateMockListItems()

export const getMockLists = () => lists
export const getMockListItems = () => listItems
