import { CircleHelp } from 'lucide-react'

interface ModulePlaceholderPageProps {
  title: string
}

export function ModulePlaceholderPage({ title }: ModulePlaceholderPageProps) {
  return (
    <section aria-labelledby="module-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Institution workspace</p>
          <h1 className="page-title" id="module-title">{title}</h1>
          <p className="page-description">Module workspace</p>
        </div>
      </div>
      <div className="module-notice" role="status">
        <CircleHelp size={18} aria-hidden="true" />
        <p>
          <strong>Module foundation only</strong>
          This module has a route in the frontend structure. Its workflows and live records will be added in a later implementation phase.
        </p>
      </div>
    </section>
  )
}