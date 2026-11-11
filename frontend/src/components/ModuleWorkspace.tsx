import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert, CircleHelp, Download, Filter, Layers, MoreHorizontal, Plus, RefreshCw, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, Button, Card, EmptyState, ErrorState, KpiCard, KpiSkeleton, Skeleton, TableSkeleton } from './ui'
import { adminNavigationItems, moduleIcons, moduleKpis, moduleRows, navigationItems, pageMeta } from '../data'
import { useAppContext } from '../app-context'
import { addMatriculatedStudent, readModuleRows, writeModuleRows, type DemoRow } from '../demo-store'

type ModuleRow = DemoRow
type ModalMode = 'create' | 'filters' | 'detail' | null

export function ModuleWorkspace({ path, loading = false }: { path: string; loading?: boolean }) {
  const meta = pageMeta[path]
  const Icon = moduleIcons[path]
  const seededRows = moduleRows[path] ?? []
  const [recordState, setRecordState] = useState(() => ({ path, rows: readModuleRows(path, seededRows) }))
  const rows = recordState.path === path ? recordState.rows : readModuleRows(path, seededRows)
  const kpis = moduleKpis[path] ?? [
    { label: 'Total records', value: `${rows.length * 126 + 238}`, detail: 'Across current workspace', tone: 'blue' as const, icon: Layers },
    { label: 'Needs attention', value: `${Math.max(3, rows.length + 1)}`, detail: 'Requires a follow-up', tone: 'amber' as const, icon: CircleAlert },
    { label: 'Updated today', value: `${rows.length * 18 + 42}`, detail: 'Fresh activity', tone: 'teal' as const, icon: RefreshCw },
    { label: 'Active cycle', value: '2025', detail: 'Semester II', tone: 'purple' as const, icon: CalendarDays },
  ]
  const { can } = useAppContext()
  const permission = path.startsWith('/academics/')
    ? 'academics.view'
    : [...navigationItems, ...adminNavigationItems].find((item) => path === item.href || path.startsWith(`${item.href}/`))?.permission
  const [modal, setModal] = useState<ModalMode>(null)
  const [selectedRow, setSelectedRow] = useState<ModuleRow | null>(null)
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [page, setPage] = useState(0)
  const [bulkStatus, setBulkStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const pageSize = 10
  const searchTerm = search.trim().toLowerCase()
  const filteredRows = rows.filter((row) => {
    const matchesSearch = Object.values(row).some((value) => value.toLowerCase().includes(searchTerm))
    return matchesSearch && (statusFilter === 'All statuses' || row.status === statusFilter)
  })
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const pageRows = filteredRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  const statusOptions = Array.from(new Set(rows.map((row) => row.status).filter(Boolean)))
  const selectedCount = rows.filter((row) => selectedReferences.includes(row.reference)).length
  const allRowsSelected = pageRows.length > 0 && pageRows.every((row) => selectedReferences.includes(row.reference))

  useEffect(() => {
    setRecordState({ path, rows: readModuleRows(path, moduleRows[path] ?? []) })
    setSelectedReferences([])
    setSearch('')
    setStatusFilter('All statuses')
    setPage(0)
  }, [path])
  useEffect(() => setPage(0), [search, statusFilter])
  useEffect(() => {
    const selectedOnPage = pageRows.filter((row) => selectedReferences.includes(row.reference)).length
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedOnPage > 0 && !allRowsSelected
  }, [pageRows, selectedReferences, allRowsSelected])

  const toggleRowSelection = (reference: string) => setSelectedReferences((current) => current.includes(reference)
    ? current.filter((selectedReference) => selectedReference !== reference)
    : [...current, reference])
  const toggleAllRows = () => {
    const pageReferences = pageRows.map((row) => row.reference)
    setSelectedReferences((current) => allRowsSelected
      ? current.filter((reference) => !pageReferences.includes(reference))
      : [...new Set([...current, ...pageReferences])])
  }

  const persistRows = (nextRows: ModuleRow[]) => {
    try {
      writeModuleRows(path, nextRows)
      setRecordState({ path, rows: nextRows })
      setError(null)
      return true
    } catch {
      setError('Changes could not be saved in this browser. Check available storage and retry.')
      return false
    }
  }

  const createRecord = (record: ModuleRow) => {
    if (rows.some((row) => row.reference === record.reference)) {
      toast.error('That reference is already in use.')
      return
    }
    if (persistRows([record, ...rows])) {
      setModal(null)
      toast.success(`${meta.title} record added to this preview.`)
    }
  }

  const updateRecord = (updated: ModuleRow) => {
    if (!persistRows(rows.map((row) => row.reference === updated.reference ? updated : row))) return
    if (path === '/admissions/matriculation' && updated.status === 'Enrolled') {
      toast.success(addMatriculatedStudent(updated) ? 'Matriculation complete. A student record was created.' : 'This applicant already has a student record.')
    } else {
      toast.success(`${meta.title} record updated.`)
    }
    setModal(null)
  }

  const deleteRecord = (reference: string) => {
    if (!window.confirm(`Delete record ${reference} from this preview?`)) return
    if (persistRows(rows.filter((row) => row.reference !== reference))) {
      setModal(null)
      toast.success('Record removed from this preview.')
    }
  }

  const exportRows = (records: ModuleRow[]) => {
    const content = JSON.stringify({ module: path, exportedAt: new Date().toISOString(), records }, null, 2)
    downloadJson(`${path.split('/').filter(Boolean).join('-') || 'module'}-records.json`, content)
    toast.success(`${records.length} records exported.`)
  }

  const importRows = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 2_000_000) throw new Error('Import files must be smaller than 2 MB.')
      const parsed = JSON.parse(await file.text()) as { records?: unknown } | unknown[]
      const incoming = Array.isArray(parsed) ? parsed : (parsed as { records?: unknown }).records
      if (!Array.isArray(incoming) || !incoming.every((row) => row && typeof row === 'object' && typeof (row as ModuleRow).reference === 'string')) {
        throw new Error('Choose a JSON array of records or a TIMS export file.')
      }
      if (!incoming.every((row) => Object.values(row as ModuleRow).every((value) => typeof value === 'string'))) throw new Error('Every imported record field must be text.')
      const existing = new Set(rows.map((row) => row.reference))
      const uniqueRows = (incoming as ModuleRow[]).filter((row) => !existing.has(row.reference))
      if (persistRows([...uniqueRows, ...rows])) toast.success(`${uniqueRows.length} records imported; duplicate references were skipped.`)
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'The import file could not be read.')
    } finally {
      event.target.value = ''
    }
  }

  const updateSelectedStatus = () => {
    if (!bulkStatus) return
    const selected = new Set(selectedReferences)
    const updatedRows = rows.map((row) => selected.has(row.reference) ? { ...row, status: bulkStatus } : row)
    if (persistRows(updatedRows)) {
      if (path === '/admissions/matriculation' && bulkStatus === 'Enrolled') {
        const enrolledRows = updatedRows.filter((row) => selected.has(row.reference))
        const createdCount = enrolledRows.filter((row) => addMatriculatedStudent(row)).length
        toast.success(`${createdCount} matriculated applicants added to the Student directory.`)
      }
      toast.success(`${selectedCount} records updated.`)
      setSelectedReferences([])
      setBulkStatus('')
    }
  }

  const refreshData = () => {
    setError(null)
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 500)
  }

  if (permission && !can(permission)) return <PermissionEmpty />
  if (loading || refreshing) return <>
    <div className="stats-grid module-kpi-strip" aria-label={`Loading ${meta.title} metrics`}>{Array.from({ length: 4 }, (_, index) => <KpiSkeleton key={index} />)}</div>
    <div className="module-toolbar" aria-hidden="true"><Skeleton className="skeleton-search" /><div className="toolbar-actions"><Skeleton className="skeleton-toolbar-button" /><Skeleton className="skeleton-toolbar-button" /></div></div>
    <TableSkeleton label={`Loading ${meta.title.toLowerCase()}`} />
  </>
  if (error) return <ErrorState title={`${meta.title} unavailable`} description={error} onRetry={refreshData} />
  const openDetails = (row: ModuleRow) => {
    setSelectedRow(row)
    setModal('detail')
  }

  return <>
    <div className="stats-grid module-kpi-strip">
      {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
    </div>
    <div className="module-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}`} aria-label={`Search ${meta.title}`} /></label>
      <div className="toolbar-actions">
        <Button variant="outline" size="sm" onClick={() => setModal('filters')}><Filter size={15} /> Filters</Button>
        <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}><Plus size={15} /> Import</Button>
        <input ref={importInputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void importRows(event)} aria-label={`Import ${meta.title} JSON file`} />
        <Button size="sm" onClick={() => exportRows(filteredRows)}><Download size={15} /> Export</Button>
        <Button size="sm" onClick={() => setModal('create')}><Plus size={15} /> New record</Button>
      </div>
    </div>
    {selectedCount > 0 && <div className="bulk-selection-toolbar" aria-live="polite"><span>{selectedCount} selected</span><label className="bulk-status-action"><span>Set status</span><select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)}><option value="">Choose status</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label><Button variant="outline" size="sm" disabled={!bulkStatus} onClick={updateSelectedStatus}>Apply</Button><Button variant="outline" size="sm" onClick={() => exportRows(rows.filter((row) => selectedReferences.includes(row.reference)))}><Download size={14} /> Export selected</Button><Button variant="ghost" size="sm" onClick={() => setSelectedReferences([])}>Clear selection</Button></div>}
    <Card className="module-table-card">
      <div className="table-card-head"><div className="module-title"><div className="module-title-icon"><Icon size={19} /></div><div><h2>{meta.title}</h2><p>{rows.length} records · {filteredRows.length} matching filters</p></div></div><button className="card-menu" aria-label="More options" onClick={() => setModal('filters')}><MoreHorizontal size={18} /></button></div>
      {filteredRows.length ? <><div className="table-responsive"><table className="data-table"><thead><tr><th className="bulk-select-cell"><input ref={selectAllRef} type="checkbox" checked={allRowsSelected} onChange={toggleAllRows} aria-label={`Select all records on page ${currentPage + 1}`} /></th>{Object.keys(rows[0] ?? {}).map((header) => <th key={header}>{header === 'reference' ? 'Reference' : header[0].toUpperCase() + header.slice(1)}</th>)}<th aria-label="Actions" /></tr></thead><tbody>{pageRows.map((row) => <tr key={row.reference}><td className="bulk-select-cell"><input type="checkbox" checked={selectedReferences.includes(row.reference)} onChange={() => toggleRowSelection(row.reference)} aria-label={`Select ${row.reference}`} /></td>{Object.entries(row).map(([key, value]) => <td key={key}>{key === 'status' ? <StatusBadge status={value} /> : key === 'applicant' ? <div className="table-person"><span className="table-avatar">{value.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><strong>{value}</strong></div> : <span className={key === 'reference' ? 'reference-code' : ''}>{value}</span>}</td>)}<td><button className="row-more" aria-label={`Open details for ${row.reference}`} onClick={() => openDetails(row)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
      <div className="table-footer"><span>Showing {filteredRows.length ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, filteredRows.length)} of {filteredRows.length} matching records</span><div className="pagination"><button aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={index === currentPage ? 'page-active' : ''} aria-current={index === currentPage ? 'page' : undefined} onClick={() => setPage(index)}>{index + 1}</button>)}<button aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}><ChevronRight size={15} /></button></div></div></> : <EmptyState title="No matching records" description="Try another search or clear the selected status filter." actionLabel="Clear filters" onAction={() => { setSearch(''); setStatusFilter('All statuses') }} />}
    </Card>
    {modal === 'create' && <FormModal meta={meta} onClose={() => setModal(null)} onCreate={createRecord} />}
    {modal === 'filters' && <FilterModal statuses={statusOptions} status={statusFilter} onApply={setStatusFilter} onClose={() => setModal(null)} />}
    {modal === 'detail' && selectedRow && <DetailModal row={selectedRow} onClose={() => setModal(null)} onSave={updateRecord} onDelete={deleteRecord} />}
  </>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('missing') || status.toLowerCase().includes('attention') || status.toLowerCase().includes('hold') ? 'warning' : status.toLowerCase().includes('review') || status.toLowerCase().includes('draft') ? 'info' : status.toLowerCase().includes('published') || status.toLowerCase().includes('accepted') || status.toLowerCase().includes('active') || status.toLowerCase().includes('approved') || status.toLowerCase().includes('ready') || status.toLowerCase().includes('clear') || status.toLowerCase().includes('track') || status.toLowerCase().includes('posted') || status.toLowerCase().includes('open') ? 'success' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

