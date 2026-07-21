import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BellIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'

interface SectionCardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 text-gray-500">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
)

const TextInput: React.FC<{
  label: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    />
  </div>
)

const SellerProfile: React.FC = () => {
  const { t } = useTranslation()

  const [prenom, setPrenom] = useState('Nadia')
  const [nom, setNom] = useState('El Fassi')
  const [email, setEmail] = useState('nadia@email.com')
  const [telephone, setTelephone] = useState('+212 6 11 22 33 44')
  const [dateNaissance, setDateNaissance] = useState('15/03/1975')

  const [newsletter, setNewsletter] = useState(true)
  const [alertesEmail, setAlertesEmail] = useState(true)
  const [notificationsSms, setNotificationsSms] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  const Checkbox: React.FC<{
    checked: boolean
    onChange: () => void
    label: string
  }> = ({ checked, onChange, label }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onChange}
        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
          checked
            ? 'bg-emerald-600 border-emerald-600'
            : 'border-gray-300 bg-white'
        }`}
      >
        {checked && <CheckCircleIcon className="w-4 h-4 text-white" />}
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <UserCircleIcon className="w-8 h-8 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">MON PROFIL</h1>
      </div>
      <p className="text-gray-500 mb-8 ml-11">
        Gérez vos informations personnelles et préférences
      </p>

      <SectionCard
        icon={<UserCircleIcon className="w-full h-full" />}
        title="INFORMATIONS PERSONNELLES"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 bg-gray-200 rounded-full" />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full hover:bg-black/40 transition-colors"
            >
              <CameraIcon className="w-8 h-8 text-white" />
            </button>
          </div>
          <button
            type="button"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline underline-offset-2"
          >
            Changer la photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          <TextInput label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          <TextInput label="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} type="tel" />
          <TextInput label="Date naissance" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} placeholder="JJ/MM/AAAA" />
        </div>
      </SectionCard>

      <SectionCard
        icon={<BellIcon className="w-full h-full" />}
        title="PRÉFÉRENCES"
      >
        <div className="flex flex-col gap-4">
          <Checkbox
            checked={newsletter}
            onChange={() => setNewsletter(!newsletter)}
            label="Newsletter"
          />
          <Checkbox
            checked={alertesEmail}
            onChange={() => setAlertesEmail(!alertesEmail)}
            label="Alertes Email"
          />
          <Checkbox
            checked={notificationsSms}
            onChange={() => setNotificationsSms(!notificationsSms)}
            label="Notifications SMS"
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={<ShieldCheckIcon className="w-full h-full" />}
        title="SÉCURITÉ"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <TextInput
            label="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
          <TextInput
            label="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
          <TextInput
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <Checkbox
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
            label="Activer l'authentification à deux facteurs (2FA)"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <KeyIcon className="w-4 h-4" />
          <span>Dernière connexion : 13/06/2026 à 14h30</span>
        </div>
      </SectionCard>

      <SectionCard
        icon={<BellIcon className="w-full h-full" />}
        title="ACTIONS"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

export default SellerProfile
