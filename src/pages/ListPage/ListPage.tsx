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
        <Box
          padding="medium"
          css={{
            backgroundColor: '#eaeaea',
            borderRadius: 8,
            // border: '2px solid #ccc',
          }}
        >
          <Columns css={{ alignItems: 'center' }}>
            <Column>input fpo</Column>
            <Column
              width="content"
              css={{ display: 'flex', alignItems: 'center' }}
            >
              <PlusIcon
                css={{
                  height: spacing.medium,
                  width: spacing.medium,
                }}
              />
            </Column>
          </Columns>
        </Box>

        <Box paddingTop="medium">
          <Stack space="xsmall">
            {/* TODO: input component */}

            {list.items?.map((item) => (
              <Card
                key={item.id}
                css={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  border: '1px solid #eaeaea',
                }}
              >
                <Columns css={{ alignItems: 'center' }}>
                  <Column width="content" paddingRight="small">
                    <Box
                      css={{
                        width: spacing.large,
                        height: spacing.large,
                        borderRadius: 8,
                        backgroundColor: '#eaeaea',
                      }}
                    />
                  </Column>
                  <Column>{item.name}</Column>
                  <Column width="content" css={{ display: 'flex' }}>
                    <EditIcon css={{ fill: '#999' }} />
                  </Column>
                </Columns>
              </Card>
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
