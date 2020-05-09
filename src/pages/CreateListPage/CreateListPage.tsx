import { jsx } from '@emotion/core'
import Link from 'next/link'
import { fetch } from '../../lib/fetch'
import Router from 'next/router'
import { useState } from 'react'
import { useMutation } from 'rhdf'
import { Box } from '../../components/Box'
import { Button } from '../../components/Button'
import { Column } from '../../components/Column'
import { Columns } from '../../components/Columns'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Stack } from '../../components/Stack'
import { Text } from '../../components/Text'
import { VisuallyHidden } from '../../components/VisuallyHidden'
import { List, listColors, ListColorScheme } from '../../modules/lists/types'
/** @jsx jsx */ jsx

export const CreateListPage = () => {
  const [name, setName] = useState('')
  const [colorScheme, setColorScheme] = useState<ListColorScheme | ''>('')

  const { mutate } = useMutation<List>({
    onSuccess: (data, cache) => cache.set(`/lists/${data.id}`, data),
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

            // TODO: error validation / handling?
            if (!name || !colorScheme) return

            // TODO: some generic fetch utilities?
            const list = await fetch(`/api/lists`, {
              method: 'post',
              mode: 'same-origin',
              headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, colorScheme }),
            }).then((res) => {
              if (res.status >= 300) {
                throw new Error(
                  `Failed to fetch: responded with status ${res.status}`
                )
              }

              return res.json()
            })

            mutate(() => ({ ...list, items: [], itemIds: [] }))

            Router.push('/lists/[listId]', `/lists/${list.id}`)
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
