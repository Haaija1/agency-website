/* Illustrative workflows for "Example workflows". TODO: every number is a placeholder (Haaija to confirm or replace once a client signs
   off); shown on screen as "Illustrative". No client names. A node is [id, kind, title, sub-line, column, row, leavesTheBusiness?];
   an edge is [from, to, label?] and always runs left to right. Kinds: trigger, step, ai (the one AI step), human, done, hub. */
(function (root) {
  'use strict';
  var WEEKS_PER_MONTH = 4.33; // same constant as the agency kit's ROI calculator
  var KINDS = ['trigger', 'step', 'ai', 'human', 'done', 'hub'];
  function F(nodes, edges) {
    return { nodes: nodes.map(function (a) { return { id: a[0], k: a[1], t: a[2], s: a[3], c: a[4], r: a[5], out: !!a[6] }; }), edges: edges };
  }
  var EXAMPLES = {
    'w-enquiries': { title: 'Enquiries', perWeek: 20, what: 'enquiries', minByHand: 6, minWith: 1, note: 'about 1 min each to review what is flagged',
      flow: F([['a', 'trigger', 'New enquiry', 'form, email or WhatsApp', 0, 1], ['b', 'step', 'Check the details', 'required fields, duplicates', 1, 1],
               ['c', 'ai', 'Flag what is unclear', 'marks what needs a person', 2, 1], ['d', 'step', 'Update the tracker', 'one shared record', 3, 0],
               ['e', 'human', 'A person reviews', 'only the flagged ones', 3, 2], ['f', 'done', 'Team sees one view', 'the right person is told', 4, 1]],
              [['a', 'b'], ['b', 'c'], ['c', 'd', 'clear'], ['c', 'e', 'unclear'], ['d', 'f'], ['e', 'f']]) },
    'w-invoices': { title: 'Invoices', perWeek: 10, what: 'invoices', minByHand: 12, minWith: 3, note: 'about 3 min each to approve a drafted one',
      flow: F([['a', 'trigger', 'Job marked done', 'in your tracker', 0, 1], ['b', 'step', 'Draft the invoice', 'from the job details', 1, 1],
               ['c', 'step', 'Check the totals', 'line items must add up', 2, 1], ['d', 'human', 'You approve it', 'nothing goes out without this', 3, 1],
               ['e', 'step', 'Send to the client', 'only after you approve', 4, 1, 1], ['f', 'done', 'Logged in the tracker', 'sent date and amount', 5, 1]],
              [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e', 'approved'], ['e', 'f']]) },
    'w-chat': { title: 'Chat', perWeek: 40, what: 'routine messages', minByHand: 3, minWith: 1, note: 'about 1 min each to check a draft',
      flow: F([['a', 'trigger', 'Message arrives', 'WhatsApp or web chat', 0, 1], ['b', 'step', 'Sort by topic', 'price, booking, status', 1, 1],
               ['c', 'ai', 'Draft a reply', 'from your own answers', 2, 0], ['d', 'human', 'A person writes it', 'anything unusual', 2, 2],
               ['e', 'human', 'A person checks it', 'edit or approve the draft', 3, 0], ['f', 'step', 'Send the reply', 'only after a person says yes', 4, 1, 1],
               ['g', 'done', 'Logged to the contact', 'the whole thread in one place', 5, 1]],
              [['a', 'b'], ['b', 'c', 'routine'], ['b', 'd', 'other'], ['c', 'e'], ['e', 'f'], ['d', 'f'], ['f', 'g']]) },
    'w-calendar': { title: 'Calendar', perWeek: 15, what: 'booking requests', minByHand: 8, minWith: 2, note: 'about 2 min each to confirm',
      flow: F([['a', 'trigger', 'Booking request', 'by message or form', 0, 1], ['b', 'step', 'Check availability', 'your live calendar', 1, 1],
               ['c', 'step', 'Pick free times', 'two or three options', 2, 1], ['d', 'human', 'You confirm', 'one tap before it sends', 3, 1],
               ['e', 'step', 'Offer the times', 'sent to the customer', 4, 1, 1], ['f', 'done', 'Booked and reminded', 'event added, reminder set', 5, 1]],
              [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e', 'confirmed'], ['e', 'f']]) },
    'w-tracker': { title: 'Tracker', perWeek: 25, what: 'status changes', minByHand: 4, minWith: 1, note: 'about 1 min each, mostly exceptions',
      flow: F([['a', 'trigger', 'Job changes status', 'someone updates it', 0, 1], ['b', 'step', 'Update the tracker', 'one source of truth', 1, 1],
               ['c', 'step', 'Work out who needs it', 'by job and stage', 2, 0], ['d', 'step', 'Notify them', 'a short internal message', 3, 0],
               ['e', 'human', 'Exceptions to a person', 'late, stuck or unusual', 2, 2], ['f', 'done', 'Everyone is in step', 'no chasing for updates', 4, 1]],
              [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'f'], ['b', 'e', 'exception'], ['e', 'f']]) },
    'w-email': { title: 'Email', perWeek: 30, what: 'emails', minByHand: 4, minWith: 1, note: 'about 1 min each to check what is unclear',
      flow: F([['a', 'trigger', 'Email arrives', 'a shared inbox', 0, 1], ['b', 'ai', 'Pull out the key details', 'who, what, when, how much', 1, 1],
               ['c', 'step', 'Match it to a record', 'by reference or name', 2, 1], ['d', 'step', 'File it', 'attached to that record', 3, 0],
               ['e', 'human', 'Unclear ones to a person', 'no match, or not sure', 3, 2], ['f', 'done', 'Records are up to date', 'nothing left in the inbox', 4, 1]],
              [['a', 'b'], ['b', 'c'], ['c', 'd', 'found'], ['c', 'e', 'no match'], ['d', 'f'], ['e', 'f']]) },
    'w-sheets': { title: 'Spreadsheets', perWeek: 1, what: 'weekly reconcile', minByHand: 180, minWith: 45, note: 'about 45 min to check the differences it lists',
      flow: F([['a', 'trigger', 'Every Friday', 'a scheduled run', 0, 1], ['b', 'step', 'Read source one', 'sales export', 1, 0],
               ['c', 'step', 'Read source two', 'bank export', 1, 1], ['d', 'step', 'Read source three', 'supplier list', 1, 2],
               ['e', 'step', 'Combine in one sheet', 'same columns, same names', 2, 1], ['f', 'step', 'List the differences', 'anything that does not match', 3, 1],
               ['g', 'human', 'A person checks them', 'decides what is right', 4, 1], ['h', 'done', 'Clean sheet is ready', 'ready for the week', 5, 1]],
              [['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'e'], ['c', 'e'], ['d', 'e'], ['e', 'f'], ['f', 'g'], ['g', 'h']]) },
    'w-team': { title: 'Your team', line: 'Approvals, exceptions, and handovers stay with people.',
      flow: F([['a', 'hub', 'Your team', 'decides, approves, steps in', 0, 1], ['b', 'human', 'Approvals', 'money and anything sent out', 1, 0],
               ['c', 'human', 'Exceptions', 'what a workflow cannot decide', 1, 1], ['d', 'human', 'Handovers', 'when a customer needs a person', 1, 2]],
              [['a', 'b'], ['a', 'c'], ['a', 'd']]) }
  };
  function fmt(m) {
    m = Math.round(m); var h = Math.floor(m / 60), r = m % 60;
    return h ? (r ? h + ' h ' + r + ' min' : h + ' h') : r + ' min';
  }
  function compute(e) {
    var before = e.perWeek * e.minByHand, after = e.perWeek * e.minWith, saved = before - after;
    return { before: before, after: after, saved: saved,
             monthlyHours: Math.round(saved * WEEKS_PER_MONTH / 60 * 10) / 10, share: after / before };
  }
  function assumption(e) {
    if (!e.perWeek) return '';
    var lead = e.perWeek > 1
      ? e.perWeek + ' ' + e.what + ' a week at ' + fmt(e.minByHand) + ' each by hand'
      : 'one ' + e.what + ' at ' + fmt(e.minByHand) + ' by hand';
    return 'Assumes ' + lead + ', and ' + e.note + '.';
  }
  function savedLine(e) { return e.perWeek ? 'About ' + fmt(compute(e).saved) + ' back each week' : ''; }
  function flowStats(e) {
    var n = e.flow.nodes;
    return { nodes: n.length, ai: n.filter(function (x) { return x.k === 'ai'; }).length, human: n.filter(function (x) { return x.k === 'human'; }).length };
  }
  function shape(e) {
    var n = e.flow.nodes;
    return { cols: Math.max.apply(null, n.map(function (x) { return x.c; })) + 1, rows: Math.max.apply(null, n.map(function (x) { return x.r; })) + 1 };
  }
  /* Where the popup goes: beside the tool (node rect n = {left,right,top,bottom}), on the side with more room, 10px away, as wide as the room allows
     (p = {w,h} wanted size, f = {w,h} field, m = margin to the field's edge, minW = narrowest it may get), centred on the tool's height and kept inside the field. */
  function place(n, p, f, gap, m, minW) {
    gap = gap == null ? 10 : gap; m = m == null ? 8 : m; minW = minW || 340;
    var roomR = f.w - m - (n.right + gap), roomL = n.left - gap - m;
    var side = p.w <= roomR ? 'r' : p.w <= roomL ? 'l' : roomR >= roomL ? 'r' : 'l';
    var w = Math.max(minW, Math.min(p.w, side === 'r' ? roomR : roomL));
    var left = side === 'r' ? n.right + gap : n.left - gap - w;
    left = Math.max(m, Math.min(f.w - m - w, left));
    var top = Math.max(m, Math.min(f.h - m - p.h, (n.top + n.bottom) / 2 - p.h / 2));
    return { left: left, top: top, w: w, side: side };
  }
  function order(e) { return e.flow.nodes.slice().sort(function (a, b) { return a.c - b.c || a.r - b.r; }); }
  var api = { EXAMPLES: EXAMPLES, KINDS: KINDS, compute: compute, fmt: fmt, WEEKS_PER_MONTH: WEEKS_PER_MONTH,
              assumption: assumption, savedLine: savedLine, flowStats: flowStats, shape: shape, order: order, place: place };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.SITE_EXAMPLES = api;
})(typeof window !== 'undefined' ? window : this);
