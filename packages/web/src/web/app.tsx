import { Route, Switch } from "wouter";
import { AgentFeedback } from "@runablehq/website-runtime";
import { ToastProvider } from "@forefront/ui";
import { Provider } from "./components/provider";
import { ThemeProvider } from "./components/docs/theme";
import { Shell } from "./components/docs/shell";
import Index from "./pages/index";
import ComponentPage from "./pages/component";
import AccessibilityPage from "./pages/accessibility";
import ContributingPage from "./pages/contributing";
import TokensPage from "./pages/foundations/tokens";
import ColorPage from "./pages/foundations/color";
import TypographyPage from "./pages/foundations/typography";
import SpacePage from "./pages/foundations/space";
import MotionPage from "./pages/foundations/motion";

function App() {
	return (
		<Provider>
			<ThemeProvider>
				{/* The docs site is a consumer of the system, so the provider that a
				    product would mount sits here too, wrapping every page. */}
				<ToastProvider placement="bottom-end" max={3}>
					<Shell>
						<Switch>
							<Route path="/" component={Index} />
							<Route path="/foundations/tokens" component={TokensPage} />
							<Route path="/foundations/color" component={ColorPage} />
							<Route path="/foundations/typography" component={TypographyPage} />
							<Route path="/foundations/space" component={SpacePage} />
							<Route path="/foundations/motion" component={MotionPage} />
							<Route path="/accessibility" component={AccessibilityPage} />
							<Route path="/contributing" component={ContributingPage} />
							<Route path="/components/:slug" component={ComponentPage} />
							<Route component={Index} />
						</Switch>
					</Shell>
				</ToastProvider>
			</ThemeProvider>
			{/* Do not remove — off by default, activated by parent iframe via postMessage */}
			{import.meta.env.DEV && <AgentFeedback />}
		</Provider>
	);
}

export default App;
