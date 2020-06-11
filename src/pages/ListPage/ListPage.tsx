import { jsx } from '@emotion/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { useQuery } from 'react-query'
import { Box } from '../../components/Box'
import { Column } from '../../components/Column'
import { Columns } from '../../components/Columns'
import { Stack } from '../../components/Stack'
import { Text } from '../../components/Text'
import { VisuallyHidden } from '../../components/VisuallyHidden'
import { fetch } from '../../lib/fetch'
import { List, ListItem as ListItemInterface } from '../../modules/lists/types'
import { AddListItem } from './components/AddListItem'
import { ListItem } from './components/ListItem'
import {
  getListByIdKey,
  getListItemsKey,
} from '../../modules/lists/queryCacheKeys'
/** @jsx jsx */ jsx

interface ListPageProps {
  id: string
}

type FetchItemsFn = (key: string, id: string) => Promise<ListItemInterface[]>
const fetchItems: FetchItemsFn = async (_key, id) => {
  const items = await fetch(`/api/lists/${id}/items?status=todo`).then((res) => res.json())
  return items
}

/**
 * Displays the items in a given list.
 */
export const ListItems: FunctionComponent = () => {
  const router = useRouter()
  const id = router.query.listId as string | undefined

  const itemsQuery = useQuery(id ? getListItemsKey(id) : null, fetchItems)

  if (!id) return null

  if (itemsQuery.status === 'loading') return <>Loading...</>
  if (itemsQuery.status === 'error') {
    return <>Error: {itemsQuery.error.message}</>
  }

  if (!itemsQuery.data.length) {
    return (
      <Box padding="medium" css={{ display: 'flex', justifyContent: 'center' }}>
        <p>
          <Text css={{ textAlign: 'center' }}>
            No items yet.
            <br />
            <br />
            Add your first item today 💪
          </Text>
        </p>
      </Box>
    )
  }

  return (
    <Stack space="xsmall">
      {itemsQuery.data.map((item) => (
        <ListItem
          name={item.name}
          key={item.id}
          id={item.id}
          listId={id}
          status={item.status}
        />
      ))}
    </Stack>
  )
}

type FetchListFn = (key: string, id: string) => Promise<List>

/**
 * Fetch the data for a single list. This data does _not_ include the list items,
 * just the list metadata (name, color scheme, etc).
 */
const fetchList: FetchListFn = async (_key, id) => {
  const list = await fetch(`/api/lists/${id}`).then((res) => res.json())

  return list
}

/**
 * "Profile" page for a list of todo items.
 */
export const ListPage: FunctionComponent<ListPageProps> = () => {
  const router = useRouter()
  const id = router.query.listId as string

  const listQuery = useQuery(id ? getListByIdKey(id) : null, fetchList)

  return (
    <Box css={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Columns paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Column>
          <Box paddingRight="small" css={{ display: 'inline' }}>
            <Link href="/">
              <a>
                ←<VisuallyHidden>Back</VisuallyHidden>
              </a>
            </Link>
          </Box>

          {listQuery.status === 'loading' && 'Loading...'}
          {listQuery.status === 'success' && listQuery.data?.name}
        </Column>
      </Columns>

      <Box padding="small">
        <AddListItem listId={id} />

        <Box paddingTop="medium">
          <ListItems />
        </Box>
      </Box>
    </Box>
  )
}
