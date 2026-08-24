import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-C41lUwqY.js";import"./preload-helper-D1UD9lgW.js";function o({tone:r="neutral",dot:a=!1,children:n,...s}){return e.jsxs("span",{...s,className:"fds-badge","data-tone":r,children:[a?e.jsx("span",{className:"fds-badge-dot","aria-hidden":"true"}):null,n]})}o.__docgenInfo={description:`Badge.

Accessibility contract: tone is never the only signal. The label always carries the
meaning in text, so colour-blind users and screen readers get the same information.`,methods:[],displayName:"Badge",props:{tone:{required:!1,tsType:{name:"union",raw:'"neutral" | "accent" | "success" | "warning" | "danger" | "info"',elements:[{name:"literal",value:'"neutral"'},{name:"literal",value:'"accent"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"danger"'},{name:"literal",value:'"info"'}]},description:"",defaultValue:{value:'"neutral"',computed:!1}},dot:{required:!1,tsType:{name:"boolean"},description:"Shows the leading dot. Keep it on when the badge carries status meaning.",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const b=l.forwardRef(function({label:a,indeterminate:n=!1,...s},i){const t=l.useRef(null);return l.useEffect(()=>{t.current&&(t.current.indeterminate=n)},[n]),e.jsxs("label",{className:"fds-checkbox",children:[e.jsx("input",{...s,type:"checkbox",className:"fds-checkbox-input fds-visually-hidden","aria-checked":n?"mixed":void 0,ref:d=>{t.current=d,typeof i=="function"?i(d):i&&(i.current=d)}}),e.jsx("span",{className:"fds-checkbox-box","aria-hidden":"true",children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",focusable:"false",children:n?e.jsx("path",{d:"M2.5 6h7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}):e.jsx("path",{d:"M2.5 6.4 4.7 8.6 9.5 3.8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsx("span",{children:a})]})});b.__docgenInfo={description:`Checkbox.

A real input, visually hidden and styled through its sibling box. Native semantics,
native keyboard, native form participation. Nothing is reimplemented with divs.`,methods:[],displayName:"Checkbox",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""},indeterminate:{required:!1,tsType:{name:"boolean"},description:"Tri-state. Sets the DOM indeterminate flag, which cannot be expressed in JSX alone.",defaultValue:{value:"false",computed:!1}}},composes:["Omit"]};function x({label:r,hint:a,error:n,required:s=!1,children:i}){const t=l.useId(),d=`${t}-message`,c=n??a;return e.jsxs("div",{className:"fds-field",children:[e.jsxs("label",{className:"fds-field-label",htmlFor:t,children:[r,s?e.jsx("span",{className:"fds-field-required","aria-hidden":"true",children:"*"}):null,s?e.jsx("span",{className:"fds-visually-hidden",children:" required"}):null]}),i({id:t,describedBy:c?d:void 0,invalid:!!n}),c?e.jsx("span",{className:"fds-field-message",id:d,"data-tone":n?"danger":void 0,role:n?"alert":void 0,children:c}):null]})}const v=l.forwardRef(function(a,n){return e.jsx("input",{...a,ref:n,className:"fds-input"})});function u({label:r,hint:a,error:n,required:s,...i}){return e.jsx(x,{label:r,hint:a,error:n,required:s,children:({id:t,describedBy:d,invalid:c})=>e.jsx(v,{...i,id:t,required:s,"aria-describedby":d,"aria-invalid":c||void 0})})}x.__docgenInfo={description:`Field.

The one place label, hint, error, and control ids get wired together. Consumers cannot
forget aria-describedby or aria-invalid, because Field passes them in.`,methods:[],displayName:"Field",props:{label:{required:!0,tsType:{name:"string"},description:""},hint:{required:!1,tsType:{name:"ReactNode"},description:"Helper text shown under the control. Announced through aria-describedby."},error:{required:!1,tsType:{name:"ReactNode"},description:"Error text. When present the control is marked invalid and the hint is replaced."},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"signature",type:"function",raw:"(ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ id: string; describedBy: string | undefined; invalid: boolean }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"describedBy",value:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}],required:!0}},{key:"invalid",value:{name:"boolean",required:!0}}]}},name:"ids"}],return:{name:"ReactNode"}}},description:"Render prop so the label, hint, and error wiring is handed to any control."}}};v.__docgenInfo={description:"",methods:[],displayName:"Input",composes:["Omit"]};u.__docgenInfo={description:"Field plus Input, for the common case.",methods:[],displayName:"TextField",props:{label:{required:!0,tsType:{name:"string"},description:""},hint:{required:!1,tsType:{name:"ReactNode"},description:""},error:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const y=l.forwardRef(function({label:a,...n},s){return e.jsxs("label",{className:"fds-switch",children:[e.jsx("input",{...n,ref:s,type:"checkbox",role:"switch",className:"fds-switch-input fds-visually-hidden"}),e.jsx("span",{className:"fds-switch-track","aria-hidden":"true",children:e.jsx("span",{className:"fds-switch-thumb"})}),e.jsx("span",{children:a})]})});y.__docgenInfo={description:`Switch.

