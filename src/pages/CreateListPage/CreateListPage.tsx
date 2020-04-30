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
import { listColors } from '../../modules/lists/types'
/** @jsx jsx */ jsx

export const CreateListPage = () => {
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
        <Stack space="small">
          <Input label="List Name" />

          <Input as="select" label="Select a color">
            <option value="">Select a color</option>

            {Object.entries(listColors).map(([key, color]) => (
              <option key={key} value={key}>
                {color.name}
              </option>
            ))}
          </Input>

          <Box paddingTop="large">
            <Button>Create</Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