export function ModalShell({ title, description, children, onClose, footer }: { title: string; description: string; children: ReactNode; onClose: () => void; footer: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="workflow-modal" role="dialog" aria-modal="true" aria-labelledby="workflow-modal-title"><div className="workflow-modal-head"><div><div className="eyebrow">Frontend workflow</div><h2 id="workflow-modal-title">{title}</h2><p>{description}</p></div><button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><div className="workflow-modal-body">{children}</div><div className="workflow-modal-foot">{footer}</div></div></div>
}

export function FormModal({ meta, onClose, onCreate }: { meta: { title: string }; onClose: () => void; onCreate: (record: ModuleRow) => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [record, setRecord] = useState({ reference: '', applicant: '', programme: '', intake: '', status: 'Draft' })
  const update = (key: keyof typeof record, value: string) => setRecord((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!record.applicant.trim()) { setError('Enter a record name before saving.'); return }
    setError('')
    setSaving(true)
    window.setTimeout(() => {
      const reference = record.reference.trim() || `DEMO-${Date.now()}`
      onCreate({ ...record, reference })
      setSaving(false)
    }, 320)
  }
  return <ModalShell title={`Create ${meta.title.toLowerCase()} record`} description="Create a preview record. It is stored locally in this browser until API persistence is wired." onClose={onClose} footer={<><Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="module-create-form" loading={saving}>Create record</Button></>}>
    <form id="module-create-form" onSubmit={submit} className="modal-form-grid"><label>Record name<input value={record.applicant} onChange={(event) => update('applicant', event.target.value)} placeholder="Enter a name or title" autoFocus required /></label><label>Reference ID<input value={record.reference} onChange={(event) => update('reference', event.target.value)} placeholder="Generated if left blank" /></label><label>Programme or category<input value={record.programme} onChange={(event) => update('programme', event.target.value)} placeholder="Programme, department, or category" /></label><label>Period or context<input value={record.intake} onChange={(event) => update('intake', event.target.value)} placeholder="Intake, term, or effective date" /></label><label>Status<select value={record.status} onChange={(event) => update('status', event.target.value)}><option>Draft</option><option>Under review</option><option>Active</option><option>Pending</option><option>Approved</option></select></label></form>
    {error && <div className="settings-form-message settings-form-error" role="alert">{error}</div>}
    <div className="modal-info"><CircleHelp size={15} /><span>New records are saved to this browser’s demo workspace and can be exported as JSON.</span></div>
  </ModalShell>
}

export function FilterModal({ onClose, statuses, status, onApply }: { onClose: () => void; statuses: string[]; status: string; onApply: (status: string) => void }) {
  const [selectedStatus, setSelectedStatus] = useState(status)
  return <ModalShell title="Filter workspace" description="Filter the current local record set by status. Use search for other fields." onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { onApply(selectedStatus); onClose() }}>Apply filters</Button></>}><div className="modal-form-grid"><label>Status<select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div></ModalShell>
}

