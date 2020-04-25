import { GetServerSideProps } from 'next'
import { Box } from '../../components/Box'
import { ListService } from '../../modules/lists/list.service'
import { Columns } from '../../components/Columns'
import { Column } from '../../components/Column'
import { List } from '../../modules/lists/types'
import { FunctionComponent } from 'react'
import { jsx } from '@emotion/core'
import { Stack } from '../../components/Stack'
import { Card } from '../../components/Card'
import { spacing } from '../../styles/spacing'
import { PlusIcon } from '../../components/PlusIcon'
import Link from 'next/link'
import { EditIcon } from '../../components/EditIcon'
import { Input } from '../../components/Input'
import { Fab } from '../../components/Fab/Fab'
import { ListItem } from './components/ListItem'
/** @jsx jsx */ jsx

interface ListPageProps {
  list: List
}

export const ListPage: FunctionComponent<ListPageProps> = ({ list }) => {
  return (
    <Box css={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Columns paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Column>
          <Box paddingRight="small" css={{ display: 'inline' }}>
            <Link href="/">
              <a>←</a>
            </Link>
          </Box>
          {list.name}
        </Column>
      </Columns>

      <Box padding="small">
        <Box css={{ position: 'relative' }}>
          <Input label="add an item" placeholder="TESTS" elevation="inset" />
          <Fab
            label="Add"
            css={{
              position: 'absolute',
              top: '50%',
              right: spacing.small,
              transform: 'translateY(-50%)',
            }}
          >
            <PlusIcon />
          </Fab>
        </Box>

        <Box paddingTop="medium">
          <Stack space="xsmall">
            {/* TODO: input component */}

            {list.items?.map((item) => (
              <ListItem name={item.name} key={item.id} />
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
  const list = ListService.getListById(ctx.query.listId as string, {
    expand: 'items',
  })
  return {
    props: {
      list,
    },
  }
}
