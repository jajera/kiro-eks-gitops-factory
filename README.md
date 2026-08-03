# kiro-eks-gitops-factory

A repeatable EKS and Argo CD app factory with thin Kiro prompts, hard
guardrails, and no chat-side cluster apply.

Published at [jajera.github.io/kiro-eks-gitops-factory](https://jajera.github.io/kiro-eks-gitops-factory/).
The factory itself lives in [jajera/kiro-eks-argocd-migration](https://github.com/jajera/kiro-eks-argocd-migration).

## What this is / What this is not

| This repository                               | Source factory repository                                |
| --------------------------------------------- | -------------------------------------------------------- |
| Starlight walkthrough of the factory          | Implementation: `.kiro/`, GitOps trees, Gatekeeper, CI   |
| Explains why, how, labs, screenshots          | Where you clone, run gator/kustomize, run Kiro `add-app` |
| May vendor or link to screenshots from source | Owns manifests, hooks, skills, policy                    |

**Run all factory commands from the factory repo (`jajera/kiro-eks-argocd-migration`),
not from this documentation repo.** This site only documents.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run validate   # prettier + markdownlint
npm run build      # astro build (also npm test)
npm run check:content  # optional authoring aid for screenshot and content invariants
```
