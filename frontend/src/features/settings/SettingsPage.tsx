import { useState, type FormEvent } from 'react'
import {
  Building2,
  CalendarDays,
  House,
  Layers,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { hasAnyPermission } from '../../config/access'
import { roleProfiles, type Permission } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import './SettingsPage.css'

interface SettingsField {
  key: string
  label: string
  placeholder: string
  type?: 'text' | 'select' | 'textarea'
  options?: string[]
}

interface SettingsSectionDefinition {
  id: string
  title: string
  description: string
  icon: LucideIcon
  permissions: Permission[]
  fields: SettingsField[]
}

const settingsSections: SettingsSectionDefinition[] = [
  {
    id: 'institution',
    title: 'Institution identity and structure',
    description: 'Institution profile, campus structure and local defaults.',
    icon: Building2,
    permissions: ['institution.profile.manage', 'institution.structure.manage'],
    fields: [
      { key: 'institutionName', label: 'Institution name', placeholder: 'Enter the approved institution name' },
      { key: 'institutionType', label: 'Institution type', placeholder: 'Choose an institution type', type: 'select', options: ['University', 'College', 'Technical institute', 'Other'] },
      { key: 'campuses', label: 'Campus names', placeholder: 'Add campus names as configured by the institution', type: 'textarea' },
      { key: 'timezone', label: 'Institution timezone', placeholder: 'Choose a timezone', type: 'select', options: ['Africa/Kampala', 'Other'] },
    ],
  },
  {
    id: 'academic',
    title: 'Academic settings',
    description: 'Academic periods, programme rules and assessment policies.',
    icon: CalendarDays,
    permissions: ['academics.settings.manage'],
    fields: [
      { key: 'academicPeriods', label: 'Teaching-period structure', placeholder: 'Describe the approved academic periods', type: 'textarea' },
      { key: 'gradingPolicy', label: 'Grading policy reference', placeholder: 'Select or name the institution-approved scale' },
      { key: 'registrationRules', label: 'Registration policy reference', placeholder: 'Reference approved registration and credit-load rules' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance settings',
    description: 'Currency, fee schedules and financial approval workflows.',
    icon: WalletCards,
    permissions: ['finance.settings.manage'],
    fields: [
      { key: 'currency', label: 'Default currency', placeholder: 'Choose a currency', type: 'select', options: ['UGX', 'Other'] },
      { key: 'feeSchedule', label: 'Fee schedule reference', placeholder: 'Reference an approved fee schedule' },
      { key: 'financeApproval', label: 'Adjustment and refund approval workflow', placeholder: 'Describe the configured approval workflow', type: 'textarea' },
    ],
  },
  {
    id: 'staff',
    title: 'Staff and account administration',
    description: 'Staff records, account invitations and assigned administrative scope.',
    icon: UsersRound,
    permissions: ['staff.settings.manage'],
    fields: [
      { key: 'staffStructure', label: 'Staff structure reference', placeholder: 'Reference departments and staff categories' },
      { key: 'accountProvisioning', label: 'Account provisioning', placeholder: 'Choose an account provisioning process', type: 'select', options: ['Invitation only', 'Institution-approved process', 'Other'] },
    ],
  },
  {
    id: 'security',
    title: 'Security and permissions',
    description: 'Privileged account protections, permission review and access policies.',
    icon: ShieldCheck,
    permissions: ['security.settings.manage', 'system.configure'],
    fields: [
      { key: 'privilegedMfa', label: 'Privileged account MFA policy', placeholder: 'Choose a policy', type: 'select', options: ['Required', 'Institution-configured'] },
      { key: 'permissionReview', label: 'Permission review procedure', placeholder: 'Describe the authorised access review process', type: 'textarea' },
      { key: 'sessionPolicy', label: 'Session and account policy reference', placeholder: 'Reference the approved security policy' },
    ],
  },
  {
    id: 'communications',
    title: 'Communications and integrations',
    description: 'Institutional notification defaults and external service setup.',
    icon: Mail,
    permissions: ['communications.settings.manage', 'system.configure'],
    fields: [
      { key: 'senderName', label: 'Notification sender name', placeholder: 'Enter an approved sender name' },
      { key: 'emailIntegration', label: 'Email service configuration', placeholder: 'Choose an integration status', type: 'select', options: ['Not configured', 'Sandbox', 'Institution-managed'] },
      { key: 'smsIntegration', label: 'SMS service configuration', placeholder: 'Choose an integration status', type: 'select', options: ['Not configured', 'Sandbox', 'Institution-managed'] },
    ],
  },
  {
    id: 'library',
    title: 'Library settings',
    description: 'Library circulation and clearance policy references.',
    icon: Layers,
    permissions: ['library.settings.manage'],
    fields: [
      { key: 'libraryLoanPolicy', label: 'Loan policy reference', placeholder: 'Reference the approved circulation policy' },
      { key: 'libraryFinePolicy', label: 'Fine policy reference', placeholder: 'Reference the approved fine policy' },
    ],
  },
  {
    id: 'accommodation',
    title: 'Accommodation settings',
    description: 'Residence capacity, allocation and billing policy references.',
    icon: House,
    permissions: ['accommodation.settings.manage'],
    fields: [
      { key: 'allocationPolicy', label: 'Allocation policy reference', placeholder: 'Reference the approved accommodation policy' },
      { key: 'residenceCharges', label: 'Residence charge schedule', placeholder: 'Reference the approved charge schedule' },
    ],
  },
  {
    id: 'other-services',
    title: 'Other service settings',
    description: 'Configuration for internship, welfare, procurement and quality workflows.',
    icon: LockKeyhole,
    permissions: ['internships.settings.manage', 'welfare.settings.manage', 'procurement.settings.manage', 'quality.settings.manage'],
    fields: [
      { key: 'servicePolicy', label: 'Service policy reference', placeholder: 'Enter a policy reference for your permitted service area' },
      { key: 'serviceWorkflow', label: 'Approval workflow reference', placeholder: 'Reference the configured workflow' },
    ],
  },
]

export function SettingsPage() {
  const { roleId } = useOutletContext<AppShellContext>()
  const roleProfile = roleProfiles[roleId]
  const visibleSections = settingsSections.filter((section) =>
    hasAnyPermission(roleId, section.permissions),
  )
  const [draftValues, setDraftValues] = useState<Record<string, string>>({})
  const [savedDraft, setSavedDraft] = useState<string | null>(null)

  function saveDraft(event: FormEvent<HTMLFormElement>, sectionId: string) {
    event.preventDefault()
    setSavedDraft(sectionId)
  }

  return (
    <section aria-labelledby="settings-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{roleProfile.scope}</p>
          <h1 className="page-title" id="settings-title">Institution settings</h1>
          <p className="page-description">Configure the settings permitted for your role and assigned scope.</p>
        </div>
        <span className="system-status"><span className="status-dot" />Draft preview</span>
      </div>

      <div className="settings-notice" role="note">
        <LockKeyhole size={16} aria-hidden="true" />
        <p><strong>Backend persistence is not connected.</strong> Drafts are held only in this page session. Production settings must be saved and audited by the authorised backend service.</p>
      </div>

      <div className="settings-sections">
        {visibleSections.map((section) => (
          <section className="settings-section" key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="settings-section-heading">
              <span className="settings-section-icon"><section.icon size={15} aria-hidden="true" /></span>
              <div>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p>{section.description}</p>
              </div>
            </div>
            <form onSubmit={(event) => saveDraft(event, section.id)}>
              <div className="settings-fields">
                {section.fields.map((field) => {
                  const fieldId = `${section.id}-${field.key}`
                  return (
                    <label className={`settings-field${field.type === 'textarea' ? ' is-wide' : ''}`} htmlFor={fieldId} key={field.key}>
                      <span>{field.label}</span>
                      {field.type === 'select' ? (
                        <Select
                          value={draftValues[fieldId] ?? ''}
                          onValueChange={(value) => setDraftValues((current) => ({ ...current, [fieldId]: value }))}
                        >
                          <SelectTrigger id={fieldId} aria-label={field.label}>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={fieldId}
                          placeholder={field.placeholder}
                          value={draftValues[fieldId] ?? ''}
                          onChange={(event) => setDraftValues((current) => ({ ...current, [fieldId]: event.target.value }))}
                          rows={2}
                        />
                      ) : (
                        <input
                          id={fieldId}
                          type="text"
                          placeholder={field.placeholder}
                          value={draftValues[fieldId] ?? ''}
                          onChange={(event) => setDraftValues((current) => ({ ...current, [fieldId]: event.target.value }))}
                        />
                      )}
                    </label>
                  )
                })}
              </div>
              <div className="settings-form-footer">
                {savedDraft === section.id && <span role="status">Draft updated for this session only.</span>}
                <Button className="settings-save-button" type="submit" size="sm">Save session draft</Button>
              </div>
            </form>
          </section>
        ))}
      </div>
    </section>
  )
}
