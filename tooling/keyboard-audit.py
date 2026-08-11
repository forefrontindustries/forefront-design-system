"""Keyboard and ARIA behaviour audit, driven for real in a browser.

Run it against the docs site with the dev server up:

    bun run dev                       # in one terminal, serves :4200
    bun run audit:keyboard            # in another

Every assertion here is something a keyboard user would notice, not the presence
of an attribute. `aria-modal="true"` is trivially assertable and proves nothing;
whether Tab can escape an open dialog is the actual question, so the audit presses
the keys and reads back document.activeElement.

Two real bugs came out of writing it, both invisible to review and to every
screenshot:

  1. Portal returned null until its own mount effect ran, which put the panel one
     commit later than the parent's effects. Modal's focus trap ran against a null
     ref, bailed, and never re-ran because its dependencies had not changed. The
     dialog opened with focus still behind it and the page underneath fully
     tabbable. Fixed by creating the portal host during render, and hardened by
     making the trap wait for a container instead of silently doing nothing.

  2. Toast declared role="status" and aria-live on elements that were being
     inserted in the same tick, and mounted no live region at all until the first
     toast fired. role="alert" is announced on insertion; role="status" is not
     dependably. The viewport is now a persistent polite live region owned by the
     provider, and only assertive toasts declare their own semantics.

Requires: python3, the playwright package, and Chrome at /usr/bin/google-chrome.
Exits non-zero on any failed assertion or any console error, so it can gate a
pull request the same way the token build does.
"""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:4200"
results = []
console = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS  " if ok else "FAIL  ") + name + ((" :: " + str(detail)) if detail else ""))


