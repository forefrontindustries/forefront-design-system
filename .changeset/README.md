# Changesets

Every change to a published package needs a changeset. It is the only thing that writes the
changelog, and the changelog is the part a consuming team actually reads.

```bash
bunx changeset
```

Pick the package, pick the bump ([VERSIONING.md](../VERSIONING.md) says which), and write the line
that will appear in the release notes. Name what changed, name the replacement if something went
away, and say what the reader should do now. For a token change, list the platform artifacts it
touches so a mobile engineer can tell whether the release affects them.

CI fails a pull request that changes a published package with no changeset.