function DetailModal({ row, onClose, onSave, onDelete }: { row: ModuleRow; onClose: () => void; onSave: (row: ModuleRow) => void; onDelete: (reference: string) => void }) {
  const [draft, setDraft] = useState(row)
  const [editing, setEditing] = useState(false)
  const update = (key: string, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  return <ModalShell title={draft.applicant ?? draft.reference} description={`Review and edit the local preview record ${draft.reference}.`} onClose={onClose} footer={<><Button variant="danger" onClick={() => onDelete(row.reference)}>Delete</Button><Button variant="ghost" onClick={onClose}>Close</Button>{editing ? <Button onClick={() => onSave(draft)}>Save changes</Button> : <Button variant="outline" onClick={() => setEditing(true)}>Edit record</Button>}</>}>
    <div className="detail-list">{Object.entries(draft).map(([key, value]) => <div className="detail-row" key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><strong>{editing ? key === 'status' ? <input value={value} onChange={(event) => update(key, event.target.value)} /> : <input value={value} onChange={(event) => update(key, event.target.value)} disabled={key === 'reference'} /> : key === 'status' ? <StatusBadge status={value} /> : value}</strong></div>)}</div>
  </ModalShell>
}

function PermissionEmpty() {
  return <Card className="permission-empty"><div className="permission-empty-icon"><CircleHelp size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to this workspace. Switch the RBAC preview role or ask an administrator to grant the required permission.</p></Card>
}

function downloadJson(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
