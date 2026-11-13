import { InvitationData, RSVP } from '../types/invitation';
import { SAMPLE_INVITATION } from '../data/templates';

const LOCAL_STORAGE_KEY = 'gp_invitations_v1';

export const getStoredInvitations = (): InvitationData[] => {
  if (typeof window === 'undefined') {
    return [SAMPLE_INVITATION];
  }
  
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([SAMPLE_INVITATION]));
      return [SAMPLE_INVITATION];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([SAMPLE_INVITATION]));
      return [SAMPLE_INVITATION];
    }
    return parsed;
  } catch (e) {
    console.error('Error reading localStorage invitations:', e);
    return [SAMPLE_INVITATION];
  }
};

export const saveInvitation = (invitation: InvitationData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const list = getStoredInvitations();
    const index = list.findIndex(item => item.id === invitation.id || item.slug === invitation.slug);
    
    if (index >= 0) {
      list[index] = { ...list[index], ...invitation, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...invitation, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving invitation:', e);
  }
};

export const getInvitationBySlug = (slug: string): InvitationData | null => {
  const list = getStoredInvitations();
  return list.find(item => item.slug === slug || item.id === slug) || null;
};

export const addRSVP = (slugOrId: string, rsvp: Omit<RSVP, 'id' | 'createdAt'>): RSVP | null => {
  if (typeof window === 'undefined') return null;
  
  const list = getStoredInvitations();
  const invitation = list.find(item => item.slug === slugOrId || item.id === slugOrId);
  
  if (!invitation) return null;
  
  const newRsvp: RSVP = {
    ...rsvp,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    invitationId: invitation.id,
    createdAt: new Date().toISOString()
  };
  
  if (!invitation.rsvps) invitation.rsvps = [];
  invitation.rsvps.unshift(newRsvp);
  invitation.updatedAt = new Date().toISOString();
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  return newRsvp;
};

export const incrementViewCount = (slugOrId: string): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredInvitations();
  const invitation = list.find(item => item.slug === slugOrId || item.id === slugOrId);
  if (invitation) {
    invitation.views = (invitation.views || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
};

export const incrementShareCount = (slugOrId: string): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredInvitations();
  const invitation = list.find(item => item.slug === slugOrId || item.id === slugOrId);
  if (invitation) {
    invitation.shares = (invitation.shares || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
};

export const deleteInvitation = (id: string): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredInvitations();
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
};

export const updateInvitationStatus = (id: string, status: 'published' | 'draft' | 'archived'): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredInvitations();
  const invitation = list.find(item => item.id === id);
  if (invitation) {
    invitation.status = status;
    invitation.updatedAt = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
};
