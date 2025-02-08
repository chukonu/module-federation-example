__Experiment 1__

```
.
├── app-shell
└── domain1
```

`app-shell` is an application shell that lazily loads a component `Domain1`
from a separate build from the project `domain1`.

Findings

- Use `shareStrategy: "loaded-first"` in both `app-shell` and `domain1` to avoid loading duplicate common dependencies.

- Use `provideExternalRuntime` and `externalRuntime` to reduce the size of the provider.