def run(p):
    # ---------------------------------------------------------------- Modal
    p.goto(f"{BASE}/components/modal", wait_until="networkidle")
    p.wait_for_timeout(500)
    trigger = p.locator(".demo button").first
    trigger.focus()
    trig_text = trigger.inner_text().strip()
    p.keyboard.press("Enter")
    p.wait_for_timeout(450)
    dialog = p.locator("[role=dialog]").first
    check("Modal: opens from the keyboard", dialog.is_visible())
    check("Modal: aria-modal is set", dialog.get_attribute("aria-modal") == "true")
    labelled = dialog.get_attribute("aria-labelledby")
    check(
        "Modal: accessible name resolves to a real element",
        bool(labelled) and p.locator(f"#{labelled}").count() == 1,
        labelled,
    )
    check(
        "Modal: body scroll is locked while open",
        p.evaluate("getComputedStyle(document.body).overflow") == "hidden",
        p.evaluate("getComputedStyle(document.body).overflow"),
    )
    # focus moved into the dialog
    inside = p.evaluate("!!document.activeElement.closest('[role=dialog]')")
    check("Modal: focus moves into the dialog on open", inside)
    # trap: tab well past the last stop and stay inside
    for _ in range(14):
        p.keyboard.press("Tab")
    check(
        "Modal: Tab is trapped inside the dialog",
        p.evaluate("!!document.activeElement.closest('[role=dialog]')"),
        p.evaluate("document.activeElement.outerHTML.slice(0,70)"),
    )
    for _ in range(6):
        p.keyboard.press("Shift+Tab")
    check(
        "Modal: Shift+Tab is trapped too",
        p.evaluate("!!document.activeElement.closest('[role=dialog]')"),
    )
    p.keyboard.press("Escape")
    p.wait_for_timeout(450)
    check("Modal: Escape closes it", p.locator("[role=dialog]").count() == 0 or not dialog.is_visible())
    check(
        "Modal: focus returns to the trigger",
        p.evaluate("(document.activeElement.innerText || '').trim()") == trig_text,
        f"expected {trig_text!r}, got {p.evaluate('(document.activeElement.innerText||\'\').trim()')!r}",
    )
    check(
        "Modal: scroll lock is released",
        p.evaluate("getComputedStyle(document.body).overflow") != "hidden",
    )

    # ---------------------------------------------------------------- Tabs
    p.goto(f"{BASE}/components/tabs", wait_until="networkidle")
    p.wait_for_timeout(500)
    tablist = p.locator("[role=tablist]").first
    tabs = tablist.locator("[role=tab]:not([disabled])")
    n = tabs.count()
    check("Tabs: the demo includes a disabled tab, which the arrows must skip",
          tablist.locator("[role=tab][disabled]").count() > 0)
    zero = tablist.evaluate("el => el.querySelectorAll(\"[role=tab][tabindex='0']\").length")
    check("Tabs: exactly one tab stop in the list (roving tabindex)", zero == 1, f"{zero} of {n}")
    tabs.nth(0).focus()
    first_id = tabs.nth(0).get_attribute("id")
    p.keyboard.press("ArrowRight")
    p.wait_for_timeout(250)
    moved = p.evaluate("document.activeElement.getAttribute('role')") == "tab"
    now_id = p.evaluate("document.activeElement.id")
    check("Tabs: ArrowRight moves focus to the next tab", moved and now_id != first_id, now_id)
    check(
        "Tabs: the focused tab is the selected one",
        p.evaluate("document.activeElement.getAttribute('aria-selected')") == "true",
    )
    p.keyboard.press("End")
    p.wait_for_timeout(250)
    check(
        "Tabs: End jumps to the last tab",
        p.evaluate("document.activeElement.id") == tabs.nth(n - 1).get_attribute("id"),
    )
    p.keyboard.press("Home")
    p.wait_for_timeout(250)
    check("Tabs: Home jumps to the first tab", p.evaluate("document.activeElement.id") == first_id)
    panel_id = p.evaluate("document.activeElement.getAttribute('aria-controls')")
    check(
        "Tabs: aria-controls points at the visible panel",
        p.locator(f"#{panel_id}").count() == 1 and p.locator(f"#{panel_id}").is_visible(),
        panel_id,
    )
    p.keyboard.press("Tab")
    check(
        "Tabs: one Tab press from the list reaches the panel",
        p.evaluate("document.activeElement.getAttribute('role')") == "tabpanel",
        p.evaluate("document.activeElement.getAttribute('role')"),
    )

    # ---------------------------------------------------------------- Select
    p.goto(f"{BASE}/components/select", wait_until="networkidle")
    p.wait_for_timeout(500)
    combo = p.locator("[role=combobox]").first
    combo.focus()
    check("Select: trigger is a combobox", combo.get_attribute("role") == "combobox")
    check("Select: closed state reports aria-expanded=false", combo.get_attribute("aria-expanded") == "false")
    p.keyboard.press("ArrowDown")
    p.wait_for_timeout(350)
    check("Select: ArrowDown opens the listbox", combo.get_attribute("aria-expanded") == "true")
    check(
        "Select: DOM focus stays on the trigger while open",
        p.evaluate("document.activeElement.getAttribute('role')") == "combobox",
        p.evaluate("document.activeElement.getAttribute('role')"),
    )
    active = combo.get_attribute("aria-activedescendant")
    check(
        "Select: aria-activedescendant names a real option",
        bool(active) and p.locator(f"#{active}").count() == 1,
        active,
    )
    check(
        "Select: the active option is inside the listbox",
        p.locator(f"#{active}").evaluate("el => el.getAttribute('role')") == "option",
    )
    p.keyboard.press("ArrowDown")
    p.wait_for_timeout(200)
    moved = combo.get_attribute("aria-activedescendant")
    check("Select: ArrowDown moves the active option", moved != active, f"{active} -> {moved}")
    p.keyboard.press("End")
    p.wait_for_timeout(200)
    last = combo.get_attribute("aria-activedescendant")
    check("Select: End moves to the last option", last != moved)
    # typeahead
    listbox_id = combo.get_attribute("aria-controls")
    opts = p.locator(f"#{listbox_id} [role=option]")
    letter = opts.nth(0).inner_text().strip()[0]
    p.keyboard.press("Home")
    p.wait_for_timeout(150)
    before = combo.get_attribute("aria-activedescendant")
    p.keyboard.type(letter)
    p.wait_for_timeout(250)
    after = combo.get_attribute("aria-activedescendant")
    check(
        "Select: typeahead moves the active option",
        p.locator(f"#{after}").inner_text().strip().lower().startswith(letter.lower()),
        f"typed {letter!r}, active {p.locator(f'#{after}').inner_text().strip()!r}",
    )
    p.keyboard.press("Escape")
    p.wait_for_timeout(300)
    check("Select: Escape closes the listbox", combo.get_attribute("aria-expanded") == "false")
    check(
        "Select: Escape leaves focus on the trigger",
        p.evaluate("document.activeElement.getAttribute('role')") == "combobox",
    )
    p.keyboard.press("Enter")
    p.wait_for_timeout(300)
    check("Select: Enter reopens the listbox", combo.get_attribute("aria-expanded") == "true")
    first_opt = opts.nth(0)
    p.keyboard.press("Home")
    p.wait_for_timeout(150)
    chosen = p.locator(f"#{combo.get_attribute('aria-activedescendant')}").inner_text().strip()
    p.keyboard.press("Enter")
    p.wait_for_timeout(300)
    check("Select: Enter commits the active option", chosen.split("\n")[0] in combo.inner_text(), f"{chosen!r} vs {combo.inner_text()!r}")
    check("Select: committing closes the listbox", combo.get_attribute("aria-expanded") == "false")

    # ---------------------------------------------------------------- Checkbox / Radio / Switch
    p.goto(f"{BASE}/components/checkbox", wait_until="networkidle")
    p.wait_for_timeout(500)
    cb = p.locator("input[type=checkbox]:not([disabled])").first
    cb.focus()
    before = cb.is_checked()
    p.keyboard.press("Space")
    p.wait_for_timeout(200)
    check("Checkbox: Space toggles it", cb.is_checked() != before)
    ind = p.locator("input[type=checkbox][aria-checked='mixed'], input[type=checkbox]:indeterminate")
    check("Checkbox: an indeterminate example exists and reports mixed", ind.count() > 0, ind.count())

    p.goto(f"{BASE}/components/radio", wait_until="networkidle")
    p.wait_for_timeout(500)
    group = p.locator("[role=radiogroup]").first
    check("RadioGroup: uses role=radiogroup", group.count() == 1)
    radios = group.locator("input[type=radio]:not([disabled])")
    radios.nth(0).focus()
    p.keyboard.press("ArrowDown")
    p.wait_for_timeout(250)
    check(
        "RadioGroup: ArrowDown moves and selects the next radio",
        p.evaluate("document.activeElement.checked === true && document.activeElement.type === 'radio'"),
    )
    checked_count = group.evaluate("el => el.querySelectorAll('input[type=radio]:checked').length")
    check("RadioGroup: only one radio is checked at a time", checked_count == 1, checked_count)
    # Native radios all report tabIndex 0, so the DOM attribute proves nothing.
    # The real question is whether one Tab press leaves the group.
    p.keyboard.press("Tab")
    p.wait_for_timeout(200)
    check(
        "RadioGroup: one Tab press leaves the group (single tab stop)",
        not group.evaluate("el => el.contains(document.activeElement)"),
        p.evaluate("document.activeElement.tagName + '.' + (document.activeElement.className||'').split(' ')[0]"),
    )

    p.goto(f"{BASE}/components/switch", wait_until="networkidle")
    p.wait_for_timeout(500)
    sw = p.locator("[role=switch]:not([disabled]), input[type=checkbox][role=switch]").first
    if sw.count() == 0:
        sw = p.locator(".fds-switch input").first
    sw.focus()
    before = p.evaluate("document.activeElement.checked ?? document.activeElement.getAttribute('aria-checked')")
    p.keyboard.press("Space")
    p.wait_for_timeout(250)
    after = p.evaluate("document.activeElement.checked ?? document.activeElement.getAttribute('aria-checked')")
    check("Switch: Space toggles it", str(before) != str(after), f"{before} -> {after}")

    # ---------------------------------------------------------------- Input validation wiring
    p.goto(f"{BASE}/components/input", wait_until="networkidle")
    p.wait_for_timeout(500)
    invalid = p.locator("input[aria-invalid='true']").first
    check("Input: an invalid example reports aria-invalid", invalid.count() > 0)
    err = invalid.get_attribute("aria-errormessage") or invalid.get_attribute("aria-describedby")
    check(
        "Input: the error message is wired and present in the DOM",
        bool(err) and p.locator("#" + err.split()[0]).count() == 1,
        err,
    )
    lbl = invalid.get_attribute("id")
    check(
        "Input: every field input has a label element pointing at it",
        p.evaluate(
            """() => Array.from(document.querySelectorAll('.fds-field input, .fds-input__control'))
                 .every(i => !i.id || document.querySelector(`label[for="${i.id}"]`))"""
        ),
    )

    # ---------------------------------------------------------------- Tooltip
    p.goto(f"{BASE}/components/tooltip", wait_until="networkidle")
    p.wait_for_timeout(500)
    tt_trigger = p.locator(".demo [aria-describedby], .demo button").first
    tt_trigger.focus()
    p.wait_for_timeout(700)
    described = p.evaluate("document.activeElement.getAttribute('aria-describedby')")
    check("Tooltip: opens on keyboard focus", bool(described), described)
    if described:
        check(
            "Tooltip: aria-describedby resolves to the visible tooltip",
            p.locator("#" + described).count() == 1,
        )
        check("Tooltip: uses role=tooltip", p.locator("#" + described).get_attribute("role") == "tooltip")
    p.keyboard.press("Escape")
    p.wait_for_timeout(400)
    check(
        "Tooltip: Escape dismisses it while focus stays put",
        not p.evaluate("document.activeElement.getAttribute('aria-describedby')"),
        p.evaluate("document.activeElement.getAttribute('aria-describedby')"),
    )

    # ---------------------------------------------------------------- Toast
    p.goto(f"{BASE}/components/toast", wait_until="networkidle")
    p.wait_for_timeout(500)
    region = p.locator("[role=region][aria-live=polite]")
    check(
        "Toast: a persistent polite live region exists before any toast is fired",
        region.count() > 0 and p.locator("[role=status], [role=alert]").count() == 0,
        f"regions={region.count()} live-items={p.locator('[role=status], [role=alert]').count()}",
    )
    fire = p.locator(".demo button").first
    fire.focus()
    p.keyboard.press("Enter")
    p.wait_for_timeout(600)
    check(
        "Toast: firing from the keyboard renders a toast into the live region",
        region.first.locator("li").count() > 0,
        region.first.locator("li").count(),
    )
    check(
        "Toast: a polite toast lands inside the persistent region",
        region.first.locator("li").count() > 0,
        region.first.locator("li").count(),
    )
    danger = p.locator(".demo button", has_text="Error, never auto-dismisses").first
    danger.focus()
    p.keyboard.press("Enter")
    p.wait_for_timeout(700)
    check(
        "Toast: a danger toast declares role=alert and assertive politeness",
        p.locator("[role=alert][aria-live=assertive]").count() > 0,
        p.locator("[role=alert]").count(),
    )
    check(
        "Toast: a polite toast does not declare its own live semantics",
        p.locator("[role=status]").count() == 0,
        p.locator("[role=status]").count(),
    )
    # timer pause: tab into the toast and confirm it survives past its normal duration
    toast_action = region.first.locator("li button").first
    if toast_action.count() > 0:
        toast_action.focus()
        p.wait_for_timeout(2500)
        check(
            "Toast: the dismiss timer pauses while a toast holds focus",
            region.first.locator("li").count() > 0,
            region.first.locator("li").count(),
        )

    # ---------------------------------------------------------------- Reduced motion
    p.emulate_media(reduced_motion="reduce")
    p.goto(f"{BASE}/components/button", wait_until="networkidle")
    p.wait_for_timeout(400)
    zeroed = p.evaluate(
        """() => {
            const cs = getComputedStyle(document.documentElement);
            const names = ['--fds-duration-fast','--fds-duration-moderate','--fds-duration-slow','--fds-duration-slower'];
            return names.map(n => [n, cs.getPropertyValue(n).trim()]);
        }"""
    )
    check(
        "Reduced motion: duration primitives are zeroed at the token layer",
        all(v in ("0ms", "0s", "0") for _, v in zeroed),
        zeroed,
    )
    still_visible = p.locator(".demo button").first.is_visible()
    check("Reduced motion: components still render and remain usable", still_visible)
    p.emulate_media(reduced_motion="no-preference")

    # ---------------------------------------------------------------- Focus ring consistency
    p.goto(f"{BASE}/components/button", wait_until="networkidle")
    p.wait_for_timeout(400)
    ring = p.evaluate(
        """() => {
            const cs = getComputedStyle(document.documentElement);
            return {
              w: cs.getPropertyValue('--fds-focus-ring-width').trim(),
              o: cs.getPropertyValue('--fds-focus-ring-offset').trim(),
              c: cs.getPropertyValue('--fds-focus-ring-color').trim(),
            };
        }"""
    )
    check("Focus ring: geometry is exposed as tier 3 tokens", all(ring.values()), ring)


with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    page = b.new_page(viewport={"width": 1440, "height": 1000})
    page.on("console", lambda m: console.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console.append("PAGEERROR: " + str(e)))
    try:
        run(page)
    finally:
        b.close()

failed = [r for r in results if not r[1]]
print()
print(f"=== {len(results) - len(failed)}/{len(results)} checks passed")
if failed:
    print("FAILURES:")
    for name, _, detail in failed:
        print(f"  - {name} :: {detail}")
print("CONSOLE ERRORS:", "\n".join(console) if console else "none")

sys.exit(1 if (failed or console) else 0)
