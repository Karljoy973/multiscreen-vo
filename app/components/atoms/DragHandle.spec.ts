import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DragHandle from './DragHandle.vue'

describe('DragHandle Component', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(DragHandle, {
      props: {
        elementId: 'test-element'
      }
    });
  })

  it('renders three dots', () => {
    const dots = wrapper.findAll('.dot');
    expect(dots.length).toBe(3);
  })

  it('has inactive styling by default', () => {
    expect(wrapper.classes()).not.toContain('active');
  })

  it('emits dragStart event on mousedown', async () => {
    const mockEvent = {
      preventDefault: vi.fn()
    }

    await wrapper.trigger('mousedown', mockEvent);

    expect(wrapper.emitted()).toHaveProperty('dragStart');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(wrapper.vm.isDragging).toBe(true);
  })

  it('adds active class when dragging', async () => {
    await wrapper.trigger('mousedown');
    await wrapper.vm.$nextTick();

    expect(wrapper.classes()).toContain('active');
  })

  it('emits dragEnd event when drag stops', async () => {
    // Start dragging
    await wrapper.trigger('mousedown');

    // Simulate mouseup on document
    const mouseupEvent = new Event('mouseup');
    document.dispatchEvent(mouseupEvent);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()).toHaveProperty('dragEnd');
    expect(wrapper.vm.isDragging).toBe(false);
  })
})
