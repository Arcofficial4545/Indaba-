import type { ArticleSeed } from "./articles";

type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedDate: string;
  image?: string;
  content: string;
};

// These are disclosed editorial pen names, not claims about real contributors.
// Keep the body, metadata and reading time together for both data sources.
const guides: Guide[] = [
  {
    slug: "software-demo-scorecard-south-africa",
    publishedDate: "2026-01-18T00:00:00.000Z",
    title: "Take control of the software demo: a scorecard for South African teams",
    excerpt: "A polished demo can hide a difficult working day. Give every supplier the same tasks and compare the evidence that comes back.",
    category: "Buying advice",
    author: "Lerato Mokoena",
    image: "demo-scorecard",
    content: `
<p>The first ten minutes of a software demonstration usually go well. The sample data is tidy, the presenter knows every shortcut and nobody has forgotten a password. Your business will give the system a harder afternoon. A useful demo should show how it handles that afternoon before you sign anything.</p>
<p>For a South African team comparing local suppliers with international platforms, a common script also makes support arrangements, billing assumptions and implementation responsibilities easier to compare. You are buying a working process, not the most confident presentation.</p>
<h2>Write three tasks before booking the meeting</h2>
<p>Choose one everyday task, one exception and one management question. For a CRM, that might mean assigning an enquiry, moving it when the salesperson is absent, and finding opportunities with no next action. For an accounting package, use a supplier bill, a disputed transaction and an outstanding-items report. Use anonymised examples with enough detail to expose the awkward parts.</p>
<p>Send the tasks in advance. Surprise tests reward presenters who think quickly; prepared demonstrations reveal whether the product can do the work. Ask the supplier to identify anything that needs an add-on, a higher plan or paid configuration.</p>
<h2>Score what happened, not how it felt</h2>
<ul><li><strong>0:</strong> The task could not be completed.</li><li><strong>1:</strong> It required a separate tool or an unproven workaround.</li><li><strong>2:</strong> It worked, with extra administration your team accepts.</li><li><strong>3:</strong> A normal user completed it and the result was easy to check.</li></ul>
<p>Record the plan demonstrated beside each score. A strong result in an enterprise edition tells you little about the entry plan on your quote. Keep non-negotiables separate from the total: an essential permission restriction cannot be rescued by excellent dashboard colours.</p>
<h2>Hand over the mouse</h2>
<p>Ask someone who will use the system to repeat one task without instructions. Count where they hesitate, where information disappears and where they need administrator access. Do not treat unfamiliarity as failure, but distinguish a short learning curve from a workflow that requires constant specialist help.</p>
<p>Then introduce a correction. Change the customer, reverse the approval or fix the wrong date. Demonstrations that stop at successful creation leave out much of the real workload.</p>
<h2>Finish with a written evidence list</h2>
<p>Request the proposed plan, unresolved questions, support hours in South African time and a clear split between your responsibilities and the implementation partner's. Mark any promise awaiting proof as pending. Score independently before the group discussion so a senior person's enthusiasm does not become everybody's verdict.</p>
<p>Use the <a href="/software">Indaba software directory</a> to build the initial shortlist. Bring only the credible candidates into this exercise. Three properly tested options will tell you more than a dozen introductory calls.</p>
`,
  },
  {
    slug: "accounting-migration-opening-balances-checklist",
    publishedDate: "2025-07-21T00:00:00.000Z",
    title: "Moving accounting systems? Get the opening balances right first",
    excerpt: "A practical migration checklist for agreeing a cutover date, checking balances and keeping old records accessible without importing every mistake.",
    category: "Accounting",
    author: "Daniel van Wyk",
    image: "accounting-migration",
    content: `
<p>A new accounting system can look ready while still being wrong. Customers are loaded, the logo appears on invoices and the bank connection works. Then the first customer statement disagrees with the old ledger. The problem is often a migration decision that nobody wrote down.</p>
<p>This is a guide to organising the move, rather than deciding accounting treatments. Your accountant should approve the balances and treatment of outstanding items. The software team's job is to make those approved decisions reproducible.</p>
<h2>Give the cutover a precise boundary</h2>
<p>Choose the final transaction date in the old system and the first date in the new one. Record who may make late corrections and how those corrections reach the new ledger. Without that boundary, two people can enter the same supplier invoice in different systems and both believe they are helping.</p>
<p>Save the agreed reports before importing anything. Include the trial balance, outstanding customer and supplier items, bank reconciliation and any stock or asset schedules within scope. Keep the export date and the reporting period with each file.</p>
<h2>Decide how much history earns its place</h2>
<p>Full transaction history sounds reassuring, but it brings mapping, attachments and reconciliation work. Opening balances with detailed outstanding items may be more manageable when the old records remain accessible. Neither approach suits every business. Agree the reporting and record-access requirements with the people who actually need the history.</p>
<p>Check whether historical attachments can be downloaded in bulk and whether the old subscription permits access after cancellation. An exported list of invoice numbers is not a usable archive if the underlying documents remain locked away.</p>
<h2>Reconcile at more than one level</h2>
<p>A matching trial balance is necessary, but it does not prove that balances belong to the right customers. Compare control totals, then inspect individual accounts. Include a customer with multiple open invoices, a credit note, a part-payment and a supplier with an outstanding dispute.</p>
<ul><li>Agree the old and new report dates.</li><li>Compare totals before investigating individual differences.</li><li>Trace a sample back to the source documents.</li><li>Record each difference, its owner and the approved correction.</li></ul>
<h2>Rehearse before the real move</h2>
<p>Run a trial import into a test company. Measure how long extraction, cleaning, import and checking take. The exercise may show that the proposed weekend is too short or that a key export needs the old supplier's help. Those are useful findings while you still have time.</p>
<p>Microsoft's <a href="https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/prepare-go-live-checklist">go-live checklist</a> likewise calls for migration validation and cutover sign-off. Apply that discipline even to a much smaller move: name who accepts the result and what evidence they need.</p>
<p>Compare the <a href="/category/accounting-software">accounting software options</a> once you know what must move. Import support and access to history deserve a place beside monthly subscription cost.</p>
`,
  },
  {
    slug: "bank-feed-trial-checklist-south-africa",
    publishedDate: "2025-08-31T00:00:00.000Z",
    title: "How to test a bank feed before moving your bookkeeping",
    excerpt: "A bank logo on a product page is only the beginning. Test your account type, missing transactions, duplicates and recovery during the trial.",
    category: "Accounting",
    author: "Ayesha Daniels",
    content: `
<p>Your bank appears on the accounting software's website. That is encouraging, but it is not a completed test. The question is whether your particular accounts deliver usable transactions consistently, and whether your bookkeeper can tell when they do not.</p>
<p>A short trial with the accounts you intend to use is more informative than a long integration list. Confirm connection requirements with the provider first, and use an authorised account holder for any banking connection. Never hand banking passwords to a salesperson.</p>
<h2>Separate delivery from reconciliation</h2>
<p>The feed brings transaction data into the system. Reconciliation checks it against the accounting records. A feed that delivers every line may still suggest the wrong match, while a clever matching screen cannot fix transactions that never arrived.</p>
<p><a href="https://www.xero.com/za/guides/what-is-bank-reconciliation/">Xero's explanation of bank reconciliation</a> describes the underlying comparison between accounting records and bank statements. Keep both parts visible in your evaluation instead of treating an empty review queue as proof that everything is correct.</p>
<h2>Keep a small observation log</h2>
<p>For several working days, record the latest transaction shown in online banking and the latest one in the accounting package. Note any reconnection prompts and how long it takes to recover. Include the account type, because a current account and a card account are separate tests.</p>
<p>Compare the completed period against a bank statement, not just the balance displayed on a dashboard. Inspect dates, descriptions and amounts. A missing debit and an equally sized missing credit can leave the ending balance unchanged while the transaction history is incomplete.</p>
<h2>Try the transactions your business finds awkward</h2>
<p>Useful examples include a customer payment covering several invoices, a part-payment, an internal transfer and a payment reference that does not identify the customer. Ask the bookkeeper to explain the proposed match before accepting it. Where fees are deducted from a settlement, test how the gross receipt and fee are recorded.</p>
<p>Then inspect the correction path. Can the user undo a mistaken match without creating another unexplained transaction? Is the change visible to the person reviewing the books? Those details matter once the novelty of automated suggestions wears off.</p>
<h2>Agree a fallback before relying on the feed</h2>
<p>Ask how to import a statement file during an outage and how duplicates are prevented when the feed resumes. Test the procedure in a trial or test company with agreed sample data. Keep the import boundary explicit so two people do not fill the same gap.</p>
<p>A sensible acceptance note says which accounts were tested, what period was checked and what remains unresolved. Attach it to your shortlist in the <a href="/category/accounting-software">accounting directory</a>. A supported bank name is a starting point; a reconciled test period is evidence.</p>
`,
  },
  {
    slug: "invoicing-workflow-service-businesses",
    publishedDate: "2026-04-16T00:00:00.000Z",
    title: "From accepted quote to paid invoice: fix the handover first",
    excerpt: "For agencies, consultants and service firms, better invoicing starts with clear approval, delivery evidence and ownership of payment queries.",
    category: "Accounting",
    author: "Sipho Khumalo",
    content: `
<p>The work is finished, but the invoice has not gone out. Someone is checking the purchase order, someone else has the approved quote, and the project manager is waiting for final hours. No invoice template can solve a handover that exists only in people's heads.</p>
<p>For a service business, the useful software test is the whole journey from accepted scope to a payment that can be identified. Start by following one recent job and noting every point where a person had to ask for information already held elsewhere.</p>
<h2>Define what makes a job ready to bill</h2>
<p>A signed quote may be enough for a deposit. A milestone invoice might need written acceptance. Time-based work may require approved hours and an agreed rate. Make those conditions explicit for each kind of job rather than expecting finance to infer them from a message saying "please invoice".</p>
<p>Put the customer billing contact, reference requirements and agreed payment terms in the same handover. An invoice sent to the person who requested the work may still miss the person who can approve payment.</p>
<h2>Keep changes connected to the original scope</h2>
<p>Imagine a design studio whose client adds a second deliverable halfway through a project. This is an illustrative scenario, not a customer case study. If the extra work stays in an email, the project board may show completion while finance bills only the original amount.</p>
<p>Test whether an approved change can be connected to the job, its value and its billing milestone. The important result is that the person preparing the invoice can distinguish agreed extras from work still awaiting approval.</p>
<h2>Use reminders with context</h2>
<p>Automated reminders are useful until they chase an invoice that is disputed or already paid under an unexpected reference. Give somebody responsibility for pausing the reminder and recording why. A customer's reply should not disappear into an unattended mailbox while the next reminder goes out.</p>
<ul><li>Confirm the invoice reached the correct billing contact.</li><li>Record the reason when payment is held.</li><li>Assign the next action and a follow-up date.</li><li>Check incoming payments before sending another chase.</li></ul>
<h2>Measure delays you can actually change</h2>
<p>Track the time between approval to bill and invoice issue separately from the time between issue and payment. The first measure exposes your own handover; the second may involve customer processes and agreed terms. Combining them hides where the work is stuck.</p>
<p>Ask candidates in the <a href="/category/accounting-software">accounting directory</a> to demonstrate a deposit, a scope change and a disputed invoice using your workflow. A <a href="/category/project-management">project tool</a> may help with delivery evidence, but decide which system owns the final invoice before adding an integration.</p>
`,
  },
  {
    slug: "month-end-close-small-team",
    publishedDate: "2025-02-11T00:00:00.000Z",
    title: "A month-end close checklist that a small team can actually use",
    excerpt: "Build a repeatable close around owners, evidence and unresolved items, without turning a two-person finance function into a committee.",
    category: "Accounting",
    author: "Megan Jacobs",
    content: `
<p>A month-end checklist should reduce the number of things finance has to remember. When it becomes a long list of boxes ticked without evidence, it does the opposite: it creates confidence without making the work easier to inspect.</p>
<p>For a small team, the useful version is a short sequence with a named owner, a clear result and a place for exceptions. Ask your accountant which checks your business needs. Then use the software to make those checks repeatable rather than inventing an elaborate process around its dashboard.</p>
<h2>Start with information arriving from outside finance</h2>
<p>Missing supplier documents, unapproved expenses and unconfirmed deliveries can delay everything that follows. List what must arrive, who supplies it and when finance needs it. A reminder aimed at "all staff" is less useful than an outstanding-items list owned by specific people.</p>
<p>Keep late arrivals visible. If a document appears after a report has been reviewed, the reviewer needs to know whether the figures changed. Agree how periods are controlled and who can authorise corrections with the person responsible for the accounts.</p>
<h2>Attach evidence to completion</h2>
<p>"Bank checked" is ambiguous. A stronger entry links to the reconciliation for the relevant account and period, with any outstanding items explained. The same principle applies to customer balances, supplier balances and other schedules included in your close.</p>
<p>Evidence should be easy to locate without giving every colleague access to sensitive records. A task can point an authorised reviewer to the right report while keeping the financial detail inside the accounting system.</p>
<h2>Make unresolved items first-class work</h2>
<p>Give each difference an owner, an explanation and a next action. Separate an understood timing difference from an unexplained amount. Both may be outstanding, but they demand different attention. Avoid using a generic "other" task as a permanent home for questions nobody wants to answer.</p>
<ul><li>What remains unresolved?</li><li>Which report or decision could it affect?</li><li>Who is investigating it?</li><li>When will the reviewer hear back?</li></ul>
<h2>Review before distributing the pack</h2>
<p>Reserve time for the responsible reviewer to inspect unusual movements and ask questions. A checklist completed minutes before a management meeting leaves no room to correct a misunderstanding. Save the reviewed version so later exports do not silently replace the figures people discussed.</p>
<p>After two or three cycles, remove tasks that produce no useful evidence and split tasks that repeatedly hide several days of work. Measure the time spent waiting as well as the time spent processing. Buying a faster capture tool will not resolve a supplier approval that sits unattended all week.</p>
<p>When comparing <a href="/category/accounting-software">accounting systems</a>, ask to see period controls, report access and the route from an exception to its supporting transaction. Those are more useful close features than an attractive summary screen.</p>
`,
  },
  {
    slug: "payroll-parallel-run-checklist",
    publishedDate: "2025-01-13T00:00:00.000Z",
    title: "Before your first payday: how to run a useful payroll parallel test",
    excerpt: "Compare employee results, investigate differences and rehearse approvals before the new payroll system becomes responsible for payday.",
    category: "Payroll",
    author: "Thandiwe Ndlovu",
    image: "payroll-check",
    content: `
<p>A successful payroll import proves that the file was accepted. It does not prove that employees will receive the right amounts. Before switching systems, a parallel run gives your payroll practitioner a controlled way to compare the new output with the approved payroll for the same period.</p>
<p>Set the exercise up as a test. Prevent the test run from issuing payments, sending employee notifications or submitting anything externally. Give one person responsibility for those safeguards so a rehearsal cannot accidentally become a second payday.</p>
<h2>Make the inputs comparable</h2>
<p>Use the same employee population, period and approved inputs in both systems. Record which version of the input file was used. If overtime changes halfway through the exercise, update both sides or record why the results are no longer comparable.</p>
<p>Agree the treatment of balances and employee setup with your payroll practitioner. Software vendors can explain their import fields, but someone accountable for the payroll must approve how your information maps into them.</p>
<h2>Compare individual components</h2>
<p>Start with employee counts and overall totals, then compare earnings, deductions, employer amounts and net pay at employee level. Equal net pay alone can conceal differences between components. Keep a variance log with the old value, new value, reason and approving person.</p>
<p>Include ordinary employees and the awkward cases that exist in your business: a starter, a leaver, variable hours, unpaid time or a corrected prior input. Have the practitioner check the relevant treatment against current requirements rather than copying a historical result simply because it is familiar.</p>
<h2>Rehearse the work around the calculation</h2>
<p>Who approves input changes? Who reviews the final result? Who releases payment? Check that those people can perform their jobs using their own access. A vendor administrator demonstrating every step does not prove the intended separation of responsibilities.</p>
<p>Where a bank payment file is part of your process, confirm the bank's current format and validation procedure. For example, <a href="https://www.sage.com/en-za/sage-business-cloud/payroll/">Sage's South African payroll page</a> describes ACB file export. That is a capability to verify for your proposed product and bank, not a reason to upload a live test payment.</p>
<h2>Define the release decision in advance</h2>
<ul><li>Every employee in scope has been reconciled.</li><li>Each difference has an explanation and approval.</li><li>Access, reports and payment preparation have been rehearsed.</li><li>A responsible person has approved the first live run.</li><li>The team knows when to delay the switch if checks fail.</li></ul>
<p>Leave enough time to correct and repeat the test. A parallel run booked the evening before payday is a deadline, not a control. Bring these requirements to the <a href="/category/payroll-software">payroll shortlist</a> before agreeing the implementation date.</p>
`,
  },
  {
    slug: "payroll-timesheet-cutoff-process",
    publishedDate: "2025-04-13T00:00:00.000Z",
    title: "Late timesheets are a process problem before they are a payroll problem",
    excerpt: "Set up a clear path from captured hours to approved payroll input, with visible exceptions and a workable correction process.",
    category: "Payroll",
    author: "Warren Petersen",
    content: `
<p>The payroll system gets blamed when hours are missing. Sometimes the hours never reached it. A supervisor approved an old spreadsheet, a shift change stayed in a message, or somebody assumed that saving a timesheet also submitted it.</p>
<p>Before replacing software, follow the information from the employee to the final payroll input. Write down where it is captured, who checks it and what tells payroll that it is ready. A simple, visible route often matters more than another reminder notification.</p>
<h2>Separate captured, submitted and approved</h2>
<p>These are different states. Captured hours may still be incomplete. Submitted hours are awaiting a decision. Approved hours are ready for the next step, subject to the payroll team's checks. If the software treats all three as the same thing, build an explicit control around the handover.</p>
<p>Give managers a view of what is missing, rather than asking them to open every employee record. Include the date range and the last change so an old approval cannot be mistaken for the current period.</p>
<h2>Make the cut-off useful to the people doing the work</h2>
<p>Set an internal timetable that leaves room for questions and review before payment preparation. Work back from the payroll team's actual processing needs. Explain what happens when information arrives after the agreed point; a cut-off without a correction route invites quiet workarounds.</p>
<p>Agree late-input handling with the person responsible for payroll and applicable employment obligations. The timetable is an administrative arrangement, not permission to ignore pay that is due. Do not let software defaults make that decision.</p>
<h2>Keep exceptions out of private messages</h2>
<p>A missed clocking, an unusual shift or a changed allocation needs a recorded explanation and an authorised decision. The employee and approver should know where that decision lives. Payroll should not have to reconstruct the story from screenshots supplied by several people.</p>
<ul><li>Identify the employee and affected date.</li><li>Show the original entry and proposed correction.</li><li>Record the reason and approving person.</li><li>Mark whether payroll has received the correction.</li></ul>
<h2>Test the handover, including a correction</h2>
<p>During a trial, export approved hours and check how employee identifiers, earning categories and dates map into payroll. Then correct one approved entry in the test environment. Does the next export contain only the difference, a replacement file or the full period again? Someone must understand that behaviour before using it live.</p>
<p>Track how many entries need manual follow-up each period. If the number stays high, investigate the cause instead of adding another approval layer. Compare <a href="/category/payroll-software">payroll software</a> and <a href="/category/hr-software">HR tools</a> around this complete process so responsibility does not disappear between two products.</p>
`,
  },
  {
    slug: "employee-self-service-rollout",
    publishedDate: "2026-07-25T00:00:00.000Z",
    title: "Employee self-service only works if employees can actually use it",
    excerpt: "Test mobile access, account recovery and manager approvals before launching a portal that sends every question back to HR.",
    category: "HR",
    author: "Zanele Molefe",
    image: "employee-self-service",
    content: `
<p>A portal can move administrative work out of HR's inbox. It can also create a second inbox full of login problems. The difference is usually visible before launch if you test with the people who will use it, on the devices and connections they normally have.</p>
<p>Do not assume that every employee has a company laptop or an individual work email address. For a business with office staff, field teams and shift workers, those assumptions deserve explicit attention during the product trial.</p>
<h2>Choose one useful first task</h2>
<p>Start with a task employees already ask HR to do repeatedly, such as viewing an available document or submitting a leave request. Keep the initial instructions focused on that job. A launch message listing twenty features gives a new user twenty reasons to postpone opening the system.</p>
<p>Test the full route: invitation, sign-in, task completion and confirmation. A request that disappears without a visible status may simply produce a follow-up phone call.</p>
<h2>Try account recovery before the first lockout</h2>
<p>Ask what happens when a phone is replaced, an email address changes or an employee forgets a password. Check who can help and how identity is verified. Shared accounts may look convenient on a shared device, but they remove clarity about who viewed or changed a record.</p>
<p>Use individual access and test sign-out behaviour. Sensitive employee information should not remain available to the next person who picks up the device. Confirm the proposed configuration with the people responsible for information security.</p>
<h2>Make the manager's half of the workflow work</h2>
<p>A leave request does not become self-service just because the employee can submit it. The right manager must receive it, see enough context to decide and return a clear result. Test delegation when that manager is away and reassignment when reporting lines change.</p>
<p>Keep payroll responsibilities separate from approval convenience. Confirm how an approved change reaches any downstream system, who checks it and what happens when the connection fails. A green status in HR is not proof of a successful update elsewhere.</p>
<h2>Measure completed work, not registrations</h2>
<ul><li>Can employees complete the first task without assistance?</li><li>How many requests need HR to intervene?</li><li>How long do requests wait for a manager?</li><li>Can users recover access through the agreed route?</li></ul>
<p>Pilot with a small mix of roles and working conditions, then correct the common points of confusion. Keep a supported alternative for people who cannot use the portal while you resolve access barriers. Compare <a href="/category/hr-software">HR software</a> using successful task completion as your benchmark, rather than the number of features visible in the employee menu.</p>
`,
  },
  {
    slug: "employee-onboarding-workflow-small-business",
    publishedDate: "2025-07-18T00:00:00.000Z",
    title: "Build an onboarding checklist that reaches beyond HR",
    excerpt: "Connect people, equipment, access and first-week responsibilities so a new starter does not spend Monday waiting for everyone else.",
    category: "HR",
    author: "Fatima Essop",
    content: `
<p>HR marks the new starter as ready. The manager assumes IT has been told. IT is waiting for an equipment request, and nobody has decided which systems the employee needs. Each department has completed its own small process, but the person cannot begin work.</p>
<p>An onboarding checklist is useful when it connects those dependencies. The right software should show what is blocked, who can resolve it and what has to happen before the start date. A longer checklist is not automatically a better one.</p>
<h2>Work backwards from the first useful day</h2>
<p>Describe what the starter should be able to do by the end of day one. That might include meeting the manager, accessing the relevant workspace and understanding the first assignment. Work backwards to the equipment, accounts, information and approvals needed to make that possible.</p>
<p>Give each item one accountable owner. "IT and HR" leaves room for both teams to wait. If two teams must contribute, split the item into a request and a completed action with a clear handover.</p>
<h2>Use role templates with deliberate exceptions</h2>
<p>A warehouse starter and a finance starter do not need identical access. Build a small number of templates around actual roles, then require approval for additions. Copying the previous employee's permissions is easy, but it can carry forward access that no longer belongs with the job.</p>
<p>Collect only the information required for the relevant step and restrict who can see it. A general project board should not become an open store for identity documents or sensitive employee details simply because attachments are convenient.</p>
<h2>Include the manager's work</h2>
<p>Equipment and forms are only the preparation. The manager still needs to set expectations, arrange introductions and choose a manageable first assignment. Give those tasks dates and outcomes just as you would a laptop request.</p>
<p>Ask the starter to confirm that access works. An administrator ticking "account created" is different from a person successfully signing in and finding the right information. Keep that confirmation small and specific rather than sending another broad survey.</p>
<h2>Rehearse a changed start date</h2>
<p>Move a test employee's start date and inspect the consequences. Do reminders move? Are equipment requests updated? What happens to accounts already prepared? Then test a cancelled start so nobody relies on a memory of which tasks need reversing.</p>
<ul><li>Every dependency has an owner.</li><li>Restricted information stays in the appropriate system.</li><li>The manager has a first-week plan.</li><li>Date changes reach everyone affected.</li><li>The starter confirms the essentials work.</li></ul>
<p>Bring this sequence to your <a href="/category/hr-software">HR software trial</a>. If a separate <a href="/category/project-management">task tool</a> carries the operational checklist, decide where the authoritative start date lives and who keeps the two systems aligned.</p>
`,
  },
  {
    slug: "hr-payroll-integration-ownership",
    publishedDate: "2026-06-12T00:00:00.000Z",
    title: "HR and payroll integration: decide who owns each field",
    excerpt: "An integration needs rules for effective dates, approvals and failed updates. Start with field ownership before connecting the systems.",
    category: "HR",
    author: "Johan Smit",
    content: `
<p>Connecting HR to payroll sounds like a straightforward way to remove duplicate entry. It becomes less straightforward when an employee changes a detail in one system and an administrator changes it in the other. Which value wins, and who notices?</p>
<p>The answer belongs in the implementation plan. An integration moves information according to rules. It cannot decide the right business rule merely because both products offer an API.</p>
<h2>Make a field ownership list</h2>
<p>For each field in scope, record the system where an approved change starts, the person permitted to make it and the system that receives it. Include employee identifiers, reporting lines and the pay-related fields your practitioner approves for transfer.</p>
<p>Do not assume that all employee information should move. A receiving system may not need a field, or the field may carry restrictions that make a broader copy inappropriate. Keeping the scope small also makes reconciliation easier.</p>
<h2>Separate approval date from effective date</h2>
<p>A change approved today may apply next month. Test whether the integration preserves that distinction. Include a future change, a correction and two changes entered in the wrong order. Ask the implementer to show the receiving record and any history, rather than just the successful transfer message.</p>
<p>Agree how the payroll cut-off affects pending changes with the responsible payroll practitioner. A technically successful update can still arrive too late for the intended processing cycle.</p>
<h2>Design for rejected updates</h2>
<p>Suppose a department code exists in HR but not in payroll. This is an illustrative failure to include in the test. Does the record stop, partly update or silently substitute a value? Who receives the alert, and what information lets them repair it?</p>
<p>Make someone responsible for monitoring failures. A shared mailbox with no named owner is not a support process. After correcting the problem, check whether retrying can duplicate a record or overwrite a newer change.</p>
<h2>Reconcile after the connection goes live</h2>
<ul><li>Compare the number of expected and received changes.</li><li>Inspect rejected and waiting records.</li><li>Sample the important fields in the receiving system.</li><li>Record corrections and the person who approved them.</li></ul>
<p>Plan how you will detect a connection that stops sending anything at all. No error messages can mean no failures, but it can also mean no activity. A scheduled review of expected changes helps distinguish the two.</p>
<p>When comparing <a href="/category/hr-software">HR</a> and <a href="/category/payroll-software">payroll products</a>, request the connector's scope, support owner and failure-handling procedure in writing. The useful question is not just whether the systems connect. It is whether your team can explain and verify what crossed between them.</p>
`,
  },
  {
    slug: "crm-pipeline-stages-small-sales-team",
    publishedDate: "2025-11-13T00:00:00.000Z",
    title: "Your CRM pipeline needs evidence, not optimistic stage names",
    excerpt: "Build sales stages around observable customer progress so the pipeline tells your team what to do next and where deals are really stuck.",
    category: "CRM",
    author: "Kabelo Maseko",
    image: "crm-pipeline",
    content: `
<p>A deal labelled "hot" says something about the salesperson's confidence. It says much less about what the customer has agreed to do. When each person uses a different definition, the pipeline becomes a collection of opinions presented as a report.</p>
<p>A small sales team does not need a complicated methodology to improve this. It needs a few stages with clear entry conditions and a visible next action. Configure those before building the dashboard.</p>
<h2>Name the customer event behind each stage</h2>
<p>For every stage, finish the sentence: "We can put an opportunity here when..." A discovery stage might require an agreed conversation about the need. A proposal stage might require a proposal delivered to the relevant contact. Choose definitions that match your sales process and can be checked.</p>
<p>Do not move deals forward simply because a week has passed or an email was sent. Activity is useful context, but it is not always evidence of progress. Keep the distinction visible in the opportunity record.</p>
<h2>Give every open deal a next action</h2>
<p>Record what happens next, who owns it and when it should happen. "Follow up" is vague; "confirm who approves the proposal with the operations contact on Thursday" is useful. The CRM should make missing and overdue actions easy to find.</p>
<p>For an illustrative example, consider a small equipment supplier with several quotes awaiting customer decisions. A single "quoted" column hides the difference between a scheduled review meeting and a quote sent weeks ago without a response. The next-action field exposes that difference without needing six more stages.</p>
<h2>Decide when a deal leaves the active pipeline</h2>
<p>Create an agreed route for lost, postponed and unsuitable opportunities. Do not leave old deals open merely to keep the total looking healthy. Capture a concise reason that is useful later, and distinguish a customer decision from a salesperson's inability to reach the contact.</p>
<p>A postponed deal can have a future review date without being treated as imminent revenue. Make that choice explicit in reports rather than hiding it in free-text notes.</p>
<h2>Keep the first review narrow</h2>
<ul><li>Which opportunities have no next action?</li><li>Which have stayed in one stage unusually long?</li><li>Which expected dates have moved repeatedly?</li><li>What evidence supports the largest opportunities?</li></ul>
<p>Discuss those questions with the team and refine definitions that cause disagreement. Avoid introducing a new mandatory field for every exception; require information only when somebody uses it to make a decision.</p>
<p>Compare <a href="/category/crm-software">CRM software</a> by asking a normal salesperson to update a deal and a manager to find the exceptions. A pipeline earns its place when it changes the next conversation, not when every card has an attractive colour.</p>
`,
  },
  {
    slug: "clean-crm-data-before-import",
    publishedDate: "2026-07-08T00:00:00.000Z",
    title: "Clean your customer spreadsheet before it becomes your CRM",
    excerpt: "Decide what a customer record represents, preserve ownership and review duplicates before an import turns old confusion into a shared problem.",
    category: "CRM",
    author: "Nadia Davids",
    content: `
<p>A spreadsheet can hide contradictions because each salesperson understands their own rows. A CRM makes those rows shared. Suddenly three spellings of the same company look like three customers, and a note saying "call Sam" is available to a colleague who has never met Sam.</p>
<p>The best time to resolve this is before importing. Keep an untouched source copy, work on a separate file and record decisions that affect ownership or customer history. Cleaning data should not mean quietly deleting information someone still needs.</p>
<h2>Decide what each row represents</h2>
<p>Separate organisations, individual contacts and sales opportunities. One business can have several contacts and several opportunities. If the source file uses one row for all three, decide how those relationships will map into the receiving system.</p>
<p>Test a company with two branches and a contact associated with more than one opportunity. These ordinary cases reveal whether the proposed structure will support your reporting or force users to copy the same information repeatedly.</p>
<h2>Use duplicate suggestions as a review queue</h2>
<p>Matching names or phone numbers can help find possible duplicates, but they do not prove two records are the same. Shared switchboards, generic email addresses and similar business names deserve a human check before merging.</p>
<p><a href="https://trailhead.salesforce.com/content/learn/modules/sales_admin_duplicate_management/sales_admin_duplicate_management_unit_2">Salesforce's duplicate-management guidance</a> describes using matching and duplicate rules to identify or prevent duplicate records. During your trial, check the rules available in the specific product and plan, including what happens when a legitimate record resembles an existing one.</p>
<h2>Preserve the fields that explain the relationship</h2>
<p>Ownership, source and the next agreed action can be more useful than a large collection of optional profile fields. Keep the information your team needs to understand why the record exists. Do not treat an old contact list as evidence that everyone on it should receive marketing messages.</p>
<p>Ask the people responsible for your information practices which records and permissions belong in the import. This is particularly important when combining lists that were collected for different purposes.</p>
<h2>Import a representative sample first</h2>
<ul><li>Include multiple contacts at one organisation.</li><li>Include missing optional values and accented names.</li><li>Check dates, telephone formatting and record ownership.</li><li>Verify relationships and notes in the actual interface.</li><li>Check how to reverse or correct the test import.</li></ul>
<p>Compare accepted and rejected row counts, then inspect records individually. A successful upload message can coexist with a badly mapped field. Save the final mapping alongside the cleaned file so the full import follows the same rules.</p>
<p>Use the <a href="/category/crm-software">CRM directory</a> to compare tools after you understand your data. A product that makes a small, controlled import easy is a better starting point than one that promises to sort out everything after the upload.</p>
`,
  },
  {
    slug: "crm-follow-up-without-spam",
    publishedDate: "2025-02-02T00:00:00.000Z",
    title: "Better sales follow-up starts with a useful next step",
    excerpt: "Use CRM reminders to honour customer conversations, reduce duplicate contact and make stalled opportunities visible without flooding inboxes.",
    category: "CRM",
    author: "Theo Mthembu",
    content: `
<p>A reminder to contact a prospect is easy to automate. A reason for contacting them is harder. When the CRM generates activity without preserving the conversation, the customer receives another "just checking in" and the salesperson records another completed task.</p>
<p>Start with the next step the customer and salesperson actually discussed. Automation should help the team remember and prepare for that step. It should not decide that every silent contact needs an endless sequence.</p>
<h2>Store the reason beside the reminder</h2>
<p>A useful task says what the customer needs and what the salesperson will bring. That might be a revised scope, an answer about implementation or a proposal review. Give it a date and an owner so another colleague can pick it up when necessary.</p>
<p>Keep the last meaningful interaction close to the task. A user should not need to search several disconnected notes to discover that the customer asked to wait until a later budget meeting.</p>
<h2>Prevent two people from doing the same follow-up</h2>
<p>Assign responsibility at the opportunity level and agree when another person may contact the customer. Test reassignment when someone is absent. If the old owner's automated sequence continues after reassignment, the team can create duplicate contact while the CRM appears perfectly organised.</p>
<p>Use a test contact to inspect what pauses a sequence: a reply, a changed stage, a completed sale or a manual decision. Do not assume the trigger exists merely because the product offers automation.</p>
<h2>Separate sales tasks from marketing permissions</h2>
<p>A record in a CRM is not by itself a reason to include that person in a marketing campaign. Keep communication preferences and the reason for holding the information visible to the people who need them. Have the responsible person confirm the rules for your channels and circumstances before enabling bulk messages.</p>
<p>You can still improve follow-up without sending anything automatically. A daily queue of agreed actions, missing owners and overdue responses gives a small team a practical starting point.</p>
<h2>Review outcomes instead of task volume</h2>
<ul><li>Did the promised information reach the customer?</li><li>Was the next conversation agreed?</li><li>Does the opportunity now have a clearer decision date?</li><li>Should the team stop or postpone contact?</li></ul>
<p>Look at a few completed tasks together each week. If a task was closed without changing anything, decide whether it was useful. Avoid rewarding a high count of calls or emails while ignoring the quality of the conversation.</p>
<p>In your <a href="/category/crm-software">CRM trial</a>, demonstrate one realistic follow-up, one reassignment and one stopped sequence. The right configuration should make the team more dependable to customers and make unnecessary contact easier to prevent.</p>
`,
  },
  {
    slug: "erp-readiness-growing-business",
    publishedDate: "2025-10-28T00:00:00.000Z",
    title: "Do you need an ERP, or do your existing systems need clearer rules?",
    excerpt: "Separate problems caused by disconnected data from problems caused by unclear processes before committing to a larger business system.",
    category: "ERP",
    author: "Chantal Adams",
    image: "erp-readiness",
    content: `
<p>Orders live in one system, stock in another and finance in a third. The monthly reconciliation takes too long. An ERP may help, but a broader platform will still need people to agree what an order means, who can change it and when stock movements are recorded.</p>
<p><a href="https://www.microsoft.com/en/dynamics-365/resources/what-is-erp">Microsoft describes ERP</a> as software connecting core business processes and data. The buying question is which connections your business needs, and whether the value of those connections justifies the implementation work.</p>
<h2>Trace one transaction across the business</h2>
<p>Follow a customer order from acceptance through fulfilment, invoicing and reporting. Note where information is re-entered, where teams use different identifiers and where a decision waits for another department. Use a real process with anonymised data, not an ideal process nobody follows.</p>
<p>Classify each problem. Duplicate entry between systems is a connection problem. An order waiting because nobody has authority to approve a discount is an ownership problem. Both matter, but they need different remedies.</p>
<h2>Test a smaller intervention on paper</h2>
<p>Could a defined handover, a corrected product catalogue or one supported integration remove most of the friction? Work through that option honestly. It may solve enough to postpone a larger project, or it may reveal that the same data must be reconciled in too many places.</p>
<p>A smaller intervention is not automatically cheaper once ongoing support and manual checking are included. Compare the complete work involved in keeping it reliable, rather than only the connector subscription.</p>
<h2>Check whether the business can support the project</h2>
<p>ERP selection needs time from finance, operations and the people responsible for data. Name process owners before appointing a supplier. If nobody can approve the item structure or customer master, the project will wait for those decisions regardless of the software chosen.</p>
<ul><li>Who decides the standard process?</li><li>Who cleans and approves source data?</li><li>Who tests the end-to-end transaction?</li><li>Who trains users and supports the first live period?</li></ul>
<h2>Describe the outcome in operational terms</h2>
<p>Replace "one source of truth" with a result you can inspect: an accepted order appears once, its fulfilment status is visible, and finance can trace the invoice to what was delivered. Add the exceptional case, such as a partial delivery or return, because that is where disconnected processes often become expensive.</p>
<p>Take the resulting script to the <a href="/category/erp-software">ERP directory</a>. Request a phased scope with explicit acceptance criteria. A broader system earns its place when it removes verified operational friction, not merely when the business has reached an arbitrary employee count.</p>
`,
  },
  {
    slug: "inventory-demo-tests-distributors",
    publishedDate: "2026-08-11T00:00:00.000Z",
    title: "Five inventory scenarios to put in your ERP demonstration",
    excerpt: "Ask a distributor's awkward questions: partial receipts, split deliveries, returns, stock adjustments and what is genuinely available to sell.",
    category: "ERP",
    author: "Bongani Nkosi",
    content: `
<p>A stock screen showing a neat quantity beside each item is the easy part of an inventory demonstration. A distributor needs to know how that quantity changes when a supplier delivers short, a customer returns goods or two salespeople promise the same remaining units.</p>
<p>Build the demo around those events. Use a small set of sample items and locations so everyone can follow the movement. Ask the presenter to show the operational record and the related reporting after each step.</p>
<h2>1. A supplier delivers only part of the order</h2>
<p>Receive fewer units than ordered. Check what remains open, how the expected balance is shown and who can close the remainder if it will not arrive. Then inspect what information reaches finance when the supplier's invoice differs from the receipt.</p>
<p>The test is not whether the system allows a quantity field to be edited. It is whether a buyer can still see what is outstanding without rebuilding the order history manually.</p>
<h2>2. A customer order leaves in two deliveries</h2>
<p>Reserve stock, dispatch part of it and complete the balance later. Ask which quantities are on hand, reserved and available. Include two users working on different orders to expose how the system handles competing demand.</p>
<p>Record the meaning of each stock label. If the warehouse and sales team interpret "available" differently, the display can be correct and the customer promise can still be wrong.</p>
<h2>3. A return must be inspected</h2>
<p>Receive a returned item that should not immediately go back on sale. Follow its movement into an inspection or holding process, then test release or rejection. Ask how the return connects to the original delivery and any finance action that your process requires.</p>
<p>A return that increases saleable stock before inspection is complete can undermine a carefully designed fulfilment workflow.</p>
<h2>4. A count finds a difference</h2>
<p>Enter a stock-count difference in the trial. Check who can approve the adjustment, what reason is recorded and whether the original count remains visible. Have your finance lead inspect the reporting consequences rather than relying on a generic promise that inventory and accounting are integrated.</p>
<h2>5. A manager asks what can ship today</h2>
<p>Finish with a report of orders that can be fulfilled, including stock held in different locations and quantities awaiting inspection. Trace one number back to its movements. If the answer requires several exports, record the ongoing work that would fall to your team.</p>
<p>Score these scenarios consistently across the <a href="/category/erp-software">ERP shortlist</a>. Add batch, serial-number or expiry tests only if your business needs them. A compact script reflecting your actual operation is more useful than an exhaustive feature checklist nobody can validate.</p>
`,
  },
  {
    slug: "erp-implementation-partner-questions",
    publishedDate: "2025-09-01T00:00:00.000Z",
    title: "The ERP partner interview: questions that belong before the proposal",
    excerpt: "Clarify who will do the work, how changes are priced and what counts as acceptance before a promising workshop becomes an open-ended project.",
    category: "ERP",
    author: "Anika Bothma",
    content: `
<p>You can choose suitable software and still have a difficult implementation. The product demonstration shows what the platform can do. The partner conversation needs to establish who will configure it, how decisions will be made and what happens when a requirement turns out to be harder than expected.</p>
<p>Ask these questions before comparing proposal totals. Otherwise, the lowest figure may simply contain fewer responsibilities, less testing or more assumptions about work your own team will perform.</p>
<h2>Who will actually be on the project?</h2>
<p>Ask to meet the proposed delivery lead and the people responsible for the important workstreams. Establish their availability, where responsibilities overlap and who takes over during absence. A strong sales relationship is helpful, but it does not tell you whether the implementation team has time for your project.</p>
<p>Request references for comparable processes and scope. A large brand name is less informative than a customer who can explain how the partner handled a difficult data decision or a delayed test cycle. Seek permission before contacting references and keep the conversation specific.</p>
<h2>What is included in migration and testing?</h2>
<p>Separate extraction, cleaning, mapping, import and reconciliation. Ask who owns each step and which source systems are covered. "Data migration included" can mean a single import of a file you must prepare yourself.</p>
<p>For testing, ask which end-to-end scenarios are planned, who supplies sample data and who signs off. Include a failed or reversed transaction, not just the successful path. Microsoft's <a href="https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/prepare-go-live-checklist">go-live guidance</a> includes testing, cutover readiness and approval; ask the partner to turn those concepts into named project tasks.</p>
<h2>How does a change become an approved cost?</h2>
<p>Ask for the process used when a workshop uncovers something outside scope. You need the proposed change, its effect on cost and timing, and an approval point before work begins. Keep an agreed decision log so an informal conversation does not become a disputed instruction later.</p>
<p>Also ask which configuration choices create ongoing maintenance or upgrade work. A workaround may be reasonable, but somebody should explain who will support it after the initial team leaves.</p>
<h2>What happens after the first live day?</h2>
<ul><li>Who receives urgent operational issues?</li><li>Which support hours cover your business day?</li><li>How are product defects distinguished from configuration issues?</li><li>When does project support end and the ongoing arrangement begin?</li></ul>
<p>Request a written scope with assumptions and acceptance criteria before committing. Compare the <a href="/category/erp-software">software options</a> and the delivery arrangements as related decisions. A credible partner should be able to explain both the promised outcome and the work your team must contribute to reach it.</p>
`,
  },
  {
    slug: "project-board-too-many-tasks",
    publishedDate: "2026-07-16T00:00:00.000Z",
    title: "Your project board is full. Why is nothing finishing?",
    excerpt: "Make blocked work, competing priorities and completion criteria visible before adding another dashboard to an overloaded team.",
    category: "Project management",
    author: "Sizwe Dube",
    content: `
<p>A busy board can make a team look productive while making delivery harder to understand. Every card has an owner, many cards are in progress and the weekly meeting is spent explaining why the same items are still there.</p>
<p>Before changing tools, inspect the work that is already open. The board may be describing demand accurately while hiding the decisions needed to finish anything.</p>
<h2>Give "in progress" a real meaning</h2>
<p>Use the status for work somebody is actively advancing, not every task they intend to start. Separate queued work from started work so the team can see its commitments. Then agree how much simultaneous work is sensible for the roles involved.</p>
<p>There is no universal number that suits every team. A useful starting point is to review the current load and ask which items could finish sooner if fewer new ones were started. Make the trade-off visible to the person setting priorities.</p>
<h2>Show why a blocked task is blocked</h2>
<p>Record the dependency, the person who can resolve it and the next review date. "Waiting" is not enough. A task waiting for a client's approval needs a different response from one waiting for an internal design decision.</p>
<p><a href="https://www.atlassian.com/agile/project-management/project-management-dependencies">Atlassian's guide to project dependencies</a> explains how relationships between tasks affect sequencing and timelines. In your board, the practical test is whether users can find the upstream work that prevents a task from moving.</p>
<h2>Agree what completion includes</h2>
<p>A document may be drafted but not reviewed. A customer change may be built but not accepted. Decide which result closes the task and whether the next step needs a separate owner. Otherwise, a card moves to done while the unfinished work reappears as a message or an untracked favour.</p>
<p>Keep completion criteria proportionate. A small internal update does not need the same approval path as a client deliverable. The aim is clarity, not more ceremony.</p>
<h2>Run the meeting around decisions</h2>
<ul><li>What can the team finish next?</li><li>Which blocker needs a decision from someone present?</li><li>What new request would displace an existing commitment?</li><li>Which item should be stopped or returned to the queue?</li></ul>
<p>Use written updates for information that does not require discussion. Spend the shared time resolving conflicts the board cannot resolve itself. After a few cycles, review whether work is finishing more predictably, rather than celebrating an increase in the number of cards created.</p>
<p>When comparing <a href="/category/project-management">project management software</a>, test filtering blocked work, recording dependencies and changing priorities. The right board should make difficult choices easier to see, not simply give an overloaded team a more colourful list.</p>
`,
  },
  {
    slug: "agency-capacity-planning-without-guesswork",
    publishedDate: "2025-05-02T00:00:00.000Z",
    title: "Plan agency capacity around available time, not a perfect week",
    excerpt: "Account for meetings, support and review work before promising delivery dates, then use a small capacity check to expose the bottleneck.",
    category: "Project management",
    author: "Rachel September",
    content: `
<p>A designer has a five-day working week. That does not mean five days are available for the new client project. Reviews, internal meetings, existing commitments and urgent support already occupy part of it. A plan that ignores them is overcommitted before the work begins.</p>
<p>Capacity planning does not require a complicated model. It needs an honest picture of available time, the roles each job requires and the decisions you will make when demand exceeds that time.</p>
<h2>Start with availability by role</h2>
<p>Record working time, planned absence and known recurring commitments. Keep people separate where skills are not interchangeable. Ten spare hours in copywriting do not remove a ten-hour design bottleneck.</p>
<p><a href="https://www.atlassian.com/work-management/project-management/resource-management/tracking">Atlassian's resource-tracking guide</a> discusses visibility into allocation and capacity. Your first useful output can be a simple weekly view that shows where a particular role is overcommitted.</p>
<h2>Include the work between the deliverables</h2>
<p>Estimating only production leaves out briefing, review, revision and handover. Break large deliverables into enough detail to identify who is needed and when, without pretending to know every hour months in advance.</p>
<p>For an illustrative calculation, suppose a team member has 40 working hours, with 8 reserved for known meetings and administration and 6 for existing support commitments. That leaves 26 hours before any additional contingency. These are sample inputs, not an industry utilisation benchmark. Use your team's actual pattern.</p>
<h2>Show assumptions beside the date</h2>
<p>A delivery date may depend on the client returning feedback by Tuesday. Record that dependency with the plan. If feedback arrives on Friday, the team needs a scheduling decision rather than an unspoken expectation that the lost time will be absorbed.</p>
<p>Distinguish work that can move from work tied to an external event. This helps the account lead discuss options with the client: reduce scope, move the date or arrange additional capacity where practical.</p>
<h2>Review the near term regularly</h2>
<ul><li>Which role has more committed work than available time?</li><li>Which estimate changed enough to affect another job?</li><li>Which client decision is holding a reserved slot?</li><li>What should be rescheduled before a deadline is missed?</li></ul>
<p>Compare planned and actual effort to improve future estimates, not to penalise people for raising uncertainty. If every task lands exactly on its estimate, check whether the recording process is hiding the real work.</p>
<p>Try these questions in the <a href="/category/project-management">project management shortlist</a>. A useful capacity view lets the person making a promise see the trade-off before the promise reaches the client.</p>
`,
  },
  {
    slug: "software-subscription-audit-small-business",
    publishedDate: "2025-12-17T00:00:00.000Z",
    title: "The software subscription audit: find overlap before cutting useful tools",
    excerpt: "Map owners, users and dependencies across your subscriptions so the next renewal decision is based on use and replacement effort.",
    category: "Buying advice",
    author: "Imran Osman",
    content: `
<p>The subscription list often grows one sensible decision at a time. Sales needs a form builder. Operations adds a scheduling tool. Finance starts paying for another file-sharing service because a supplier prefers it. Months later, nobody has a complete view of what the business relies on.</p>
<p>An audit should produce that view before it produces cancellations. Low usage can indicate waste, but it can also describe a tool that performs one essential task every quarter. Start by finding the owner and purpose of each subscription.</p>
<h2>Build an inventory people can verify</h2>
<p>Use invoices and the appropriate administrative records to identify products, billing frequency, renewal dates and the responsible team. Ask owners to confirm the plan, active users and the job the tool performs. Keep credentials out of the audit file.</p>
<p>Record whether quoted and billed amounts use the same currency and tax basis. For international subscriptions, keep the original invoice amount beside the rand amount actually paid. Avoid comparing figures that describe different periods or different inclusions.</p>
<h2>Look for duplicated jobs</h2>
<p>Two tools with similar feature lists are not necessarily interchangeable. One may support an external customer workflow that the other cannot. Ask teams to demonstrate the overlapping job and identify what would change if it moved.</p>
<p>Likewise, a feature already included in a larger suite may still require configuration, training or a higher access level. The relevant comparison is the effort to perform the job reliably, not the number of ticks in a vendor table.</p>
<h2>Check dependencies before removing a licence</h2>
<p>An apparently inactive account may own shared documents, scheduled exports or an integration. Establish how ownership transfers and which records must remain accessible. Ask the product owner to confirm the retirement steps in the application's current documentation.</p>
<ul><li>Who owns the data and shared work?</li><li>Which integrations or scheduled jobs depend on it?</li><li>Can the required records be exported and reopened?</li><li>Who confirms that the replacement works?</li></ul>
<h2>Turn findings into renewal decisions</h2>
<p>Group the outcomes into retain, resize, consolidate and investigate. Give each proposed change an owner and a date before the renewal window. Keep uncertain cases visible rather than counting hypothetical savings as completed work.</p>
<p>Use a short pilot before consolidating a widely used tool. Track whether people can still complete the important tasks and whether support effort increases. A smaller invoice is not the whole result if the team now spends hours rebuilding the missing workflow.</p>
<p>The <a href="/software">Indaba directory</a> can help structure replacement comparisons. Use it after the audit has identified the actual job and the constraints a replacement must meet.</p>
`,
  },
  {
    slug: "software-exit-plan-before-signing",
    publishedDate: "2025-04-15T00:00:00.000Z",
    title: "Write your software exit plan before you need it",
    excerpt: "Test exports, document ownership and the steps required to leave a platform while the supplier still has every reason to answer your questions.",
    category: "Buying advice",
    author: "Palesa Radebe",
    content: `
<p>Buying software is easier when the team is excited about what comes next. That is also the right time to ask how you would leave. An exit plan helps you understand whether important records, attachments and working processes can survive the end of the subscription.</p>
<p>You do not need to predict a future replacement. You need to know what the business would have to recover, how it could recover it and who would be responsible.</p>
<h2>Define a useful export</h2>
<p>A download button is not enough. Identify the records you need, the relationships between them and the supporting attachments. A customer export without its linked activity history may be useful as a contact list while being inadequate as a working archive.</p>
<p>During the trial, export a small set of connected sample records. Open the files in ordinary tools and check dates, identifiers, text and relationships. If attachments download separately, establish how they can be matched back to the correct records.</p>
<h2>Ask what happens after cancellation</h2>
<p>Request the current terms for notice, access, export assistance and deletion. Clarify which actions must happen before the subscription ends and whether a restricted access option exists. Record the supplier's answer and the relevant agreement rather than relying on a sales conversation.</p>
<p>Have the appropriate person review contractual and record-keeping requirements for your business. The operational checklist cannot determine those obligations, but it can expose questions that need a definite answer before purchase.</p>
<h2>Keep business ownership separate from one employee's login</h2>
<p>Name an accountable administrator and an approved recovery route. Identify who owns shared files, automations and integrations. Test transfer of ownership in a safe environment so a departure does not leave essential work attached to an inaccessible personal account.</p>
<p>Keep a concise system record covering owners, connected applications, export instructions and the location of relevant agreements. Store it where authorised colleagues can find it without exposing passwords or unnecessary personal information.</p>
<h2>Plan the handover between systems</h2>
<ul><li>Agree when users stop entering new information in the old system.</li><li>Take the final export and check its completeness.</li><li>Reconcile important records in the replacement.</li><li>Confirm how authorised users will access required history.</li><li>Close old integrations and access through an approved process.</li></ul>
<p>Practise the export again when the product or your usage changes materially. A test performed before the business added attachments or another module may no longer cover what you need.</p>
<p>Bring these questions to your <a href="/blog/software-demo-scorecard-south-africa">software demonstration</a> and compare the answers alongside features. A supplier that can explain a workable exit gives you better information about the commitment you are making today.</p>
`,
  },
];

export const ADDITIONAL_ARTICLE_SEEDS: ArticleSeed[] = guides.map((guide) => ({
  id: `art-${guide.slug}`,
  slug: guide.slug,
  title: guide.title,
  excerpt: guide.excerpt,
  content: guide.content.trim(),
  category_tag: guide.category,
  author_name: guide.author,
  author_title: "Editorial contributor",
  author_bio: `${guide.author} is an editorial pen name used for Indaba's practical business software guides.`,
  author_avatar_url: null,
  featured_image_url: guide.image ? `/blog/${guide.image}.svg` : null,
  related_software_id: null,
  meta_title: guide.title,
  meta_description: guide.excerpt,
  read_time_minutes: Math.max(1, Math.ceil(guide.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length / 220)),
  status: "published",
  featured: Boolean(guide.image),
  published_date: guide.publishedDate,
}));
