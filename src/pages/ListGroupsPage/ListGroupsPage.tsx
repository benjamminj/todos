import { jsx } from '@emotion/core'
import { GetServerSideProps } from 'next'
import React, { FunctionComponent } from 'react'
import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { Column } from '../../components/Column'
import { Columns } from '../../components/Columns'
import { Stack } from '../../components/Stack'
import { Text } from '../../components/Text'
import { List } from '../../modules/lists/types'
import { spacing } from '../../styles/spacing'
import Link from 'next/link'
import Router from 'next/router'
import { Button } from '../../components/Button'
import { fetch } from '../../lib/fetch'
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
      <Box paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Text variant="h6">Lists</Text>
      </Box>

      <Box padding="small">
        <Stack space="small">
          {lists.map((list) => (
            <Link key={list.id} href="/lists/[listId]" as={`/lists/${list.id}`}>
              <a>
                <Card
                  css={{ backgroundColor: '#fff' }}
                  data-testid={`ListGroupCard__${list.id}`}
                >
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

        {/* TODO: sticky on the bottom of the page? */}
        <Box
          paddingTop="large"
          onClick={() => {
            Router.push('/lists/new')
          }}
        >
          <Button>Create a new list</Button>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const lists = await fetch(`/api/lists`).then((res) => res.json())
  console.log('LISTS', lists)
  return {
    props: {
      name: 'test',
      lists,
    },
  }
}
