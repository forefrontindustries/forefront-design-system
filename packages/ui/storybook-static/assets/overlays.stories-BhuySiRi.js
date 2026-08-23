import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-DEH88qfi.js";import{B as b}from"./button-DomwnaoM.js";import"./preload-helper-PPVm8Dsz.js";function w({title:s,headingLevel:c=3,elevation:i="raised",children:p,...a}){const l=`h${c}`;return e.jsxs("div",{...a,className:"fds-card","data-elevation":i==="none"?"none":void 0,children:[s?e.jsx(l,{className:"fds-card-title",children:s}):null,p]})}w.__docgenInfo={description:`Card.

A container, not a control. If the whole card should be clickable, wrap the heading
text in a link instead of putting onClick on the card, so the target stays reachable
by keyboard and readable in a link list.`,methods:[],displayName:"Card",props:{title:{required:!1,tsType:{name:"ReactNode"},description:"Rendered as the card heading. Pass headingLevel to keep the document outline correct."},headingLevel:{required:!1,tsType:{name:"union",raw:"2 | 3 | 4 | 5 | 6",elements:[{name:"literal",value:"2"},{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"}]},description:"",defaultValue:{value:"3",computed:!1}},elevation:{required:!1,tsType:{name:"union",raw:'"raised" | "none"',elements:[{name:"literal",value:'"raised"'},{name:"literal",value:'"none"'}]},description:"",defaultValue:{value:'"raised"',computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const R='a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';function k({open:s,onClose:c,title:i,size:p="md",children:a,footer:l}){const u=o.useRef(null),h=o.useRef(null),f=o.useCallback(()=>Array.from(u.current?.querySelectorAll(R)??[]),[]);return o.useEffect(()=>{if(!s)return;h.current=document.activeElement;const r=document.body.style.overflow;return document.body.style.overflow="hidden",(f()[0]??u.current)?.focus(),()=>{document.body.style.overflow=r,h.current?.focus()}},[s,f]),s?e.jsx("div",{className:"fds-scrim",onMouseDown:r=>{r.target===r.currentTarget&&c()},children:e.jsxs("div",{ref:u,className:"fds-modal","data-size":p==="md"?void 0:p,role:"dialog","aria-modal":"true","aria-labelledby":"fds-modal-title",tabIndex:-1,onKeyDown:r=>{if(r.key==="Escape"){r.stopPropagation(),c();return}if(r.key!=="Tab")return;const n=f();if(n.length===0){r.preventDefault();return}const t=n[0],m=n[n.length-1];r.shiftKey&&document.activeElement===t?(r.preventDefault(),m.focus()):!r.shiftKey&&document.activeElement===m&&(r.preventDefault(),t.focus())},children:[e.jsx("h2",{className:"fds-modal-title",id:"fds-modal-title",children:i}),a,l?e.jsx("div",{className:"fds-modal-footer",children:l}):null]})}):null}k.__docgenInfo={description:`Modal.

Accessibility contract, all of it enforced here so no consumer has to remember it:
 - role="dialog" with aria-modal and aria-labelledby pointing at the visible title
 - focus moves into the dialog on open and returns to the trigger on close
 - Tab and Shift+Tab are trapped inside the dialog
 - Escape closes; the scrim closes only on a direct click, not a drag ending inside
 - background scroll is locked while open`,methods:[],displayName:"Modal",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactNode"},description:""}}};function j({items:s,defaultId:c,onChange:i,label:p}){const a=s.filter(t=>!t.disabled),[l,u]=o.useState(c??a[0]?.id??s[0]?.id??""),h=o.useId(),f=o.useRef(null),r=t=>{u(t),i?.(t),requestAnimationFrame(()=>{f.current?.querySelector(`[data-tab-id="${t}"]`)?.focus()})},n=t=>{if(a.length===0)return;if(t==="first")return r(a[0].id);if(t==="last")return r(a[a.length-1].id);const d=(a.findIndex(D=>D.id===l)+t+a.length)%a.length;r(a[d].id)};return e.jsxs("div",{children:[e.jsx("div",{className:"fds-tabs-list",role:"tablist","aria-label":p,ref:f,children:s.map(t=>{const m=t.id===l;return e.jsx("button",{type:"button",role:"tab",className:"fds-tab","data-tab-id":t.id,id:`${h}-tab-${t.id}`,"aria-selected":m,"aria-controls":`${h}-panel-${t.id}`,tabIndex:m?0:-1,disabled:t.disabled,onClick:()=>r(t.id),onKeyDown:d=>{d.key==="ArrowRight"?(d.preventDefault(),n(1)):d.key==="ArrowLeft"?(d.preventDefault(),n(-1)):d.key==="Home"?(d.preventDefault(),n("first")):d.key==="End"&&(d.preventDefault(),n("last"))},children:t.label},t.id)})}),s.map(t=>e.jsx("div",{role:"tabpanel",className:"fds-tab-panel",id:`${h}-panel-${t.id}`,"aria-labelledby":`${h}-tab-${t.id}`,hidden:t.id!==l,tabIndex:0,children:t.content},t.id))]})}j.__docgenInfo={description:`Tabs.

