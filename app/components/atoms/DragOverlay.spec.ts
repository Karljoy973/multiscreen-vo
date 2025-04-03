import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DragOverlay from './DragOverlay.vue'

describe('DragOverlay Component', () => {
  let wrapper: any;
  const defaultDropZones = [
    {
      x: 100,
      y: 200,
      width: 300,
      height: 400,
      canDrop: true,
      isHovering: false
    }
  ];

  beforeEach(() => {
    wrapper = mount(DragOverlay);
  });

  it('renders with default props', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('drag-overlay');
    expect(wrapper.classes()).not.toContain('active');
  });

  it('applies active class when isActive is true', () => {
    wrapper = mount(DragOverlay, {
      props: {
        isActive: true
      }
    });
    expect(wrapper.classes()).toContain('active');
  });

  it('applies custom opacity through CSS variable', () => {
    const opacity = 0.8;
    wrapper = mount(DragOverlay, {
      props: {
        opacity
      }
    });
    
    const style = wrapper.attributes('style');
    expect(style).toContain(`--overlay-opacity: ${opacity}`);
  });

  describe('Drop Zones', () => {
    it('renders drop zones correctly', () => {
      wrapper = mount(DragOverlay, {
        props: {
          dropZones: defaultDropZones
        }
      });

      const zones = wrapper.findAll('.drop-zone');
      expect(zones.length).toBe(1);

      const zoneStyle = zones[0].attributes('style');
      expect(zoneStyle).toContain('left: 100px');
      expect(zoneStyle).toContain('top: 200px');
      expect(zoneStyle).toContain('width: 300px');
      expect(zoneStyle).toContain('height: 400px');
    });

    it('applies correct classes for drop zone states', () => {
      const dropZones = [
        { ...defaultDropZones[0], x: 100, y: 200, width: 300, height: 400, canDrop: true, isHovering: false },
        { ...defaultDropZones[0], x: 100, y: 200, width: 300, height: 400, canDrop: false, isHovering: true }
      ];

      wrapper = mount(DragOverlay, {
        props: { dropZones }
      });

      const zones = wrapper.findAll('.drop-zone');
      
      // First zone should have can-drop class but not hover
      expect(zones[0].classes()).toContain('can-drop');
      expect(zones[0].classes()).not.toContain('hover');

      // Second zone should have hover class but not can-drop
      expect(zones[1].classes()).not.toContain('can-drop');
      expect(zones[1].classes()).toContain('hover');
    });

    it('renders drop zone indicators', () => {
      wrapper = mount(DragOverlay, {
        props: {
          dropZones: defaultDropZones
        }
      });

      const indicators = wrapper.findAll('.drop-zone-indicator');
      expect(indicators.length).toBe(defaultDropZones.length);
    });
  });

  describe('Computed Properties', () => {
    it('showOverlay is true when active and has drop zones', () => {
      wrapper = mount(DragOverlay, {
        props: {
          isActive: true,
          dropZones: defaultDropZones
        }
      });

      expect(wrapper.vm.showOverlay).toBe(true);
    });

    it('showOverlay is false when inactive', () => {
      wrapper = mount(DragOverlay, {
        props: {
          isActive: false,
          dropZones: defaultDropZones
        }
      });

      expect(wrapper.vm.showOverlay).toBe(false);
    });

    it('showOverlay is false when no drop zones', () => {
      wrapper = mount(DragOverlay, {
        props: {
          isActive: true,
          dropZones: []
        }
      });

      expect(wrapper.vm.showOverlay).toBe(false);
    });
  });

  describe('Props Validation', () => {
    it('accepts default props', () => {
      const wrapper = mount(DragOverlay);
      expect(wrapper.props()).toEqual({
        isActive: false,
        dropZones: [],
        opacity: 0.6
      });
    });

    it('validates dropZones array structure', () => {
      const validZone = defaultDropZones[0];
      expect(() => {
        mount(DragOverlay, {
          props: {
            dropZones: validZone ? [validZone] : []
          }
        });
      }).not.toThrow();
    });
  });
});
