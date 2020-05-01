import { GetServerSideProps } from 'next'
import { Box } from '../../components/Box'
import { ListService } from '../../modules/lists/list.service'
import { Columns } from '../../components/Columns'
import { Column } from '../../components/Column'
import { List } from '../../modules/lists/types'
import { FunctionComponent, useCallback } from 'react'
import { jsx } from '@emotion/core'
import { Stack } from '../../components/Stack'
import Link from 'next/link'
import { ListItem } from './components/ListItem'
import { useQuery } from 'rhdf'
import { AddListItem } from './components/AddListItem'
/** @jsx jsx */ jsx

interface ListPageProps {
  id: string
}

export const ListPage: FunctionComponent<ListPageProps> = ({ id }) => {
  const fetchItems = useCallback(
    async () =>
      ListService.getListById(id, {
        expand: 'items',
      }) as Required<List>,
    []
  )

  const { data: list, status: listStatus } = useQuery<Required<List>>(
    `/lists/${id}`,
    fetchItems
  )

  return (
    <Box css={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Columns paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Column>
          <Box paddingRight="small" css={{ display: 'inline' }}>
            <Link href="/">
              <a>←</a>
            </Link>
          </Box>

          {listStatus === 'loading' && 'loading...'}
          {listStatus === 'success' && list?.name}
        </Column>
      </Columns>

      <Box padding="small">
        <AddListItem listId={id} />

        <Box paddingTop="medium">
          <Stack space="xsmall">
            {listStatus === 'loading' && 'Loading...'}
            {listStatus === 'success' &&
              list?.items.map((item) => (
                <ListItem
                  name={item.name}
                  key={item.id}
                  id={item.id}
                  listId={id}
                />
              ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<ListPageProps> = async (
  ctx
) => {
  return {
    props: {
      id: ctx.query.listId as string,
      // list,
    },
  }
}
