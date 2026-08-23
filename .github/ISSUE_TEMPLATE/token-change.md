---
name: Token change
about: Propose a new token, a rename, a value change, or a new theme
title: "[tokens] "
labels: ["tokens", "triage"]
---

## Which tier

- [ ] Tier 1 primitive (a literal, references nothing)
- [ ] Tier 2 semantic contract (intent name, value-less, every theme must supply it)
- [ ] Tier 3 component token (geometry)
- [ ] Density override (tier 3 only, never colour)
- [ ] New theme

## The change

<!-- Proposed name, proposed alias target, and the intent description that will become $description. -->

| Field | Value |
| --- | --- |
| Name | |
| Type | |
| Alias target | |
| Intent | |

## Why an existing token does not work

<!-- Required. A new semantic token is a change to every theme at once, so the bar is a real gap in
     the contract rather than a preference. -->

## Theme values

<!-- A tier 2 addition needs a value for every theme. List them. -->

| Theme | Value |
| --- | --- |
| forefront-dark | |
| forefront-light | |

## Contrast

<!-- If this is a colour used for text or a border, name the pair it will be measured against.
     The build will check it, but say what you expect. -->

## Blast radius

- Surfaces affected:
- Platform artifacts affected: <!-- css / tailwind / ts / native / figma / md3 -->
- Version bump under VERSIONING.md:

## Migration

<!-- Required for a rename or removal. Before and after, and whether a codemod is needed. -->
