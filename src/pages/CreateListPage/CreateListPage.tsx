import { jsx } from '@emotion/core'
import Link from 'next/link'
import Router from 'next/router'
import { useState } from 'react'
import { queryCache, useMutation } from 'react-query'
import { Box } from '../../components/Box'
import { Button } from '../../components/Button'
import { Column } from '../../components/Column'
import { Columns } from '../../components/Columns'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Stack } from '../../components/Stack'
import { Text } from '../../components/Text'
import { VisuallyHidden } from '../../components/VisuallyHidden'
import { fetch } from '../../lib/fetch'
import { List, listColors, ListColorScheme } from '../../modules/lists/types'
/** @jsx jsx */ jsx

type CreateListFn = (newList: {
  name: string
  colorScheme: string
}) => Promise<List>

/**
 * Saves a new list to the database.
 *
 * New lists will be defaulted with 0 items
 */
const createList: CreateListFn = async ({ name, colorScheme }) => {
  const list = await fetch(`/api/lists`, {
    method: 'post',
    mode: 'same-origin',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, colorScheme }),
  }).then((res) => {
    if (res.status >= 400) {
      throw new Error(`Failed to fetch: responded with status ${res.status}`)
    }

    return res.json()
  })

  return list
}

/**
 * Form to facilitate adding a brand new list.
 *
 * Should immediately redirect to the view of the list itself upon successfully
 * completing the form.
 */
export const CreateListPage = () => {
  const [name, setName] = useState('')
  const [colorScheme, setColorScheme] = useState<ListColorScheme | ''>('')

  const [mutate] = useMutation(createList, {
    onSuccess: (data) => {
      // Seed the cache with the newly created list before navigation, this prevents
      // us from having to refetch it on the next page.
      queryCache.setQueryData(['lists', data.id], data)
      // Automatically navigate to the list's profile
      Router.push('/lists/[listId]', `/lists/${data.id}`)
    },
  })

  return (
    <Box css={{ minHeight: '100vh' }}>
      <Box paddingY="large" paddingX="small" css={{ alignItems: 'center' }}>
        <Columns alignY="center">
          <Column width="content" paddingRight="small">
            <Link href="/">
              <a>
                ←<VisuallyHidden>Back</VisuallyHidden>
              </a>
            </Link>
          </Column>

          <Column>
            <Text>Create a new list</Text>
          </Column>
        </Columns>
      </Box>

      <Box padding="small">
        <form
          onSubmit={async (ev) => {
            ev.preventDefault()

            if (!name || !colorScheme) return

            mutate({ name, colorScheme })
          }}
        >
          <Stack space="small">
            <Input
              label="List Name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />

            <Select
              label="Select a color"
              value={colorScheme}
              onChange={(ev) =>
                setColorScheme(ev.target.value as ListColorScheme)
              }
            >
              <option value="">Select a color</option>

              {Object.entries(listColors).map(([key, color]) => (
                <option key={key} value={key}>
                  {color.name}
                </option>
              ))}
            </Select>

            <Box paddingTop="large">
              <Button type="submit">Create</Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
