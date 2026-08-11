import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	DENSITY_ATTRIBUTE,
	THEME_ATTRIBUTE,
	defaultTheme,
	densities,
	themes,
	type DensityName,
	type ThemeName,
} from "@forefront/tokens";

/**
 * Theme and density state for the documentation site.
 *
 * The attributes are written on `document.documentElement` rather than on a
 * wrapper div, for one reason that only shows up in practice: modals, tooltips,
 * select menus and toasts portal to `document.body`. If the theme lived on a
 * wrapper inside the app, every portalled overlay would fall back to the default
 * theme and the switcher would appear to work everywhere except the components
 * that matter most.
 */

interface ThemeContextValue {
	theme: ThemeName;
	density: DensityName;
	setTheme: (theme: ThemeName) => void;
	setDensity: (density: DensityName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "fds-docs-theme";
const DENSITY_KEY = "fds-docs-density";

function isThemeName(value: string | null): value is ThemeName {
	return value !== null && themes.some((theme) => theme.name === value);
}

function isDensityName(value: string | null): value is DensityName {
	return value === "comfortable" || densities.some((density) => density.name === value);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<ThemeName>(() => {
		if (typeof window === "undefined") return defaultTheme;
		const stored = window.localStorage.getItem(THEME_KEY);
		return isThemeName(stored) ? stored : defaultTheme;
	});
	const [density, setDensityState] = useState<DensityName>(() => {
		if (typeof window === "undefined") return "comfortable";
		const stored = window.localStorage.getItem(DENSITY_KEY);
		return isDensityName(stored) ? stored : "comfortable";
	});

	useEffect(() => {
		document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
		window.localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	useEffect(() => {
		document.documentElement.setAttribute(DENSITY_ATTRIBUTE, density);
		window.localStorage.setItem(DENSITY_KEY, density);
	}, [density]);

	const setTheme = useCallback((next: ThemeName) => setThemeState(next), []);
	const setDensity = useCallback((next: DensityName) => setDensityState(next), []);

	const value = useMemo(
		() => ({ theme, density, setTheme, setDensity }),
		[theme, density, setTheme, setDensity],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme() requires <ThemeProvider>.");
	return context;
}

/** Theme and density switchers, rendered in the top bar. */
export function ThemeControls() {
	const { theme, density, setTheme, setDensity } = useTheme();

	return (
		<div className="control-row">
			<div className="segmented" role="group" aria-label="Theme">
				{themes.map((item) => (
					<button
						key={item.name}
						type="button"
						className="segmented__option"
						aria-pressed={theme === item.name}
						onClick={() => setTheme(item.name as ThemeName)}
						title={item.description}
					>
						{item.label}
					</button>
				))}
			</div>
			<div className="segmented" role="group" aria-label="Density">
				<button
					type="button"
					className="segmented__option"
					aria-pressed={density === "comfortable"}
					onClick={() => setDensity("comfortable")}
				>
					Comfortable
				</button>
				{densities.map((item) => (
					<button
						key={item.name}
						type="button"
						className="segmented__option"
						aria-pressed={density === item.name}
						onClick={() => setDensity(item.name as DensityName)}
						title={item.description}
					>
						{item.label}
					</button>
				))}
			</div>
		</div>
	);
}
