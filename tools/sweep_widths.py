"""Width sweep for the page web. Run INSIDE browser_exec (it uses the harness helpers cdp, js, goto_url, wait_for_load):

    exec(open(r"C:\\...\\docs\\teardown\\tools\\sweep_widths.py").read())
    sweep("file:///path/to/index.html")

For each width it loads the page fresh at that width and gates on ALL of:
  - web_collision.js reports 0 collisions and 0 boxHits, on a web that is alive: enough samples, a main route, and a knot at Contact.
    ("0 collisions" on a dead web is a vacuous pass. At 390 px an early build had 96 samples and 'passed'.)
  - no sideways page scroll
  - a negative control at the end: a line drawn through the first heading must be caught (proves the checker is awake)
Prints one line per width and returns True only if every gate holds.
"""
import os
import time

WIDTHS = (1440, 1280, 1024, 768, 600, 480, 390, 320)
MIN_SAMPLES = 1500


def sweep(url, tools_dir=None, widths=WIDTHS, settle=2.4, min_samples=MIN_SAMPLES):
    tools_dir = tools_dir or os.path.dirname(os.path.abspath(globals().get("__file__", ".")))
    coll = open(os.path.join(tools_dir, "web_collision.js"), encoding="utf-8").read()
    cdp('Page.bringToFront')
    ok_all = True
    for w in widths:
        cdp('Emulation.clearDeviceMetricsOverride')
        cdp('Emulation.setDeviceMetricsOverride', width=w, height=800, deviceScaleFactor=1, mobile=False)
        goto_url(url)
        wait_for_load()
        time.sleep(settle)
        r = js(coll)
        st = js("""({
            hscroll: document.documentElement.scrollWidth > innerWidth,
            branches: document.querySelectorAll('svg.grow-web path').length,
            mains: document.querySelectorAll('svg.grow-web path.main').length,
            target: !!document.querySelector('svg.grow-web circle.k-t'),
            page: document.documentElement.scrollHeight
        })""")
        gates = {
            'collisions=0': r['collisions'] == 0,
            'boxHits=0': r['boxHits'] == 0,
            'alive(samples>=%d)' % min_samples: r['samples'] >= min_samples,
            'main route': st['mains'] >= 1,
            'reaches Contact': st['target'],
            'no h-scroll': not st['hscroll'],
        }
        bad = [k for k, v in gates.items() if not v]
        ok_all = ok_all and not bad
        print("w=%4d  samples=%5d  collisions=%d  boxHits=%d  branches=%3d  mains=%2d  contact=%s  hscroll=%s  pageH=%5d  %s%s" % (
            w, r['samples'], r['collisions'], r['boxHits'], st['branches'], st['mains'], st['target'], st['hscroll'], st['page'],
            'OK' if not bad else 'FAIL: ' + ', '.join(bad), ('  first=%s' % r['first'][:2]) if r['first'] else ''))
    # negative control, at the last width: draw through the first heading; the checker must notice
    ctl = js("""(() => {
        const s = document.querySelector('svg.grow-web'), h = document.querySelector('main h2, main h1');
        if (!s || !h) return null;
        const o = s.getBoundingClientRect(), q = h.getBoundingClientRect();
        const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ln.setAttribute('d', 'M' + (q.left - o.left - 20) + ' ' + (q.top - o.top + q.height / 2) + 'L' + (q.right - o.left + 20) + ' ' + (q.top - o.top + q.height / 2));
        ln.setAttribute('class', 'neg-control'); s.appendChild(ln);
        return true; })()""")
    r2 = js(coll)
    js("document.querySelectorAll('.neg-control').forEach(e => e.remove())")
    caught = ctl and (r2['collisions'] + r2['boxHits']) > 0
    print("negative control (a line through a heading): %s (%s hits)" % ('caught' if caught else 'MISSED', r2['collisions'] + r2['boxHits']))
    ok_all = ok_all and bool(caught)
    cdp('Emulation.clearDeviceMetricsOverride')
    print("SWEEP:", "PASS" if ok_all else "FAIL")
    return ok_all
