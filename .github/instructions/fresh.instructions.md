---
applyTo: "**/*.{ts,tsx}"
---

# Copilot Instructions for Fresh Framework

https://fresh.deno.dev/docs/concepts/architecture

- use `globalThis` instead `window`
- `button` jsx element should have `type="button"`

## Routing

- Fresh uses file-based routing. File names in the `routes/` directory map
  directly to URL paths.
- Dynamic routes can be created using `[param]` for single parameters and
  `[...param]` for wildcard parameters.
- Use `index.tsx` for root-level routes or folder-specific index routes.
- Route groups can be created using folders wrapped in parentheses
  `(group-name)`. These allow for shared layouts or middlewares within the
  group.
- Private folders (e.g., `_components`) are ignored by Fresh and can be used for
  co-located components.

## Islands Architecture

- Fresh employs the islands architecture, where static HTML is sent to the
  client by default.
- Interactive components, called "islands," are hydrated on the client. These
  are defined in the `islands/` directory.
- Islands are isolated Preact components and should only include serializable
  props.
- Use `IS_BROWSER` to guard code that should only run in the browser (e.g.,
  client-only APIs like `EventSource`).

## Components and Layouts

- Components can be stored in the `components/` directory for reuse across
  routes and islands.
- Layouts can be defined using `_layout.tsx` files. These apply to all routes
  within the same folder or group.

## Best Practices

- Minimize client-side JavaScript by leveraging server-side rendering for static
  content.
- Group related routes, components, and islands to improve maintainability.
- Avoid ambiguous routes by ensuring no two files map to the same URL.
- use `class` instead of `className` in jsx.

## Advanced Features

- Custom URL patterns can be defined using the `routeOverride` property in the
  route configuration.
- Nested islands are supported and act like regular Preact components, receiving
  serialized props if provided.

## Notes

- Ensure all props passed to islands are serializable (e.g., strings, numbers,
  booleans, arrays, etc.).
- Use co-location to organize components and islands closer to their respective
  routes for better structure.
