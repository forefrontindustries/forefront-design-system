import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as r}from"./button-DomwnaoM.js";import"./iframe-DEH88qfi.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Components/Button",component:r,args:{children:"Request access",variant:"primary",size:"md"},argTypes:{variant:{control:"inline-radio",options:["primary","secondary","ghost","danger"]},size:{control:"inline-radio",options:["sm","md","lg"]}},parameters:{docs:{description:{component:"Every visual difference between variants and sizes comes from tier 3 tokens. The focus ring is one shared rule, so a new variant cannot ship with a weaker ring than the others."}}}},n={},a={parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Primary"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"ghost",children:"Ghost"}),e.jsx(r,{variant:"danger",children:"Delete workspace"})]})},s={parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[e.jsx(r,{size:"sm",children:"Small"}),e.jsx(r,{size:"md",children:"Medium"}),e.jsx(r,{size:"lg",children:"Large"})]})},t={parameters:{controls:{disable:!0},docs:{description:{story:"Loading keeps the button focusable and marks it aria-busy, so a screen reader user hears the state change instead of losing focus. Disabled uses the real attribute, which is correct only when the control cannot become usable from where the user is standing."}}},render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(r,{loading:!0,children:"Saving"}),e.jsx(r,{disabled:!0,children:"Disabled"}),e.jsx(r,{variant:"secondary",loading:!0,children:"Publishing"})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap"
  }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete workspace</Button>
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div style={{
    display: "flex",
    gap: "0.75rem",
    alignItems: "center"
  }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      description: {
        story: "Loading keeps the button focusable and marks it aria-busy, so a screen reader user hears the state change instead of losing focus. Disabled uses the real attribute, which is correct only when the control cannot become usable from where the user is standing."
      }
    }
  },
  render: () => <div style={{
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap"
  }}>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button variant="secondary" loading>
        Publishing
      </Button>
    </div>
}`,...t.parameters?.docs?.source}}};const u=["Primary","AllVariants","Sizes","States"];export{a as AllVariants,n as Primary,s as Sizes,t as States,u as __namedExportsOrder,c as default};
