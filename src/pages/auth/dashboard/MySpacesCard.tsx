import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserIcon,
  HomeIcon,
  KeyIcon,
  GlobeAltIcon,
  PlusIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface SpaceInfo {
  role: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ALL_SPACES: SpaceInfo[] = [
  { role: 'buyer', label: 'Acheteur', icon: UserIcon, description: 'Rechercher et acheter des biens' },
  { role: 'seller', label: 'Vendeur', icon: HomeIcon, description: 'Vendre et gérer vos biens' },
  { role: 'lessor', label: 'Bailleur', icon: KeyIcon, description: 'Gérer vos locations' },
  { role: 'tenant', label: 'Locataire', icon: HomeIcon, description: 'Trouver un logement' },
  { role: 'owner', label: 'Propriétaire', icon: UserIcon, description: 'Gérer votre patrimoine' },
  { role: 'traveler', label: 'Voyageur', icon: GlobeAltIcon, description: 'Voyager et réserver' },
];

interface MySpacesCardProps {
  currentRole: string;
  currentUserId: string | number;
  linkedSpaces: string[];
  originalRole: string;
  onSpacesChanged?: (linkedSpaces: string[]) => void;
}

const MySpacesCard: React.FC<MySpacesCardProps> = ({
  currentRole,
  currentUserId,
  linkedSpaces,
  originalRole,
  onSpacesChanged,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [addingRole, setAddingRole] = useState<string | null>(null);
  const [removingRole, setRemovingRole] = useState<string | null>(null);
  const [error, setError] = useState('');

  const getSpaceLabel = (role: string) => {
    const space = ALL_SPACES.find(s => s.role === role);
    return space?.label || role;
  };

  const getSpaceIcon = (role: string) => {
    const space = ALL_SPACES.find(s => s.role === role);
    return space?.icon || UserIcon;
  };

  const getSpaceDescription = (role: string) => {
    const space = ALL_SPACES.find(s => s.role === role);
    return space?.description || '';
  };

  const normalizeRole = (role: string) => {
    if (role === 'owner') return 'seller';
    if (role === 'lessor') return 'seller';
    if (role === 'tenant') return 'buyer';
    return role;
  };

  const handleSwitchSpace = (role: string) => {
    navigate(`/dashboard/${role}/${currentUserId}`);
  };

  const handleAddSpace = useCallback(async (role: string) => {
    setAddingRole(role);
    setError('');
    try {
      const res = await fetch('/auth/add-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add space');
      }
      const data = await res.json();
      const newLinked = data.linkedSpaces || [...linkedSpaces, role];
      // Update localStorage
      const cached = localStorage.getItem('auth_user');
      if (cached) {
        const cachedUser = JSON.parse(cached);
        cachedUser.linkedSpaces = newLinked;
        localStorage.setItem('auth_user', JSON.stringify(cachedUser));
      }
      onSpacesChanged?.(newLinked);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingRole(null);
    }
  }, [linkedSpaces, onSpacesChanged]);

  const handleRemoveSpace = useCallback(async (role: string) => {
    setRemovingRole(role);
    setError('');
    try {
      const res = await fetch('/auth/remove-space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove space');
      }
      const data = await res.json();
      const newLinked = data.linkedSpaces || linkedSpaces.filter((r: string) => r !== role);
      const cached = localStorage.getItem('auth_user');
      if (cached) {
        const cachedUser = JSON.parse(cached);
        cachedUser.linkedSpaces = newLinked;
        localStorage.setItem('auth_user', JSON.stringify(cachedUser));
      }
      onSpacesChanged?.(newLinked);
      // If the deleted space was the active one, redirect to another space
      if (role === currentRole) {
        const nextRole = newLinked.length > 0 ? newLinked[0] : originalRole;
        if (nextRole) {
          const cached = localStorage.getItem('auth_user');
          let userId = '';
          if (cached) {
            try { userId = JSON.parse(cached).id; } catch { /* ignore */ }
          }
          navigate(`/dashboard/${nextRole}/${userId}`);
        } else {
          navigate('/auth');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemovingRole(null);
    }
  }, [linkedSpaces, originalRole, currentRole, navigate, onSpacesChanged]);

  const ownedRoles = linkedSpaces;
  const unownedRoles = ALL_SPACES.filter(s => !ownedRoles.includes(s.role));

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Mes espaces
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {ownedRoles.map(role => {
          const Icon = getSpaceIcon(role);
          const isCurrent = role === currentRole;
          const isOriginal = role === originalRole;
          const isRemoving = removingRole === role;

          return (
            <div key={role} className={`px-5 py-3 flex items-center gap-3 ${isCurrent ? 'bg-emerald-50' : ''}`}>
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${isCurrent ? 'text-emerald-600' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isCurrent ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {getSpaceLabel(role)}
                  {isCurrent && <span className="ml-2 text-xs text-emerald-500">(actif)</span>}
                  {isOriginal && <span className="ml-2 text-xs text-gray-400">(original)</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">{getSpaceDescription(role)}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isCurrent && (
                  <button
                    onClick={() => handleSwitchSpace(role)}
                    className="px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                  >
                    Switch
                  </button>
                )}
                {!isOriginal && (
                  <button
                    onClick={() => {
                      if (isCurrent) {
                        if (!window.confirm(`Supprimer l'espace "${getSpaceLabel(role)}" actif ? Vous allez être redirigé vers votre espace principal.`)) return;
                      }
                      handleRemoveSpace(role);
                    }}
                    disabled={isRemoving}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Supprimer cet espace"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add space section */}
      {unownedRoles.length > 0 && (
        <div className="px-5 py-3 border-t border-dashed border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">Ajouter un espace</p>
          <div className="flex flex-wrap gap-2">
            {unownedRoles.map(space => {
              const Icon = space.icon;
              const isAdding = addingRole === space.role;
              return (
                <button
                  key={space.role}
                  onClick={() => handleAddSpace(space.role)}
                  disabled={isAdding}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition-colors disabled:opacity-50"
                >
                  {isAdding ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                  ) : (
                    <PlusIcon className="w-3 h-3" />
                  )}
                  {space.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="px-5 py-2 text-xs text-red-600 bg-red-50">{error}</div>
      )}
    </div>
  );
};

export default MySpacesCard;