Keyboard model is the WAI-ARIA authoring practice, not a guess:
 - roving tabindex, so Tab enters the list once and moves on to the panel
 - ArrowLeft/ArrowRight move selection, Home/End jump to the ends
 - disabled tabs are skipped, and selection follows focus (automatic activation),
   which is correct here because panels are cheap and already rendered`,methods:[],displayName:"Tabs",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"TabItem"}],raw:"TabItem[]"},description:""},defaultId:{required:!1,tsType:{name:"string"},description:"Uncontrolled starting tab. Defaults to the first enabled tab."},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},label:{required:!0,tsType:{name:"string"},description:"Accessible name for the tab list."}}};const C=o.createContext(null);function E({children:s,max:c=3}){const[i,p]=o.useState([]),a=o.useRef(1),l=o.useRef(new Map),u=o.useCallback(n=>{const t=l.current.get(n);t&&clearTimeout(t),l.current.delete(n),p(m=>m.filter(d=>d.id!==n))},[]),h=o.useCallback(n=>{const t=a.current++;p(d=>[...d,{...n,id:t}].slice(-c));const m=n.duration??6e3;return m>0&&l.current.set(t,setTimeout(()=>u(t),m)),t},[u,c]),f=o.useMemo(()=>({toast:h,dismiss:u}),[h,u]),r=i.some(n=>n.tone==="danger");return e.jsxs(C.Provider,{value:f,children:[s,e.jsx("div",{className:"fds-toast-viewport",role:"region","aria-label":"Notifications","aria-live":r?"assertive":"polite",children:i.map(n=>e.jsxs("div",{className:"fds-toast","data-tone":n.tone??void 0,children:[e.jsxs("div",{children:[e.jsx("div",{className:"fds-toast-title",children:n.title}),n.description?e.jsx("div",{children:n.description}):null]}),e.jsx("button",{type:"button",className:"fds-button fds-focusable","data-variant":"ghost","data-size":"sm","aria-label":`Dismiss: ${n.title}`,onClick:()=>u(n.id),children:"Close"})]},n.id))})]})}function S(){const s=o.useContext(C);if(!s)throw new Error("useToast must be used inside <ToastProvider>");return s}E.__docgenInfo={description:`ToastProvider.

Accessibility contract:
 - one aria-live region, polite for neutral and success, assertive for danger
 - every toast has a real dismiss button, because auto dismiss alone fails WCAG 2.2.1
 - default duration is 6s, long enough to read at 200 words per minute`,methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},max:{required:!1,tsType:{name:"number"},description:"Cap on visible toasts. Older ones drop off so the viewport never buries the page.",defaultValue:{value:"3",computed:!1}},children_:{required:!1,tsType:{name:"never"},description:""}}};function N({content:s,children:c}){const i=o.useId(),[p,a]=o.useState(!1);return e.jsxs("span",{className:"fds-tooltip-wrapper",onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),onFocus:()=>a(!0),onBlur:()=>a(!1),onKeyDown:l=>{l.key==="Escape"&&a(!1)},children:[o.cloneElement(c,{"aria-describedby":i}),e.jsx("span",{className:"fds-tooltip",role:"tooltip",id:i,hidden:!p,children:s})]})}N.__docgenInfo={description:`Tooltip.

