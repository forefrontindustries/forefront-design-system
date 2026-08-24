import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r}from"./iframe-C41lUwqY.js";import{B as y}from"./button-CRJSSktb.js";import"./preload-helper-D1UD9lgW.js";function E({title:n,headingLevel:d=3,elevation:i="raised",children:u,...a}){const l=`h${d}`;return e.jsxs("div",{...a,className:"fds-card","data-elevation":i==="none"?"none":void 0,children:[n?e.jsx(l,{className:"fds-card-title",children:n}):null,u]})}E.__docgenInfo={description:`Card.

A container, not a control. If the whole card should be clickable, wrap the heading
text in a link instead of putting onClick on the card, so the target stays reachable
by keyboard and readable in a link list.`,methods:[],displayName:"Card",props:{title:{required:!1,tsType:{name:"ReactNode"},description:"Rendered as the card heading. Pass headingLevel to keep the document outline correct."},headingLevel:{required:!1,tsType:{name:"union",raw:"2 | 3 | 4 | 5 | 6",elements:[{name:"literal",value:"2"},{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"}]},description:"",defaultValue:{value:"3",computed:!1}},elevation:{required:!1,tsType:{name:"union",raw:'"raised" | "none"',elements:[{name:"literal",value:'"raised"'},{name:"literal",value:'"none"'}]},description:"",defaultValue:{value:'"raised"',computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const I='a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';function D({open:n,onClose:d,title:i,size:u="md",children:a,footer:l}){const c=r.useRef(null),h=r.useRef(null),b=r.useRef(null),f=r.useCallback(()=>Array.from(c.current?.querySelectorAll(I)??[]),[]);return r.useEffect(()=>{if(!n)return;b.current=document.activeElement;const s=document.body.style.overflow;document.body.style.overflow="hidden",(f()[0]??c.current)?.focus();const m=p=>{if(!c.current)return;if(p.key==="Escape"){p.preventDefault(),d();return}if(p.key!=="Tab")return;const g=f();if(g.length===0){p.preventDefault();return}const j=g[0],N=g[g.length-1],C=document.activeElement;if(!c.current.contains(C)){p.preventDefault(),j.focus();return}p.shiftKey&&C===j?(p.preventDefault(),N.focus()):!p.shiftKey&&C===N&&(p.preventDefault(),j.focus())},o=p=>{p.target===h.current&&d()};return document.addEventListener("keydown",m,!0),document.addEventListener("mousedown",o,!0),()=>{document.removeEventListener("keydown",m,!0),document.removeEventListener("mousedown",o,!0),document.body.style.overflow=s,b.current?.focus()}},[n,d,f]),n?e.jsx("div",{className:"fds-scrim",ref:h,children:e.jsxs("dialog",{open:!0,ref:c,className:"fds-modal","data-size":u==="md"?void 0:u,"aria-modal":"true","aria-labelledby":"fds-modal-title",tabIndex:-1,children:[e.jsx("h2",{className:"fds-modal-title",id:"fds-modal-title",children:i}),a,l?e.jsx("div",{className:"fds-modal-footer",children:l}):null]})}):null}D.__docgenInfo={description:`Modal.

Accessibility contract, all of it enforced here so no consumer has to remember it:
 - a native <dialog> element, so the dialog role and modal semantics come from the platform
 - aria-labelledby points at the visible title
 - focus moves into the dialog on open and returns to the trigger on close
 - Tab and Shift+Tab are trapped inside the dialog
 - Escape closes; the scrim closes only on a direct press, not a drag ending inside
 - background scroll is locked while open

Keyboard and pointer handling is bound to the document rather than to JSX handlers, so
Escape still works when focus sits on the scrim and no presentational node has to pretend
to be interactive.`,methods:[],displayName:"Modal",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactNode"},description:""}}};function R({items:n,defaultId:d,onChange:i,label:u}){const a=n.filter(t=>!t.disabled),[l,c]=r.useState(d??a[0]?.id??n[0]?.id??""),h=r.useId(),b=r.useRef(null),f=t=>{c(t),i?.(t),requestAnimationFrame(()=>{b.current?.querySelector(`[data-tab-id="${t}"]`)?.focus()})},s=t=>{if(a.length===0)return;if(t==="first")return f(a[0].id);if(t==="last")return f(a[a.length-1].id);const o=(a.findIndex(p=>p.id===l)+t+a.length)%a.length;f(a[o].id)};return e.jsxs("div",{children:[e.jsx("div",{className:"fds-tabs-list",role:"tablist","aria-label":u,ref:b,children:n.map(t=>{const m=t.id===l;return e.jsx("button",{type:"button",role:"tab",className:"fds-tab","data-tab-id":t.id,id:`${h}-tab-${t.id}`,"aria-selected":m,"aria-controls":`${h}-panel-${t.id}`,tabIndex:m?0:-1,disabled:t.disabled,onClick:()=>f(t.id),onKeyDown:o=>{o.key==="ArrowRight"?(o.preventDefault(),s(1)):o.key==="ArrowLeft"?(o.preventDefault(),s(-1)):o.key==="Home"?(o.preventDefault(),s("first")):o.key==="End"&&(o.preventDefault(),s("last"))},children:t.label},t.id)})}),n.map(t=>e.jsx("div",{role:"tabpanel",className:"fds-tab-panel",id:`${h}-panel-${t.id}`,"aria-labelledby":`${h}-tab-${t.id}`,hidden:t.id!==l,tabIndex:0,children:t.content},t.id))]})}R.__docgenInfo={description:`Tabs.

Keyboard model is the WAI-ARIA authoring practice, not a guess:
 - roving tabindex, so Tab enters the list once and moves on to the panel
 - ArrowLeft/ArrowRight move selection, Home/End jump to the ends
 - disabled tabs are skipped, and selection follows focus (automatic activation),
   which is correct here because panels are cheap and already rendered`,methods:[],displayName:"Tabs",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"TabItem"}],raw:"TabItem[]"},description:""},defaultId:{required:!1,tsType:{name:"string"},description:"Uncontrolled starting tab. Defaults to the first enabled tab."},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},label:{required:!0,tsType:{name:"string"},description:"Accessible name for the tab list."}}};const S=r.createContext(null);function q({children:n,max:d=3}){const[i,u]=r.useState([]),a=r.useRef(1),l=r.useRef(new Map),c=r.useCallback(s=>{const t=l.current.get(s);t&&clearTimeout(t),l.current.delete(s),u(m=>m.filter(o=>o.id!==s))},[]),h=r.useCallback(s=>{const t=a.current++;u(o=>[...o,{...s,id:t}].slice(-d));const m=s.duration??6e3;return m>0&&l.current.set(t,setTimeout(()=>c(t),m)),t},[c,d]),b=r.useMemo(()=>({toast:h,dismiss:c}),[h,c]),f=i.some(s=>s.tone==="danger");return e.jsxs(S.Provider,{value:b,children:[n,e.jsx("section",{className:"fds-toast-viewport","aria-label":"Notifications","aria-live":f?"assertive":"polite",children:i.map(s=>e.jsxs("div",{className:"fds-toast","data-tone":s.tone??void 0,children:[e.jsxs("div",{children:[e.jsx("div",{className:"fds-toast-title",children:s.title}),s.description?e.jsx("div",{children:s.description}):null]}),e.jsx("button",{type:"button",className:"fds-button fds-focusable","data-variant":"ghost","data-size":"sm","aria-label":`Dismiss: ${s.title}`,onClick:()=>c(s.id),children:"Close"})]},s.id))})]})}function O(){const n=r.useContext(S);if(!n)throw new Error("useToast must be used inside <ToastProvider>");return n}q.__docgenInfo={description:`ToastProvider.

Accessibility contract:
 - one aria-live region, polite for neutral and success, assertive for danger
 - every toast has a real dismiss button, because auto dismiss alone fails WCAG 2.2.1
 - default duration is 6s, long enough to read at 200 words per minute`,methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},max:{required:!1,tsType:{name:"number"},description:"Cap on visible toasts. Older ones drop off so the viewport never buries the page.",defaultValue:{value:"3",computed:!1}},children_:{required:!1,tsType:{name:"never"},description:""}}};function A({content:n,children:d}){const i=r.useId(),[u,a]=r.useState(!1);return e.jsxs("span",{role:"presentation",className:"fds-tooltip-wrapper",onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),onFocus:()=>a(!0),onBlur:()=>a(!1),onKeyDown:l=>{l.key==="Escape"&&a(!1)},children:[r.cloneElement(d,{"aria-describedby":i}),e.jsx("span",{className:"fds-tooltip",role:"tooltip",id:i,hidden:!u,children:n})]})}A.__docgenInfo={description:`Tooltip.

Accessibility contract:
 - opens on hover AND on keyboard focus, so it is not mouse-only
 - Escape dismisses it while the trigger keeps focus (WCAG 1.4.13)
 - wired with aria-describedby, so the text is announced instead of guessed at
 - never holds interactive content, because it cannot be reached with a pointer`,methods:[],displayName:"Tooltip",props:{content:{required:!0,tsType:{name:"ReactNode"},description:"Short text. A tooltip is never the only place information lives."},children:{required:!0,tsType:{name:"ReactElement",elements:[{name:"signature",type:"object",raw:'{ "aria-describedby"?: string }',signature:{properties:[{key:"aria-describedby",value:{name:"string",required:!1}}]}}],raw:'ReactElement<{ "aria-describedby"?: string }>'},description:""}}};const $={title:"Components/Overlays",parameters:{controls:{disable:!0},layout:"padded"}},v={name:"Card",render:()=>e.jsxs("div",{style:{display:"grid",gap:"1rem",gridTemplateColumns:"repeat(auto-fit, minmax(16rem, 1fr))"},children:[e.jsx(E,{title:"Semantic contract",children:e.jsx("p",{style:{margin:0},children:"66 named intents. Themes supply the values, components never see a hex."})}),e.jsx(E,{title:"Component tokens",elevation:"none",children:e.jsx("p",{style:{margin:0},children:"67 geometry tokens. Density remaps these and nothing else."})})]})},x={name:"Tabs",parameters:{docs:{description:{story:"Roving tabindex with arrow keys, Home, and End. Tab moves out of the list into the panel instead of stepping through every tab."}}},render:()=>e.jsx(R,{label:"Token tiers",items:[{id:"primitives",label:"Primitives",content:e.jsx("p",{children:"134 literals. The only tier where raw values exist."})},{id:"semantic",label:"Semantic",content:e.jsx("p",{children:"66 intents. Value-less by design so themes stay complete."})},{id:"component",label:"Component",content:e.jsx("p",{children:"67 geometry tokens, remapped by density."})},{id:"legacy",label:"Legacy",content:e.jsx("p",{children:"Nothing here."}),disabled:!0}]})},T={name:"Tooltip",parameters:{docs:{description:{story:"Opens on hover and on keyboard focus, dismisses on Escape, and is wired with aria-describedby."}}},render:()=>e.jsx("div",{style:{display:"flex",gap:"1rem",paddingBlockStart:"4rem"},children:e.jsx(A,{content:"Runs the contrast gate against both themes before publish.",children:e.jsx(y,{variant:"secondary",children:"Why does CI fail?"})})})},w={name:"Modal",parameters:{docs:{description:{story:"Focus moves in on open and returns to the trigger on close. Tab is trapped, Escape closes, background scroll is locked."}}},render:function(){const[d,i]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(y,{onClick:()=>i(!0),children:"Deprecate token"}),e.jsx(D,{open:d,onClose:()=>i(!1),title:"Deprecate color-surface-accent-soft?",footer:e.jsxs(e.Fragment,{children:[e.jsx(y,{variant:"ghost",onClick:()=>i(!1),children:"Cancel"}),e.jsx(y,{variant:"danger",onClick:()=>i(!1),children:"Open deprecation PR"})]}),children:e.jsx("p",{style:{margin:0},children:"Deprecation keeps the token alive for two minor releases with a console warning, then removes it in the next major."})})]})}};function M(){const{toast:n}=O();return e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(y,{onClick:()=>n({title:"Tokens rebuilt",description:"350 custom properties emitted."}),children:"Neutral"}),e.jsx(y,{variant:"secondary",onClick:()=>n({title:"Contrast gate passed",description:"40 pairs, both themes.",tone:"success"}),children:"Success"}),e.jsx(y,{variant:"danger",onClick:()=>n({title:"Theme incomplete",description:"forefront-light is missing color-text-on-warning.",tone:"danger",duration:0}),children:"Danger (manual dismiss)"})]})}const k={name:"Toast",parameters:{docs:{description:{story:"One live region for the whole app. Danger toasts switch it to assertive and never auto dismiss, because an error the user did not read is an error they cannot act on."}}},render:()=>e.jsx(q,{max:3,children:e.jsx(M,{})})};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Card",
  render: () => <div style={{
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))"
  }}>
      <Card title="Semantic contract">
        <p style={{
        margin: 0
      }}>66 named intents. Themes supply the values, components never see a hex.</p>
      </Card>
      <Card title="Component tokens" elevation="none">
        <p style={{
        margin: 0
      }}>67 geometry tokens. Density remaps these and nothing else.</p>
      </Card>
    </div>
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Tabs",
  parameters: {
    docs: {
      description: {
        story: "Roving tabindex with arrow keys, Home, and End. Tab moves out of the list into the panel instead of stepping through every tab."
      }
    }
  },
  render: () => <Tabs label="Token tiers" items={[{
    id: "primitives",
    label: "Primitives",
    content: <p>134 literals. The only tier where raw values exist.</p>
  }, {
    id: "semantic",
    label: "Semantic",
    content: <p>66 intents. Value-less by design so themes stay complete.</p>
  }, {
    id: "component",
    label: "Component",
    content: <p>67 geometry tokens, remapped by density.</p>
  }, {
    id: "legacy",
    label: "Legacy",
    content: <p>Nothing here.</p>,
    disabled: true
  }]} />
}`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Tooltip",
  parameters: {
    docs: {
      description: {
        story: "Opens on hover and on keyboard focus, dismisses on Escape, and is wired with aria-describedby."
      }
    }
  },
  render: () => <div style={{
    display: "flex",
    gap: "1rem",
    paddingBlockStart: "4rem"
  }}>
      <Tooltip content="Runs the contrast gate against both themes before publish.">
        <Button variant="secondary">Why does CI fail?</Button>
      </Tooltip>
    </div>
}`,...T.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: "Modal",
  parameters: {
    docs: {
      description: {
        story: "Focus moves in on open and returns to the trigger on close. Tab is trapped, Escape closes, background scroll is locked."
      }
    }
  },
  render: function ModalStory() {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Deprecate token</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Deprecate color-surface-accent-soft?" footer={<>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Open deprecation PR
              </Button>
            </>}>
          <p style={{
          margin: 0
        }}>
            Deprecation keeps the token alive for two minor releases with a console warning, then removes it in the next
            major.
          </p>
        </Modal>
      </>;
  }
}`,...w.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Toast",
  parameters: {
    docs: {
      description: {
        story: "One live region for the whole app. Danger toasts switch it to assertive and never auto dismiss, because an error the user did not read is an error they cannot act on."
      }
    }
  },
  render: () => <ToastProvider max={3}>
      <ToastDemo />
    </ToastProvider>
}`,...k.parameters?.docs?.source}}};const F=["CardExample","TabsExample","TooltipExample","ModalExample","ToastExample"];export{v as CardExample,w as ModalExample,x as TabsExample,k as ToastExample,T as TooltipExample,F as __namedExportsOrder,$ as default};
