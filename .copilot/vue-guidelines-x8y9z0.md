# Vue Component Development Guidelines

## Component Architecture
### Atomic Design Structure
- Use atomic design principles (atoms, molecules, organisms)
- Atoms should be the smallest possible functional units
- Components must be fully self-contained and reusable

## Technical Requirements
### TypeScript Integration
- Use `<script setup lang="ts">` syntax
- Define explicit interfaces for props and events
- Utilize type inference where possible
- Export component types when needed

### Props Definition
```typescript
const props = defineProps<{
  required: string,
  optional?: string,
  validated: string
}>()
```

### Event Handling
```typescript
const emit = defineEmits<{
  (e: 'eventName', payload: EventPayload): void
}>()
```

## Component Structure
### Template Guidelines
- Keep templates focused and minimal
- Use semantic HTML elements
- Implement loading states for async operations
- Handle error states explicitly

### Style Guidelines
- Use scoped styles by default
- Follow BEM naming convention
- Define responsive breakpoints
- Handle component states (hover, active, disabled)
- Use CSS variables for theming

### State Management
- Use `ref()` and `reactive()` appropriately
- Implement proper cleanup in `onBeforeUnmount`
- Handle side effects in `watch` and `watchEffect`
- Use computed properties for derived state

## Performance Optimization
- Implement proper resource cleanup
- Use v-show for frequently toggled content
- Implement debouncing for frequent events
- Lazy load heavy dependencies

## Error Handling
- Implement input validation
- Use type guards
- Handle async errors
- Provide meaningful error states

## Documentation
- Document complex logic with JSDoc
- Include usage examples
- Document props and events
- Specify component dependencies
