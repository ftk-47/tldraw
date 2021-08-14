import * as React from 'react'
import { mockDocument, renderWithContext } from '+test-utils'
import { Canvas } from './canvas'

describe('page', () => {
  test('mounts component', () => {
    renderWithContext(
      <Canvas
        page={mockDocument.page}
        pageState={mockDocument.pageState}
        hideBounds={false}
        hideIndicators={false}
        hideHandles={false}
      />
    )
  })
})
