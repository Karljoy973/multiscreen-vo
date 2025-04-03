import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DockablePanel from './DockablePanel.vue'

// Mock DragHandle component
vi.mock('./DragHandle.vue', () => ({
  default: {
    name: 'DragHandle',
    template: '<div class="drag-handle-mock"></div>',
    props: ['elementId']
  }
}))

// Mock Vuetify components
const createVuetifyMock = () => {
  return {
    global: {
      stubs: {
        'v-btn': {
          template: '<button><slot /></button>',
          props: ['icon', 'density', 'variant']
        }
      }
    }
  }
}

describe('DockablePanel Component', () => {
  it('renders with default props', () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel'
      },
      ...createVuetifyMock()
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('dockable-panel')
    expect(wrapper.find('.panel-title').text()).toBe('Panel')
  })

  it('uses provided title', () => {
    const title = 'Custom Panel'
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel',
        title
      },
      ...createVuetifyMock()
    })

    expect(wrapper.find('.panel-title').text()).toBe(title)
  })

  it('applies initial position and size', () => {
    const initialWidth = 400
    const initialHeight = 300
    const initialTop = 50
    const initialLeft = 60

    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel',
        initialWidth,
        initialHeight,
        initialTop,
        initialLeft
      },
      ...createVuetifyMock()
    })

    const style = wrapper.attributes('style')
    expect(style).toContain(`width: ${initialWidth}px`)
    expect(style).toContain(`height: ${initialHeight}px`)
    expect(style).toContain(`top: ${initialTop}px`)
    expect(style).toContain(`left: ${initialLeft}px`)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel'
      },
      ...createVuetifyMock()
    })

    const closeButton = wrapper.findAll('button')[2] // Third button (after minimize and maximize)
    await closeButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted()).toHaveProperty('update:active')
    expect(wrapper.emitted()['update:active'][0]).toEqual([false])
  })

  it('emits minimize event when minimize button is clicked', async () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel'
      },
      ...createVuetifyMock()
    })

    const minimizeButton = wrapper.findAll('button')[0] // First button
    await minimizeButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('minimize')
    const event = wrapper.emitted().minimize[0][0]
    expect(event).toEqual({ id: 'test-panel', minimized: true })
  })

  it('toggles maximize state when maximize button is clicked', async () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel',
        initialWidth: 300,
        initialHeight: 200
      },
      ...createVuetifyMock()
    })

    const maximizeButton = wrapper.findAll('button')[1] // Second button

    // Initial state
    expect(wrapper.classes()).not.toContain('is-maximized')

    // Click to maximize
    await maximizeButton.trigger('click')
    expect(wrapper.classes()).toContain('is-maximized')
    expect(wrapper.emitted()).toHaveProperty('maximize')

    // Click again to restore
    await maximizeButton.trigger('click')
    expect(wrapper.classes()).not.toContain('is-maximized')
    expect(wrapper.emitted()).toHaveProperty('restore')
  })

  it('applies docked position classes', () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel',
        initialDockPosition: 'left'
      },
      ...createVuetifyMock()
    })

    expect(wrapper.classes()).toContain('dock-left')
  })

  it('hides resize handles when maximized', async () => {
    const wrapper = mount(DockablePanel, {
      props: {
        id: 'test-panel'
      },
      ...createVuetifyMock()
    })

    // Initially visible
    expect(wrapper.findAll('.resize-handle').length).toBe(3)

    // Maximize
    const maximizeButton = wrapper.findAll('button')[1]
    await maximizeButton.trigger('click')

    // Should be hidden
    expect(wrapper.findAll('.resize-handle').length).toBe(0)
  })
});
