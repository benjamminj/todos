import { GetServerSideProps } from 'next'
import { Box } from '../../components/Box'
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
import { Text } from '../../components/Text'
import { VisuallyHidden } from '../../components/VisuallyHidden'
import { fetch } from '../../lib/fetch'
/** @jsx jsx */ jsx

interface ListPageProps {
  id: string
}

export const ListPage: FunctionComponent<ListPageProps> = ({ id }) => {
  console.warn('process.env.BASE_API_URL', process.env.BASE_API_URL)
  const fetchItems = useCallback(async () => {
    const list = await fetch(`/api/lists/${id}?expand=items`).then((res) =>
      res.json()
    )

    return list
  }, [])

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
              <a>
                ←<VisuallyHidden>Back</VisuallyHidden>
              </a>
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
            {listStatus === 'success' && (list?.items?.length ?? 0) === 0 && (
              <Box
                padding="medium"
                css={{ display: 'flex', justifyContent: 'center' }}
              >
                <Text>No items yet!</Text>
              </Box>
            )}

            {listStatus === 'success' &&
              list?.items?.map((item) => (
                <ListItem
                  name={item.name}
                  key={item.id}
                  id={item.id}
                  listId={id}
                  status={item.status}
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
