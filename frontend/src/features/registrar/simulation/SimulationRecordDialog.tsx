import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import type { DemoWorkspaceRow } from './workspaceRows'

export interface SimulationAction {
  label: string
  intent?: 'default' | 'destructive'
}

interface SimulationRecordDialogProps {
  title: string
  record: DemoWorkspaceRow
  actions: SimulationAction[]
  onAction: (label: string, record: DemoWorkspaceRow) => void
}

export function SimulationRecordDialog({ title, record, actions, onAction }: SimulationRecordDialogProps) {
  const [open, setOpen] = useState(false)

  function runAction(label: string) {
    onAction(label, record)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`View ${record.id}`}><Eye size={14} aria-hidden="true" />View</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={`${record.id}-description`}>
        <DialogHeader>
          <DialogTitle>{title} · {record.id}</DialogTitle>
          <DialogDescription id={`${record.id}-description`}>
            Synthetic simulation record. Changes are saved only in this browser.
          </DialogDescription>
        </DialogHeader>
        <dl className="simulation-record-details">
          {record.details.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <DialogFooter className="simulation-record-actions">
          {actions.length > 0 ? actions.map(({ label, intent }) => (
            <Button
              key={label}
              variant={intent === 'destructive' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => runAction(label)}
            >
              {label}
            </Button>
          )) : <span>No workflow actions are available for this status.</span>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
