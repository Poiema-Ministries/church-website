# Testing Guide

## Overview

This project uses Jest and React Testing Library for unit testing. All page
components have corresponding test files that verify rendering, content
presence, and basic functionality.

## Setup

### Install Dependencies

Run the following command to install all testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-jest
```

**Note**: After installing dependencies, TypeScript errors in test files will be
resolved. The linter may show errors until dependencies are installed.

### Configuration Files

- `jest.config.js` - Jest configuration (stays as `.js` - this is the standard
  format for Jest)
- `jest.setup.ts` - Test setup file with mocks (TypeScript)
- `jest.d.ts` - TypeScript type declarations for Jest
- `__mocks__/` - Mock files (TypeScript)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory mirroring the `app` directory
structure:

```
__tests__/
  app/
    page.test.tsx
    bulletins/
      page.test.tsx
    contact-us/
      page.test.tsx
    ...
```

## Test Coverage

Current test coverage includes:

- ✅ Home page (`app/page.tsx`)
- ✅ Not Found page (`app/not-found.tsx`)
- ✅ Bulletins page (`app/bulletins/page.tsx`)
- ✅ Contact Us page (`app/contact-us/page.tsx`)
- ✅ Core Values page (`app/core-values/page.tsx`)
- ✅ Teams page (`app/teams/page.tsx`)
- ✅ Services page (`app/services/page.tsx`)
- ✅ Pastor page (`app/pastor/page.tsx`)
- ✅ Theology page (`app/theology/page.tsx`)
- ✅ Offering page (`app/offering/page.tsx`)
- ✅ Prayer Requests page (`app/prayer-requests/page.tsx`)
- ✅ New Members page (`app/new-members/page.tsx`)
- ✅ Past Events page (`app/past-events/page.tsx`)
- ✅ Past Events detail page (`app/past-events/[slug]/page.tsx`)
- ✅ Sermons page (`app/sermons/page.tsx`)

## Mocks

The following are mocked for testing:

- **Next.js Image**: Renders as a standard `<img>` tag
- **Next.js Router**: Mocked navigation hooks (`useRouter`, `usePathname`,
  `useSearchParams`)
- **Sanity Client**: Mocked fetch function for data fetching
- **Cloudinary**: Mocked `getAssetsFromCollection` function
- **Client Components**: Form components and complex client components are
  mocked

## Writing New Tests

When adding new pages or components, follow these patterns:

### Server Component Test

```typescript
import { render, screen } from '@testing-library/react';
import MyPage from '@/app/my-page/page';

describe('My Page', () => {
  it('should render the page with heading', () => {
    render(<MyPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Page');
  });
});
```

### Async Server Component Test

```typescript
import { render, screen } from '@testing-library/react';
import MyPage from '@/app/my-page/page';
import { client } from '@/sanity/lib/client';

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}));

const mockClient = client as jest.Mocked<typeof client>;

describe('My Page', () => {
  it('should render async data', async () => {
    mockClient.fetch.mockResolvedValue([{ id: '1', name: 'Test' }]);

    const component = await MyPage();
    render(component);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Continuous Integration

GitHub Actions automatically runs tests on:

- Pull requests to `main` and `develop` branches
- Pushes to `main` and `develop` branches

The workflow:

1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies
4. Runs the linter
5. Runs all unit tests
6. Uploads coverage reports (optional)

**PRs cannot be merged if tests fail.**

## Best Practices

1. **Test behavior, not implementation**: Focus on what users see and interact
   with
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText`, `getByText`
   over `getByTestId`
3. **Keep tests isolated**: Each test should be independent
4. **Mock external dependencies**: Sanity, Cloudinary, and other external
   services should be mocked
5. **Test edge cases**: Empty states, error states, and boundary conditions
6. **Maintain coverage**: Aim for at least 60% code coverage (configured in
   `jest.config.js`)

## Troubleshooting

### Tests fail with "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### Tests fail with TypeScript errors

Make sure `@types/jest` is installed and your `tsconfig.json` includes test
files.

### Async component tests fail

Ensure you're using `await` for async components and rendering the returned JSX
element.

### Coverage thresholds not met

Review the coverage report to identify untested code paths and add tests as
needed.
