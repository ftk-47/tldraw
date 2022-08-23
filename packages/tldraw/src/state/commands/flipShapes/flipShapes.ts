import { TLBoundsCorner, Utils } from '@tldraw/core'
import { TLDR } from '~state/TLDR'
import type { TldrawApp } from '~state/TldrawApp'
import { FlipType } from '~types'
import type { TldrawCommand } from '~types'

export function flipShapes(app: TldrawApp, ids: string[], type: FlipType): TldrawCommand {
  const {
    selectedIds,
    currentPageId,
    page: { shapes },
  } = app

  const boundsForShapes = ids.map((id) => TLDR.getBounds(shapes[id]))

  const commonBounds = Utils.getCommonBounds(boundsForShapes)

  const { before, after } = TLDR.mutateShapes(
    app.state,
    ids,
    (shape) => {
      const shapeBounds = TLDR.getBounds(shape)
      switch (type) {
        case FlipType.Horizontal: {
          const newShapeBounds = Utils.getRelativeTransformedBoundingBox(
            commonBounds,
            commonBounds,
            shapeBounds,
            true,
            false
          )
          const dx = newShapeBounds.minX - shapeBounds.minX
          return {
            dx,
            transformedValue: TLDR.getShapeUtil(shape).transform(shape, newShapeBounds, {
              type: TLBoundsCorner.TopLeft,
              scaleX: -1,
              scaleY: 1,
              initialShape: shape,
              transformOrigin: [0.5, 0.5],
            }),
          }
        }
        case FlipType.Vertical: {
          const newShapeBounds = Utils.getRelativeTransformedBoundingBox(
            commonBounds,
            commonBounds,
            shapeBounds,
            false,
            true
          )
          return {
            dy: newShapeBounds.minY - shapeBounds.minY,
            transformedValue: TLDR.getShapeUtil(shape).transform(shape, newShapeBounds, {
              type: TLBoundsCorner.TopLeft,
              scaleX: 1,
              scaleY: -1,
              initialShape: shape,
              transformOrigin: [0.5, 0.5],
            }),
          }
        }
      }
    },
    currentPageId,
    true
  )

  return {
    id: 'flip',
    before: {
      document: {
        pages: {
          [currentPageId]: { shapes: before },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds,
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: { shapes: after },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
          },
        },
      },
    },
  }
}
