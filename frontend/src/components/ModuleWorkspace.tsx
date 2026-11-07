import { useState, type ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, CircleHelp, Download, Filter, MoreHorizontal, Plus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, Button, Card } from './ui'
import { moduleIcons, moduleRows, navigationItems, pageMeta } from '../data'
import { useAppContext } from '../app-context'

type ModuleRow = Record<string, string>
type ModalMode = 'create' | 'filters' | 'detail' | null

export function ModuleWorkspace({ path }: { path: string }) {
  const meta = pageMeta[path]
  const Icon = moduleIcons[path]
  const rows = moduleRows[path] ?? []
  const { can } = useAppContext()
  const permission = navigationItems.find((item) => item.href === path)?.permission
  const [modal, setModal] = useState<ModalMode>(null)
  const [selectedRow, setSelectedRow] = useState<ModuleRow | null>(null)

  if (permission && !can(permission)) return <PermissionEmpty />

  const openDetails = (row: ModuleRow) => {
    setSelectedRow(row)
    setModal('detail')
  }

  return <>
    <div className="module-toolbar">
      <div className="toolbar-search"><Search size={16} /><input placeholder={`Search ${meta.title.toLowerCase()}`} aria-label={`Search ${meta.title}`} /></div>
      <div className="toolbar-actions">
        <Button variant="outline" size="sm" onClick={() => setModal('filters')}><Filter size={15} /> Filters</Button>
        <Button size="sm" onClick={() => toast.success(`${meta.title} export queued.`)}><Download size={15} /> Export</Button>
        <Button size="sm" onClick={() => setModal('create')}><Plus size={15} /> New record</Button>
      </div>
    </div>
    <div className="module-kpi-strip">
      <ModuleKpi label="Total records" value={`${rows.length * 126 + 238}`} detail="Across current workspace" />
      <ModuleKpi label="Needs attention" value={`${Math.max(3, rows.length + 1)}`} detail="Requires a follow-up" tone="warning" />
      <ModuleKpi label="Updated today" value={`${rows.length * 18 + 42}`} detail="Fresh activity" tone="success" />
      <ModuleKpi label="Active cycle" value="2025" detail="Semester II" tone="info" />
    </div>
    <Card className="module-table-card">
      <div className="table-card-head"><div className="module-title"><div className="module-title-icon"><Icon size={19} /></div><div><h2>{meta.title}</h2><p>{rows.length * 126 + 238} records in this view</p></div></div><button className="card-menu" aria-label="More options" onClick={() => setModal('filters')}><MoreHorizontal size={18} /></button></div>
      <div className="table-responsive"><table className="data-table"><thead><tr>{Object.keys(rows[0] ?? {}).map((header) => <th key={header}>{header === 'reference' ? 'Reference' : header[0].toUpperCase() + header.slice(1)}</th>)}<th aria-label="Actions" /></tr></thead><tbody>{rows.map((row) => <tr key={row.reference}>{Object.entries(row).map(([key, value]) => <td key={key}>{key === 'status' ? <StatusBadge status={value} /> : key === 'applicant' ? <div className="table-person"><span className="table-avatar">{value.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><strong>{value}</strong></div> : <span className={key === 'reference' ? 'reference-code' : ''}>{value}</span>}</td>)}<td><button className="row-more" aria-label={`Open details for ${row.reference}`} onClick={() => openDetails(row)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      <div className="table-footer"><span>Showing 1–{rows.length} of {rows.length * 126 + 238} records</span><div className="pagination"><button aria-label="Previous page"><ChevronLeft size={15} /></button><button className="page-active">1</button><button>2</button><button>3</button><span>…</span><button>24</button><button aria-label="Next page"><ChevronRight size={15} /></button></div></div>
    </Card>
    {modal === 'create' && <FormModal meta={meta} onClose={() => setModal(null)} />}
    {modal === 'filters' && <FilterModal onClose={() => setModal(null)} />}
    {modal === 'detail' && selectedRow && <DetailModal row={selectedRow} onClose={() => setModal(null)} />}
  </>
}

function ModuleKpi({ label, value, detail, tone = 'primary' }: { label: string; value: string; detail: string; tone?: 'primary' | 'warning' | 'success' | 'info' }) {
  return <Card className="module-kpi"><span className={`module-kpi-icon module-kpi-${tone}`}><Check size={14} /></span><div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div></Card>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('missing') || status.toLowerCase().includes('attention') || status.toLowerCase().includes('hold') ? 'warning' : status.toLowerCase().includes('review') || status.toLowerCase().includes('draft') ? 'info' : status.toLowerCase().includes('published') || status.toLowerCase().includes('accepted') || status.toLowerCase().includes('active') || status.toLowerCase().includes('approved') || status.toLowerCase().includes('ready') || status.toLowerCase().includes('clear') || status.toLowerCase().includes('track') || status.toLowerCase().includes('posted') || status.toLowerCase().includes('open') ? 'success' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

export function ModalShell({ title, description, children, onClose, footer }: { title: string; description: string; children: ReactNode; onClose: () => void; footer: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="workflow-modal" role="dialog" aria-modal="true" aria-labelledby="workflow-modal-title"><div className="workflow-modal-head"><div><div className="eyebrow">Frontend workflow</div><h2 id="workflow-modal-title">{title}</h2><p>{description}</p></div><button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><div className="workflow-modal-body">{children}</div><div className="workflow-modal-foot">{footer}</div></div></div>
}

export function FormModal({ meta, onClose }: { meta: { title: string }; onClose: () => void }) {
  const [saved, setSaved] = useState(false)
  const submit = () => { setSaved(true); toast.success(`${meta.title} draft created.`); window.setTimeout(onClose, 450) }
  return <ModalShell title={`Create ${meta.title.toLowerCase()} record`} description="Capture the core information now; validation and API persistence will be connected in the backend phase." onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>{saved ? <><Check size={14} /> Saved</> : 'Save draft'}</Button></>}><div className="modal-form-grid"><label>Record name<input placeholder="Enter a name or title" autoFocus /></label><label>Reference ID<input placeholder="e.g. 2025-001" /></label><label className="modal-form-wide">Description<textarea placeholder="Add context for colleagues who will review this record" rows={3} /></label><label>Status<select defaultValue="Draft"><option>Draft</option><option>Under review</option><option>Active</option></select></label><label>Effective date<input type="date" /></label></div><div className="modal-info"><CircleHelp size={15} /><span>This is a frontend-only modal workflow using local demo state. It is ready for typed API integration.</span></div></ModalShell>
}

export function FilterModal({ onClose }: { onClose: () => void }) {
  return <ModalShell title="Filter workspace" description="Narrow the current module view without losing the wider operational context." onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { toast.success('Filters applied to this preview.'); onClose() }}>Apply filters</Button></>}><div className="modal-form-grid"><label>Status<select defaultValue="All statuses"><option>All statuses</option><option>Active</option><option>Under review</option><option>Needs attention</option><option>Draft</option></select></label><label>Academic period<select defaultValue="Semester II · 2025"><option>Semester II · 2025</option><option>Semester I · 2025</option><option>Semester II · 2024</option></select></label><label>Campus<select defaultValue="All campuses"><option>All campuses</option><option>Main campus</option><option>East campus</option><option>North campus</option></select></label><label>Updated since<select defaultValue="Any time"><option>Any time</option><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></label></div></ModalShell>
}

function DetailModal({ row, onClose }: { row: ModuleRow; onClose: () => void }) {
  return <ModalShell title={row.applicant ?? row.reference} description={`Review the operational summary for ${row.reference}.`} onClose={onClose} footer={<><Button variant="outline" onClick={() => toast.success('Record edit workflow opened.')}>Edit record</Button><Button onClick={onClose}>Done</Button></>}><div className="detail-list">{Object.entries(row).map(([key, value]) => <div className="detail-row" key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><strong>{key === 'status' ? <StatusBadge status={value} /> : value}</strong></div>)}</div></ModalShell>
}

function PermissionEmpty() {
  return <Card className="permission-empty"><div className="permission-empty-icon"><CircleHelp size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to this workspace. Switch the RBAC preview role or ask an administrator to grant the required permission.</p></Card>
}
