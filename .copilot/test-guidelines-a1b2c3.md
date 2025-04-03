# Vue Component Testing Guidelines

## Test File Structure
```typescript
import { mount } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'

describe('ComponentName', () => {
  // Test suite structure
})
```

## Test Categories
### 1. Component Mounting
- Test basic rendering
- Verify initial state
- Check prop validation
- Verify default slots

### 2. Props Testing
- Test required props
- Verify default values
- Test prop validators
- Check prop reactivity

### 3. Event Testing
- Test event emissions
- Verify event payloads
- Test event handlers
- Check custom events

### 4. State Management
- Test reactive state
- Verify computed properties
- Check watchers
- Test state mutations

### 5. Lifecycle Hooks
- Test mounted hooks
- Verify cleanup
- Test async operations
- Check error handling

## Testing Best Practices
### Setup and Teardown
```typescript
beforeEach(() => {
  // Setup component instance
})

afterEach(() => {
  // Cleanup
})
```

### Mocking
- Mock external dependencies
- Use vi.mock for modules
- Mock complex child components
- Simulate API calls

### Async Testing
```typescript
test('async behavior', async () => {
  await flushPromises()
  // Assert after async operations
})
```

### Snapshot Testing
- Use for UI regressions
- Keep snapshots focused
- Update intentionally
- Review changes carefully

## Testing Tools
- Vitest as test runner
- @vue/test-utils for component testing
- MSW for API mocking
- happy-dom for DOM environment

## Coverage Guidelines
- Aim for 80%+ coverage
- Test all props combinations
- Cover error cases
- Test edge cases

## Test Organization
- Group related tests
- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)
- Keep tests independent
