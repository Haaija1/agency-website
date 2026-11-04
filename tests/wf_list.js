// Builds the no-JavaScript list for the "Example workflows" section from the same data the explorer uses,
// so the page text and the interactive version can never disagree. examples.test.js requires this exact string in index.html.
// Print it with:  node tests/wf_list.js
const { EXAMPLES, order, savedLine } = require('../weave-examples.js');
const IDS = ['w-enquiries', 'w-invoices', 'w-chat', 'w-calendar', 'w-tracker', 'w-email', 'w-sheets', 'w-team'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function listHtml() {
  const items = IDS.map((id) => {
    const e = EXAMPLES[id], steps = order(e).map((n) => '        <li>' + esc(n.t) + '</li>').join('\n'), sv = savedLine(e);
    return '    <li class="wf-item">\n      <h3>' + esc(e.title) + '</h3>\n      <ol>\n' + steps + '\n      </ol>\n' +
      '      <p class="wf-saved">' + (sv ? sv + ' (illustrative)' : esc(e.line)) + '</p>\n    </li>';
  });
  return '<ul class="wf-list" role="list">\n' + items.join('\n') + '\n    </ul>\n';
}
if (require.main === module) process.stdout.write(listHtml());
module.exports = { listHtml, IDS };