role="switch" on a native checkbox: assistive tech announces on/off instead of
checked/unchecked, and the input still submits with the form.`,methods:[],displayName:"Switch",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const S={title:"Components/Forms",parameters:{controls:{disable:!0},layout:"padded",docs:{description:{component:"Field owns the label, hint, error, and id wiring. A consumer cannot ship an input without a programmatic label, because Field hands the id to the control instead of trusting the caller to pass one."}}}},p={render:()=>e.jsxs("div",{style:{display:"grid",gap:"1.5rem",maxWidth:"22rem"},children:[e.jsx(u,{label:"Work email",placeholder:"you@company.com",hint:"We only use this to send the invite."}),e.jsx(u,{label:"Team name",required:!0,placeholder:"Design Systems"}),e.jsx(u,{label:"Seats",defaultValue:"0",error:"Seats must be at least 1."}),e.jsx(u,{label:"Billing owner",defaultValue:"jeremy@forefrontindustries.io",disabled:!0})]})},m={parameters:{docs:{description:{story:"Field is a render prop, so any control can inherit the same labelling contract."}}},render:()=>e.jsx("div",{style:{maxWidth:"22rem"},children:e.jsx(x,{label:"Search tokens",hint:"Try surface, text, or radius.",children:({id:r,describedBy:a})=>e.jsx(v,{id:r,"aria-describedby":a,type:"search",placeholder:"color-surface-accent"})})})},h={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem"},children:[e.jsx(b,{label:"Ship the release notes",defaultChecked:!0}),e.jsx(b,{label:"Notify the consuming teams",indeterminate:!0}),e.jsx(b,{label:"Skip the changelog",disabled:!0})]})},f={render:function(){const[a,n]=l.useState(!0);return e.jsxs("div",{style:{display:"grid",gap:"0.75rem"},children:[e.jsx(y,{label:"Reduced motion"}),e.jsx(y,{label:"Dark theme",checked:a,onChange:s=>n(s.target.checked)}),e.jsx(y,{label:"Locked by policy",disabled:!0})]})}},g={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[e.jsx(o,{tone:"neutral",children:"Draft"}),e.jsx(o,{tone:"accent",dot:!0,children:"In review"}),e.jsx(o,{tone:"success",dot:!0,children:"Stable"}),e.jsx(o,{tone:"warning",dot:!0,children:"Deprecated"}),e.jsx(o,{tone:"danger",dot:!0,children:"Removed"}),e.jsx(o,{tone:"info",children:"v1.0.0"})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "1.5rem",
    maxWidth: "22rem"
  }}>
      <TextField label="Work email" placeholder="you@company.com" hint="We only use this to send the invite." />
      <TextField label="Team name" required placeholder="Design Systems" />
      <TextField label="Seats" defaultValue="0" error="Seats must be at least 1." />
      <TextField label="Billing owner" defaultValue="jeremy@forefrontindustries.io" disabled />
    </div>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Field is a render prop, so any control can inherit the same labelling contract."
      }
    }
  },
  render: () => <div style={{
    maxWidth: "22rem"
  }}>
      <Field label="Search tokens" hint="Try surface, text, or radius.">
        {({
        id,
        describedBy
      }) => <Input id={id} aria-describedby={describedBy} type="search" placeholder="color-surface-accent" />}
      </Field>
    </div>
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gap: "0.75rem"
  }}>
      <Checkbox label="Ship the release notes" defaultChecked />
      <Checkbox label="Notify the consuming teams" indeterminate />
      <Checkbox label="Skip the changelog" disabled />
    </div>
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: function Switches() {
    const [dark, setDark] = useState(true);
    return <div style={{
      display: "grid",
      gap: "0.75rem"
    }}>
        <Switch label="Reduced motion" />
        <Switch label="Dark theme" checked={dark} onChange={event => setDark(event.target.checked)} />
        <Switch label="Locked by policy" disabled />
      </div>;
  }
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap"
  }}>
      <Badge tone="neutral">Draft</Badge>
      <Badge tone="accent" dot>
        In review
      </Badge>
      <Badge tone="success" dot>
        Stable
      </Badge>
      <Badge tone="warning" dot>
        Deprecated
      </Badge>
      <Badge tone="danger" dot>
        Removed
      </Badge>
      <Badge tone="info">v1.0.0</Badge>
    </div>
}`,...g.parameters?.docs?.source}}};const N=["TextFields","CustomControl","Checkboxes","Switches","Badges"];export{g as Badges,h as Checkboxes,m as CustomControl,f as Switches,p as TextFields,N as __namedExportsOrder,S as default};
