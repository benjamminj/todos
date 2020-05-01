import Link from 'next/link'
import { Box } from '../../components/Box'
import { Text } from '../../components/Text'
import { Columns } from '../../components/Columns'
import { Column } from '../../components/Column'
import { VisuallyHidden } from '../../components/VisuallyHidden'
import { Button } from '../../components/Button'
import { jsx } from '@emotion/core'
import { Input } from '../../components/Input'
import { Stack } from '../../components/Stack'
import { listColors, ListColorScheme, List } from '../../modules/lists/types'
import { Select } from '../../components/Select'
import { useState } from 'react'
import { ListService } from '../../modules/lists/list.service'
import { useMutation } from 'rhdf'
import Router from 'next/router'
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
          onSubmit={(ev) => {
            ev.preventDefault()
            console.log(name, colorScheme)
            // TODO: error validation / handling?
            if (!name || !colorScheme) return

            const list = ListService.createList({ name, colorScheme })
            mutate(() => ({ ...list, items: [] }))

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