Accessibility contract:
 - opens on hover AND on keyboard focus, so it is not mouse-only
 - Escape dismisses it while the trigger keeps focus (WCAG 1.4.13)
 - wired with aria-describedby, so the text is announced instead of guessed at
 - never holds interactive content, because it cannot be reached with a pointer`,methods:[],displayName:"Tooltip",props:{content:{required:!0,tsType:{name:"ReactNode"},description:"Short text. A tooltip is never the only place information lives."},children:{required:!0,tsType:{name:"ReactElement",elements:[{name:"signature",type:"object",raw:'{ "aria-describedby"?: string }',signature:{properties:[{key:"aria-describedby",value:{name:"string",required:!1}}]}}],raw:'ReactElement<{ "aria-describedby"?: string }>'},description:""}}};const B={title:"Components/Overlays",parameters:{controls:{disable:!0},layout:"padded"}},g={name:"Card",render:()=>e.jsxs("div",{style:{display:"grid",gap:"1rem",gridTemplateColumns:"repeat(auto-fit, minmax(16rem, 1fr))"},children:[e.jsx(w,{title:"Semantic contract",children:e.jsx("p",{style:{margin:0},children:"66 named intents. Themes supply the values, components never see a hex."})}),e.jsx(w,{title:"Component tokens",elevation:"none",children:e.jsx("p",{style:{margin:0},children:"67 geometry tokens. Density remaps these and nothing else."})})]})},y={name:"Tabs",parameters:{docs:{description:{story:"Roving tabindex with arrow keys, Home, and End. Tab moves out of the list into the panel instead of stepping through every tab."}}},render:()=>e.jsx(j,{label:"Token tiers",items:[{id:"primitives",label:"Primitives",content:e.jsx("p",{children:"134 literals. The only tier where raw values exist."})},{id:"semantic",label:"Semantic",content:e.jsx("p",{children:"66 intents. Value-less by design so themes stay complete."})},{id:"component",label:"Component",content:e.jsx("p",{children:"67 geometry tokens, remapped by density."})},{id:"legacy",label:"Legacy",content:e.jsx("p",{children:"Nothing here."}),disabled:!0}]})},v={name:"Tooltip",parameters:{docs:{description:{story:"Opens on hover and on keyboard focus, dismisses on Escape, and is wired with aria-describedby."}}},render:()=>e.jsx("div",{style:{display:"flex",gap:"1rem",paddingBlockStart:"4rem"},children:e.jsx(N,{content:"Runs the contrast gate against both themes before publish.",children:e.jsx(b,{variant:"secondary",children:"Why does CI fail?"})})})},x={name:"Modal",parameters:{docs:{description:{story:"Focus moves in on open and returns to the trigger on close. Tab is trapped, Escape closes, background scroll is locked."}}},render:function(){const[c,i]=o.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(b,{onClick:()=>i(!0),children:"Deprecate token"}),e.jsx(k,{open:c,onClose:()=>i(!1),title:"Deprecate color-surface-accent-soft?",footer:e.jsxs(e.Fragment,{children:[e.jsx(b,{variant:"ghost",onClick:()=>i(!1),children:"Cancel"}),e.jsx(b,{variant:"danger",onClick:()=>i(!1),children:"Open deprecation PR"})]}),children:e.jsx("p",{style:{margin:0},children:"Deprecation keeps the token alive for two minor releases with a console warning, then removes it in the next major."})})]})}};function q(){const{toast:s}=S();return e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(b,{onClick:()=>s({title:"Tokens rebuilt",description:"350 custom properties emitted."}),children:"Neutral"}),e.jsx(b,{variant:"secondary",onClick:()=>s({title:"Contrast gate passed",description:"40 pairs, both themes.",tone:"success"}),children:"Success"}),e.jsx(b,{variant:"danger",onClick:()=>s({title:"Theme incomplete",description:"forefront-light is missing color-text-on-warning.",tone:"danger",duration:0}),children:"Danger (manual dismiss)"})]})}const T={name:"Toast",parameters:{docs:{description:{story:"One live region for the whole app. Danger toasts switch it to assertive and never auto dismiss, because an error the user did not read is an error they cannot act on."}}},render:()=>e.jsx(E,{max:3,children:e.jsx(q,{})})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...T.parameters?.docs?.source}}};const P=["CardExample","TabsExample","TooltipExample","ModalExample","ToastExample"];export{g as CardExample,x as ModalExample,y as TabsExample,T as ToastExample,v as TooltipExample,P as __namedExportsOrder,B as default};
