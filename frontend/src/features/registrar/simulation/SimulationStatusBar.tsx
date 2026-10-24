import { useState } from 'react'
import { Database, RotateCcw } from 'lucide-react'
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
import { useSimulation } from './SimulationProvider'

export function SimulationStatusBar() {
  const { resetDemo } = useSimulation()
  const [open, setOpen] = useState(false)

  return (
    <aside className="simulation-status-bar" aria-label="Local simulation mode">
      <div className="simulation-status-copy">
        <span className="simulation-status-icon"><Database size={14} aria-hidden="true" /></span>
        <strong>Simulation mode</strong>
        <span>Synthetic data · saved in this browser only · not an authenticated system</span>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm"><RotateCcw size={13} aria-hidden="true" />Reset demo</Button>
        </DialogTrigger>
        <DialogContent aria-describedby="simulation-reset-description">
          <DialogHeader>
            <DialogTitle>Reset simulation data?</DialogTitle>
            <DialogDescription id="simulation-reset-description">
              This clears all local demo changes in this browser and restores the original synthetic dataset. It does not change any institutional or server data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { resetDemo(); setOpen(false) }}>Reset demo data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
