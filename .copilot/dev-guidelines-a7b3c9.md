# Component Development Guidelines

## Component Structure
- Components should follow the Single Responsibility Principle
- Use `<script setup lang="ts">` for TypeScript support and composition API
- Organize template, script, and style sections in this order
- Use scoped styles to prevent CSS leakage

## Props Guidelines
- Define props using TypeScript interface with defineProps
- Include detailed type validation
- Provide default values when appropriate
- Add validators for enumerated values
- Document prop purpose in comments
- Use required: true for mandatory props

## Component Lifecycle
- Use composition API hooks (onMounted, onBeforeUnmount)
- Properly clean up resources in onBeforeUnmount
- Handle window events with proper cleanup

## Event Handling
- Use defineEmits for event declarations
- Emit meaningful events with structured data
- Include the component ID in emitted events for tracking

## Styling
- Use relative positioning for root elements
- Handle responsive layouts
- Include loading states and overlays
- Use BEM-like class naming
- Set explicit background colors
- Handle overflow appropriately

## State Management
- Use ref() for reactive primitive values
- Watch for prop changes that require updates
- Initialize state in setup phase

## Performance Considerations
- Cleanup resources when component is destroyed
- Use v-if for conditional rendering of expensive elements
- Handle resize events with debouncing
- Dispose of heavy resources (like 3D engines)

## Error Handling
- Validate inputs before processing
- Include early returns for invalid states
- Check for null values before operations

## Component Communication
- Use props for parent-to-child communication
- Use events for child-to-parent communication
- Include necessary type information in events

## File Organization
- Place components in appropriate atomic folders (atoms/molecules/organisms)
- Name components using PascalCase
- Use .vue extension for component files

## Code Style
- Use TypeScript for type safety
- Include JSDoc comments for complex logic
- Follow consistent indentation (2 spaces)
- Group similar functionality together
- Use meaningful variable names
