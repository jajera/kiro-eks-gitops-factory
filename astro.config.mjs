import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeVintage from "starlight-theme-vintage";
import { starlightBasePath } from "starlight-base-path";

const title = "EKS GitOps Factory";
const description =
  "Repeatable EKS and Argo CD app factory: skills generate, hooks enforce, humans approve.";

export default defineConfig({
  site: "https://jajera.github.io",
  base: "/kiro-eks-gitops-factory/",
  integrations: [
    starlight({
      title,
      description,
      favicon: "/favicon.svg",
      head: [
        { tag: "meta", attrs: { property: "og:title", content: title } },
        {
          tag: "meta",
          attrs: { property: "og:description", content: description },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content:
              "https://jajera.github.io/kiro-eks-gitops-factory/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "1200" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "630" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary_large_image" },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content:
              "https://jajera.github.io/kiro-eks-gitops-factory/og-image.png",
          },
        },
      ],
      plugins: [starlightThemeVintage(), starlightBasePath()],
      components: {
        Head: "./src/overrides/Head.astro",
      },
      social: [
        {
          icon: "github",
          label: "Source Repository",
          href: "https://github.com/jajera/kiro-eks-gitops-factory",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/jajera/kiro-eks-gitops-factory/edit/main/",
      },
      sidebar: [
        { label: "Home", link: "/" },
        { label: "Why manual onboarding breaks", slug: "why" },
        { label: "Building blocks you will touch", slug: "concepts" },
        { label: "Install the toolchain", slug: "setup" },
        { label: "Prove policy offline (Lab A)", slug: "lab-a" },
        {
          label: "What makes prompts safe",
          items: [
            { label: "Lab B — .kiro/ hub", slug: "lab-b" },
            { label: "Project profile map", slug: "map-project-profile" },
            { label: "Workload archetypes map", slug: "map-workload-archetypes" },
            { label: "GitOps conventions map", slug: "map-gitops-conventions" },
            { label: "add-app scaffold map", slug: "map-add-app" },
            { label: "manage-clusters map", slug: "map-manage-clusters" },
            { label: "migrate-workload map", slug: "map-migrate-workload" },
            { label: "promote-app map", slug: "map-promote-app" },
          ],
        },
        { label: "Onboard an app (Lab C)", slug: "lab-c" },
        { label: "Lab D (out of scope)", slug: "lab-d-reference" },
        { label: "Choose an autonomy mode", slug: "autonomy-modes" },
        { label: "Vibe or spec, and when", slug: "vibe-vs-spec" },
        { label: "Known scars and fixes", slug: "gotchas" },
        { label: "Evidence checklist", slug: "done" },
      ],
    }),
  ],
});
