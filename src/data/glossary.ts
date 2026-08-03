export const glossary: Record<string, string> = {
  // Platform and path
  eks: "Amazon Elastic Kubernetes Service — the managed Kubernetes control plane this factory targets.",
  "argo-cd":
    "GitOps continuous delivery controller that syncs Kubernetes manifests from Git into the cluster.",
  argocd:
    "GitOps continuous delivery controller that syncs Kubernetes manifests from Git into the cluster.",
  gitops:
    "Operate the cluster from Git as the source of truth — changes land as PRs, then sync, not as ad-hoc kubectl.",
  ecr: "Amazon Elastic Container Registry — image registry used when the factory retags or pulls app images.",
  ecs: "Amazon Elastic Container Service — one of the existing runtimes apps may migrate from onto EKS.",
  podman:
    "Daemonless container engine — another common source runtime this factory helps migrate from.",
  "source-factory":
    "jajera/kiro-eks-argocd-migration — the upstream factory repo with Terraform, policy, `.kiro/` contract, and runnable labs; this site is docs only.",

  // Kubernetes building blocks
  kustomize:
    "Kubernetes config tool that builds base + overlay trees into deployable manifests without templates.",
  overlay:
    "Environment-specific Kustomize layer (for example `dev-eks-1` / `prod-eks-1`) on top of a shared base.",
  "dual-overlay":
    "Factory default: every app gets both a dev and a prod overlay so promotion stays the same shape.",
  pdb: "PodDisruptionBudget — limits voluntary disruptions; the factory scar requires replicas >= 2 when minAvailable is 1.",
  poddisruptionbudget:
    "PodDisruptionBudget — limits voluntary disruptions; the factory scar requires replicas >= 2 when minAvailable is 1.",
  iam: "AWS Identity and Access Management — you still shrink roles to least privilege; the factory does not invent that judgement.",
  dns: "Domain Name System — app hostnames and private zones stay a human cutover concern.",
  tls: "Transport Layer Security — certificates and HTTPS termination stay outside the factory draft.",
  alb: "AWS Application Load Balancer — common ingress target once an app is live on the cluster.",
  hostnetwork:
    "Pod setting that shares the node network namespace — hooks refuse it as a forbidden pattern.",
  runasroot:
    "Container running as UID 0 — policy and hooks treat this as a gap unless explicitly allowed.",

  // Policy and admission
  gatekeeper:
    "OPA Gatekeeper — Kubernetes admission controller that evaluates ConstraintTemplates against cluster objects.",
  gator:
    "Gatekeeper offline CLI — runs `gator verify` against constraint suites without a live cluster (Lab A).",
  "gator-verify":
    "Offline Gatekeeper test runner that evaluates constraint suites and cases before any cluster exists.",
  "constraint-template":
    "Gatekeeper CRD that defines a Rego policy and the shape of parameters a Constraint can set.",
  constrainttemplate:
    "Gatekeeper CRD that defines a Rego policy and the shape of parameters a Constraint can set.",
  constraint:
    "Gatekeeper object that binds a ConstraintTemplate to a match scope (kinds, namespaces, labels).",
  rego: "OPA policy language — Gatekeeper ConstraintTemplates embed Rego `violation` rules that gator and the webhook both evaluate.",
  suite:
    "Gatekeeper test Suite — wires a template, a constraint, and named pass/fail object cases for `gator verify`.",
  ingress:
    "Kubernetes API object that exposes HTTP/HTTPS routes into the cluster — often an ALB Ingress on EKS.",
  waf: "AWS WAF — web application firewall; this factory expects a regional WAFv2 Web ACL on internet-facing ALB Ingress.",
  wafv2:
    "AWS WAFv2 — current WAF API; `k8singresswafv2` requires a valid regional Web ACL ARN on public Ingress.",
  "web-acl":
    "WAFv2 Web ACL — the filter set attached to an ALB; internet-facing Ingress must reference a regional ARN.",
  nodeport:
    "Service type that opens a port on every node — blocked here so traffic enters via Ingress/ALB instead of node ports.",
  rbac: "Kubernetes Role-Based Access Control — Roles, ClusterRoles, and bindings that grant API permissions.",
  networkpolicy:
    "Kubernetes NetworkPolicy — namespace-scoped rules for pod ingress/egress; this set requires egress to be defined.",
  privileged:
    "Pod/container security context with `privileged: true` — nearly full host capabilities; blocked by Gatekeeper here.",
  "allow-privilege-escalation":
    "Container securityContext flag; when true a process can gain more privileges than its parent — blocked here.",
  "host-namespaces":
    "Sharing the host PID or IPC namespace with a pod — blocked so workloads cannot see or signal host processes.",
  "host-filesystem":
    "Mounting hostPath volumes into a pod — blocked except where an allow-list explicitly permits a path.",
  "deprecated-api":
    "A Kubernetes API version the cluster version has already deprecated — `verifydeprecatedapi` rejects those objects.",

  // Factory contract (.kiro)
  kiro: "Amazon's agentic IDE — runs vibe or spec sessions against the factory's `.kiro/` steering, skills, and hooks.",
  steering:
    "Always-on and conditional markdown in `.kiro/steering/` that encodes naming, overlays, clusters, and archetypes a reviewer would otherwise carry in their head.",
  skill:
    "Ordered procedure under `.kiro/skills/` (for example `add-app`) so the agent follows one sequence instead of inventing a tree each time.",
  skills:
    "Ordered procedures under `.kiro/skills/` (for example `add-app`) so the agent follows one sequence instead of inventing a tree each time.",
  hook: "Hard gate in `.kiro/hooks/` that can refuse shell, scaffolds, or builds regardless of how the prompt is phrased.",
  hooks:
    "Hard gates in `.kiro/hooks/` that refuse forbidden paths, bad PDBs, and live cluster apply from chat.",
  agent:
    "Kiro agent bundle (for example `eks-migration`) that loads steering and skills so one thin prompt activates the contract.",
  mcp: "Model Context Protocol adapters — docs MCP stays on; live cluster adapters stay off until a human intentionally enables them.",
  "add-app":
    "Factory skill that scaffolds a dual-overlay app tree from a thin prompt (Lab C).",
  "migrate-workload":
    "Factory skill that runs gated discovery before scaffolding a migration into the shared tree shape.",
  "promote-app":
    "Factory skill path for promoting an already-shaped app across environments without inventing a new layout.",

  // Session shape
  autopilot:
    "Kiro autonomy mode that applies edits and yields at the end of the turn — default for Lab C scaffolding.",
  supervised:
    "Kiro autonomy mode that yields after every file-editing turn so you accept or reject hunks before it continues.",
  vibe: "Thin natural-language session — short prompt, guardrails do the shaping; Lab C is the vibe case.",
  spec: "Structured requirements → design → tasks under `.kiro/specs/` — preferred for novel platform work.",
  pr: "Pull request — the human merge gate; Argo CD only syncs what lands in Git after review.",
  "web-service":
    "Workload archetype in steering for HTTP services — Lab C's `demo-nginx` uses this shape.",
};
