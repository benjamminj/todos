import { jsx } from '@emotion/core'
import { GetServerSideProps } from 'next'
import React, { FunctionComponent } from 'react'
import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { Column } from '../../components/Column'
import { Columns } from '../../components/Columns'
import { PlusIcon } from '../../components/PlusIcon'
import { Stack } from '../../components/Stack'
import { Text } from '../../components/Text'
import { ListService } from '../../modules/lists/list.service'
import { List } from '../../modules/lists/types'
import { spacing } from '../../styles/spacing'
import Link from 'next/link'
/** @jsx jsx */ jsx

interface Props {
  name: string
  lists: List[]
}

/**
 * Main landing page, a list of lists (so meta)
 *
 * Clicking on a list will navigate to the items in that list.
 */
export const ListGroupsPage: FunctionComponent<Props> = ({ lists }) => {
  return (
    <Box css={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Columns paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Column>
          <Text variant="h6">Lists</Text>
        </Column>

        <Column width="content">
          <Box
            css={{
              width: spacing.large,
              height: spacing.large,
              borderRadius: spacing.large / 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              backgroundColor: 'white',
            }}
          >
            <button
              css={{
                margin: 0,
                padding: 0,
                height: '100%',
                width: '100%',
                color: '#494949',
                background: 'transparent',
                border: 'none',
              }}
              onClick={() => console.log('🔥')}
            >
              <PlusIcon
                width={spacing.medium * 1.25}
                height={spacing.medium * 1.25}
              />
              {/* TODO: Visually hidden text "Add a list" */}
            </button>
          </Box>
        </Column>
      </Columns>

      <Box padding="small">
        <Stack space="small">
          {lists.map((list) => (
            <Link key={list.id} href="/lists/[listId]" as={`/lists/${list.id}`}>
              <a>
                <Card css={{ backgroundColor: '#fff' }}>
                  <Columns css={{ alignItems: 'center' }}>
                    <Column>
                      <Text variant="subtitle">{list.name}</Text>
                    </Column>
                    <Column width="content">
                      <Box
                        css={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: spacing.large / 2,
                          height: spacing.large,
                          width: spacing.large,
                          background: `rgba(0, 0, 0, 0.1)`,
                        }}
                      >
                        <Text variant="body">{list.itemIds.length}</Text>
                      </Box>
                    </Column>
                  </Columns>
                </Card>
              </a>
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const lists = ListService.getAllLists()

  return {
    props: {
      name: 'test',
      lists,
    },
  }
}
