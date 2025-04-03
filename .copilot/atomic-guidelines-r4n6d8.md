# Atomic Components Guidelines

## Observed Patterns
### Component Types
1. **Interactive Components**
   - DragHandle: Basic interaction element
   - DockablePanel: Complex interactive container
   - DragOverlay: Visual feedback component

2. **Viewport Components**
   - BabylonViewport: Complex rendering component

### Common Characteristics
1. **Single Responsibility**
   - Each component has a clear, focused purpose
   - Functionality is encapsulated and self-contained

2. **Props Structure**
   ```typescript
   interface Props {
     id: string;           // Unique identifier
     active?: boolean;     // State control
     initialConfig?: {};   // Initial settings
   }
   ```

3. **Event Architecture**
   ```typescript
   const emit = defineEmits<{
     (e: 'stateChange', payload: StatePayload): void;
     (e: 'action', payload: ActionPayload): void;
   }>()
   ```

### Implementation Standards
1. **Loading States**
   - Use overlay with v-progress-circular
   - Maintain consistent loading UX

2. **Resource Management**
   - Cleanup in onBeforeUnmount
   - Handle window events properly
   - Dispose of heavy resources

3. **Visual Feedback**
   - Consistent transition durations (0.2s)
   - Clear hover/active states
   - Proper use of opacity for overlays

4. **Style Structure**
   ```css
   .component-root {
     position: relative;
     /* Base styling */
   }

   .component-root.state-modifier {
     /* State variations */
   }

   .component-element {
     /* Child elements */
   }
   ```

### Testing Requirements
1. **Core Test Cases**
   - Component mounting
   - Props validation
   - Event emissions
   - State management
   - Resource cleanup

2. **Mock Strategies**
   - External libraries (BabylonJS)
   - DOM APIs
   - Event handlers

## Quality Standards
1. **Performance**
   - Efficient event handling
   - Proper cleanup
   - Controlled re-renders

2. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Touch support

3. **Maintainability**
   - Clear file structure
   - Consistent naming
   - Thorough documentation

## Usage Examples
```vue
<template>
  <DragHandle
    :element-id="uniqueId"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
  />
</template>

<template>
  <DockablePanel
    :id="panelId"
    :initial-width="300"
    :initial-height="200"
    title="Panel Title"
  >
    <template #default>
      Content
    </template>
  </DockablePanel>
</template>
```
