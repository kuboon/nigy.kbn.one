---
applyTo: "**"
---

# Deno

deno docs: https://docs.deno.com/runtime/

- Deno is similar to Node.js, but it has built-in TypeScript support.
- Deno has node.js compatibility, but better to use Deno's own APIs.
- Deno uses ES modules and has a different module resolution system.
- Deno does not use `package.json` or `node_modules`. Instead, it uses
  deno.json.
- Deno can import modules directly from URLs like browser.
- use `jsr:@std` instead `deno.land/std`
- add imports in `deno.json` first.

# Deno.test

https://docs.deno.com/runtime/fundamentals/testing/

- Deno provides a built-in test runner, so you can write tests without
  additional dependencies.
- Define tests using the `Deno.test()` function. Pass a test name and a test
  function.
- `t.step` makes group of tests.
- Use assertion functions from `jsr:@std/assert` (e.g., `assertEquals`) for
  assertions.
- Name test files following Deno's recommendations, such as `*.test.ts`
- Run tests with the `deno test` command.
- Asynchronous tests are supported using `async` functions.
- Use `beforeAll`, `afterAll`, `beforeEach`, and `afterEach` for test setup and
  cleanup.
- Tests run in a sandboxed environment by default (explicit permissions are
  required for file access, etc.).
- Test coverage can be measured with `deno test --coverage`.

```test_example.ts
Deno.test({
  name: "test group name",
  async fn(t) {
    await t.step({
      name: "test name",
      async fn(t) {
        const result = await someFunc();
        assertEquals(result, "hoge");
      }
    })
  }
})
```
