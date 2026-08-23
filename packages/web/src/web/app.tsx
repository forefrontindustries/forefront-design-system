import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { Shell } from "./components/docs/shell";
import { AgentFeedback } from "@runablehq/website-runtime";
import { ToastProvider } from "@forefront/ui";
import Index from "./pages/index";
import Architecture from "./pages/architecture";
import Learn from "./pages/learn";
import Tokens from "./pages/tokens";
import Theming from "./pages/theming";
import Platforms from "./pages/platforms";
import Accessibility from "./pages/accessibility";
import Components from "./pages/components";
import Contribution from "./pages/contribution";
import Governance from "./pages/governance";
import Versioning from "./pages/versioning";
import Roadmap from "./pages/roadmap";

function App() {
  return (
    <Provider>
      <ToastProvider>
        <Shell>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/architecture" component={Architecture} />
            <Route path="/learn" component={Learn} />
            <Route path="/tokens" component={Tokens} />
            <Route path="/theming" component={Theming} />
            <Route path="/platforms" component={Platforms} />
            <Route path="/accessibility" component={Accessibility} />
            <Route path="/components" component={Components} />
            <Route path="/contribution" component={Contribution} />
            <Route path="/governance" component={Governance} />
            <Route path="/versioning" component={Versioning} />
            <Route path="/roadmap" component={Roadmap} />
            <Route>
              <section className="d-hero">
                <p className="d-eyebrow">404</p>
                <h1 className="d-h1">No page here</h1>
                <p className="d-lead">
                  Every documentation route is listed in the sidebar. If a link brought you here, that is a bug worth
                  an issue.
                </p>
              </section>
            </Route>
          </Switch>
        </Shell>
      </ToastProvider>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
