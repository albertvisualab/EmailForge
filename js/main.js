/**
 * EmailForge — main.js
 * Application entry point & orchestrator.
 * Wires together all modules: form inputs, profile management,
 * template selection, color picker, tabs, and preview rendering.
 */

'use strict';

/* ══════════════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ══════════════════════════════════════════════════════════════════ */

const STORAGE_KEY_PROFILES = 'ef_profiles';
const STORAGE_KEY_ACTIVE   = 'ef_active_profile';
const STORAGE_KEY_THEME    = 'ef_theme';

const COLOR_PRESETS = [
  { hex: '#6366f1', name: 'Indigo'     },
  { hex: '#0ea5e9', name: 'Sky'        },
  { hex: '#10b981', name: 'Emerald'    },
  { hex: '#f59e0b', name: 'Amber'      },
  { hex: '#ef4444', name: 'Red'        },
  { hex: '#8b5cf6', name: 'Violet'     },
  { hex: '#ec4899', name: 'Pink'       },
  { hex: '#e85d04', name: 'Orange'     },
  { hex: '#1a1a2e', name: 'Midnight'   },
  { hex: '#0f766e', name: 'Teal'       },
];

const DEFAULT_PROFILE = {
  id:        'default',
  name:      'Professional',
  data: {
    firstName: '', lastName: '', jobTitle: '', department: '',
    company: '', website: '', email: '', phone: '', address: '',
    tagline: '', avatar: null, originalAvatar: null, logo: null, originalLogo: null,
    logoUrl: '', avatarExternalUrl: '', logoExternalUrl: '',
    linkedin: '', twitter: '', instagram: '', github: '',
    dribbble: '', youtube: '', calendly: '', whatsapp: '',
    behance: '', substack: '', pinterest: '',
    disclaimer: 'Important: The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.',
  },
  options: {
    template:    'minimal',
    accentColor: '#6366f1',
    fontSize:    13,
    fontFamily:  'Arial, Helvetica, sans-serif',
    showDivider: true,
    showAvatar:  true,
    showLogo:    true,
    showIcons:   true,
    showTagline: true,
    showDisclaimer: true,
    showContactIcons: false,
    contactIconShape: 'square',
    
    // Custom typography colors
    colorName:   '#111111',
    colorJobTitle: '#6366f1',
    colorCompany: '#666666',
    colorContact: '#666666',
    colorContactHover: '#6366f1',
    colorTagline: '#999999',
    colorDisclaimer: '#969696',
    disclaimerSize: 10,
    disclaimerSpacingTop: 10,
    contactLineHeight: 24,
    socialSpacingTop: 10,
    
    // Avatar design options
    avatarSize: 60,
    avatarShape: 'circle',
    avatarSpacingTop: 0,
    avatarBorderWidth: 0,
    avatarBorderColor: '#6366f1',
    
    // Logo design options
    logoSize: 60,
    logoShape: 'square',
    logoPlacement: 'details',
    logoSpacing: 10,
    
    // Social icon design options
    socialIconColorMode: 'brand',
    socialIconShape: 'circle',
    socialIconCustomColor: '#6366f1',
    
    // Individual social normal/hover colors
    socialColor_linkedin: '#0A66C2', socialHover_linkedin: '#004b93',
    socialColor_twitter: '#000000', socialHover_twitter: '#222222',
    socialColor_instagram: '#E4405F', socialHover_instagram: '#c13584',
    socialColor_github: '#181717', socialHover_github: '#404040',
    socialColor_dribbble: '#EA4C89', socialHover_dribbble: '#c32361',
    socialColor_youtube: '#FF0000', socialHover_youtube: '#b30000',
    socialColor_calendly: '#006BFF', socialHover_calendly: '#004b93',
    socialColor_whatsapp: '#25D366', socialHover_whatsapp: '#128C7E',
    socialColor_behance: '#1769ff', socialHover_behance: '#004fd1',
    socialColor_substack: '#FF6719', socialHover_substack: '#d9520e',
    socialColor_pinterest: '#BD081C', socialHover_pinterest: '#990012',
  },
};

/* ══════════════════════════════════════════════════════════════════
   APPLICATION STATE
   ══════════════════════════════════════════════════════════════════ */

const State = {
  profiles:      [],      // array of profile objects
  activeId:      null,    // currently active profile id
  pendingModal:  null,    // 'new' | profile id (for rename)

  get active() {
    return this.profiles.find(p => p.id === this.activeId) || this.profiles[0];
  },
};

/* ══════════════════════════════════════════════════════════════════
   DATA HELPERS
   ══════════════════════════════════════════════════════════════════ */

/** Read all form field values into a data object. */
function readFormData() {
  const fields = [
    'firstName','lastName','jobTitle','department','company',
    'website','email','phone','address','tagline',
    'logoUrl', 'avatarExternalUrl', 'logoExternalUrl',
    'linkedin','twitter','instagram','github',
    'dribbble','youtube','calendly','whatsapp',
    'behance','substack','pinterest',
    'disclaimer',
  ];
  const data = {};
  fields.forEach(f => {
    const el = document.getElementById(f);
    data[f] = el ? el.value.trim() : '';
  });
  // Avatar and logo are stored separately (base64)
  data.avatar = State.active?.data?.avatar || null;
  data.originalAvatar = State.active?.data?.originalAvatar || null;
  data.logo = State.active?.data?.logo || null;
  data.originalLogo = State.active?.data?.originalLogo || null;
  return data;
}

/** Read all design option values from UI controls. */
function readOptions() {
  return {
    template:    State.active?.options?.template    || 'minimal',
    accentColor: State.active?.options?.accentColor || '#6366f1',
    fontSize:    parseInt(document.getElementById('fontSize')?.value || 13),
    fontFamily:  document.getElementById('fontFamily')?.value || 'Arial, Helvetica, sans-serif',
    showDivider: document.getElementById('showDivider')?.checked ?? true,
    showAvatar:  document.getElementById('showAvatar')?.checked  ?? true,
    showLogo:    document.getElementById('showLogo')?.checked    ?? true,
    showIcons:   document.getElementById('showIcons')?.checked   ?? true,
    showTagline: document.getElementById('showTagline')?.checked ?? true,
    showDisclaimer: document.getElementById('showDisclaimer')?.checked ?? true,
    showContactIcons: document.getElementById('showContactIcons')?.checked ?? false,
    contactIconShape: document.getElementById('contactIconShape')?.value || 'square',
    contactIconColor: document.getElementById('contactIconColor')?.value || '#6366f1',
    
    // Custom colors
    colorName:   document.getElementById('colorName')?.value || '#111111',
    colorJobTitle: document.getElementById('colorJobTitle')?.value || '#6366f1',
    colorCompany: document.getElementById('colorCompany')?.value || '#666666',
    colorContact: document.getElementById('colorContact')?.value || '#666666',
    colorContactHover: document.getElementById('colorContactHover')?.value || '#6366f1',
    colorTagline: document.getElementById('colorTagline')?.value || '#999999',
    colorDisclaimer: document.getElementById('colorDisclaimer')?.value || '#969696',
    disclaimerSize: parseInt(document.getElementById('disclaimerSize')?.value || 10),
    disclaimerSpacingTop: parseInt(document.getElementById('disclaimerSpacingTop')?.value || 10),
    contactLineHeight: parseInt(document.getElementById('contactLineHeight')?.value || 24),
    socialSpacingTop: parseInt(document.getElementById('socialSpacingTop')?.value || 10),
    
    // Avatar size, shape, spacing, border
    avatarSize:        parseInt(document.getElementById('avatarSize')?.value || 60),
    avatarShape:       document.getElementById('avatarShape')?.value || 'circle',
    avatarSpacingTop:  parseInt(document.getElementById('avatarSpacingTop')?.value || 0),
    avatarBorderWidth: parseInt(document.getElementById('avatarBorderWidth')?.value || 0),
    avatarBorderColor: document.getElementById('avatarBorderColor')?.value || '#6366f1',
    
    // Logo size, shape, placement, spacing
    logoSize:      parseInt(document.getElementById('logoSize')?.value || 60),
    logoShape:     document.getElementById('logoShape')?.value || 'square',
    logoPlacement: document.getElementById('logoPlacement')?.value || 'details',
    logoSpacing:   parseInt(document.getElementById('logoSpacing')?.value || 10),
    
    // Social design options
    socialIconColorMode: document.getElementById('socialIconColorMode')?.value || 'brand',
    socialIconShape: document.getElementById('socialIconShape')?.value || 'circle',
    socialIconCustomColor: document.getElementById('socialIconCustomColor')?.value || '#6366f1',
    
    // Individual social normal/hover colors
    socialColor_linkedin: document.getElementById('socialColor_linkedin')?.value || '#0A66C2',
    socialHover_linkedin: document.getElementById('socialHover_linkedin')?.value || '#004b93',
    socialColor_twitter: document.getElementById('socialColor_twitter')?.value || '#000000',
    socialHover_twitter: document.getElementById('socialHover_twitter')?.value || '#222222',
    socialColor_instagram: document.getElementById('socialColor_instagram')?.value || '#E4405F',
    socialHover_instagram: document.getElementById('socialHover_instagram')?.value || '#c13584',
    socialColor_github: document.getElementById('socialColor_github')?.value || '#181717',
    socialHover_github: document.getElementById('socialHover_github')?.value || '#404040',
    socialColor_dribbble: document.getElementById('socialColor_dribbble')?.value || '#EA4C89',
    socialHover_dribbble: document.getElementById('socialHover_dribbble')?.value || '#c32361',
    socialColor_youtube: document.getElementById('socialColor_youtube')?.value || '#FF0000',
    socialHover_youtube: document.getElementById('socialHover_youtube')?.value || '#b30000',
    socialColor_calendly: document.getElementById('socialColor_calendly')?.value || '#006BFF',
    socialHover_calendly: document.getElementById('socialHover_calendly')?.value || '#004b93',
    socialColor_whatsapp: document.getElementById('socialColor_whatsapp')?.value || '#25D366',
    socialHover_whatsapp: document.getElementById('socialHover_whatsapp')?.value || '#128C7E',
    socialColor_behance: document.getElementById('socialColor_behance')?.value || '#1769ff',
    socialHover_behance: document.getElementById('socialHover_behance')?.value || '#004fd1',
    socialColor_substack: document.getElementById('socialColor_substack')?.value || '#FF6719',
    socialHover_substack: document.getElementById('socialHover_substack')?.value || '#d9520e',
    socialColor_pinterest: document.getElementById('socialColor_pinterest')?.value || '#BD081C',
    socialHover_pinterest: document.getElementById('socialHover_pinterest')?.value || '#990012',
  };
}

/** Populate all form fields from a profile's data object. */
function populateForm(profile) {
  if (!profile) return;
  const { data, options } = profile;

  const fields = [
    'firstName','lastName','jobTitle','department','company',
    'website','email','phone','address','tagline',
    'logoUrl', 'avatarExternalUrl', 'logoExternalUrl',
    'linkedin','twitter','instagram','github',
    'dribbble','youtube','calendly','whatsapp',
    'behance','substack','pinterest',
    'disclaimer',
  ];
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = data[f] || '';
  });

  // Avatar preview
  if (data.avatarExternalUrl) {
    setAvatarPreview(data.avatarExternalUrl, true);
  } else if (data.avatar) {
    setAvatarPreview(data.avatar, false);
  } else {
    clearAvatarPreview();
  }

  // Logo preview
  if (data.logoExternalUrl) {
    setLogoPreview(data.logoExternalUrl, true);
  } else if (data.logo) {
    setLogoPreview(data.logo, false);
  } else {
    clearLogoPreview();
  }

  // Custom typography colors
  const colorFields = ['colorName', 'colorJobTitle', 'colorCompany', 'colorContact', 'colorContactHover', 'colorTagline', 'colorDisclaimer'];
  colorFields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = options[f] || DEFAULT_PROFILE.options[f];
  });

  // Disclaimer size and spacing
  const disclaimerSizeRange = document.getElementById('disclaimerSize');
  if (disclaimerSizeRange) {
    disclaimerSizeRange.value = options.disclaimerSize || 10;
    document.getElementById('disclaimerSizeVal').textContent = (options.disclaimerSize || 10) + 'px';
  }
  const disclaimerSpacingTopRange = document.getElementById('disclaimerSpacingTop');
  if (disclaimerSpacingTopRange) {
    disclaimerSpacingTopRange.value = options.disclaimerSpacingTop !== undefined ? options.disclaimerSpacingTop : 10;
    document.getElementById('disclaimerSpacingTopVal').textContent = (options.disclaimerSpacingTop !== undefined ? options.disclaimerSpacingTop : 10) + 'px';
  }

  // Design options
  const fontSel = document.getElementById('fontFamily');
  if (fontSel) fontSel.value = options.fontFamily || 'Arial, Helvetica, sans-serif';

  const fontRange = document.getElementById('fontSize');
  if (fontRange) {
    fontRange.value = options.fontSize || 13;
    document.getElementById('fontSizeVal').textContent = (options.fontSize || 13) + 'px';
  }

  // Avatar size, shape, spacing, border
  const avatarSizeRange = document.getElementById('avatarSize');
  if (avatarSizeRange) {
    avatarSizeRange.value = options.avatarSize || 60;
    document.getElementById('avatarSizeVal').textContent = (options.avatarSize || 60) + 'px';
  }
  const avatarShapeSel = document.getElementById('avatarShape');
  if (avatarShapeSel) avatarShapeSel.value = options.avatarShape || 'circle';

  const avatarSpacingTopRange = document.getElementById('avatarSpacingTop');
  if (avatarSpacingTopRange) {
    avatarSpacingTopRange.value = options.avatarSpacingTop !== undefined ? options.avatarSpacingTop : 0;
    document.getElementById('avatarSpacingTopVal').textContent = (options.avatarSpacingTop !== undefined ? options.avatarSpacingTop : 0) + 'px';
  }

  const avatarBorderWidthRange = document.getElementById('avatarBorderWidth');
  if (avatarBorderWidthRange) {
    avatarBorderWidthRange.value = options.avatarBorderWidth !== undefined ? options.avatarBorderWidth : 0;
    document.getElementById('avatarBorderWidthVal').textContent = (options.avatarBorderWidth !== undefined ? options.avatarBorderWidth : 0) + 'px';
  }

  const avatarBorderColorInput = document.getElementById('avatarBorderColor');
  if (avatarBorderColorInput) avatarBorderColorInput.value = options.avatarBorderColor || '#6366f1';

  // Logo size, shape, placement, spacing
  const logoSizeRange = document.getElementById('logoSize');
  if (logoSizeRange) {
    logoSizeRange.value = options.logoSize || 60;
    document.getElementById('logoSizeVal').textContent = (options.logoSize || 60) + 'px';
  }
  const logoShapeSel = document.getElementById('logoShape');
  if (logoShapeSel) logoShapeSel.value = options.logoShape || 'square';

  const logoPlacementInput = document.getElementById('logoPlacement');
  if (logoPlacementInput) logoPlacementInput.value = options.logoPlacement || 'details';

  const logoSpacingRange = document.getElementById('logoSpacing');
  if (logoSpacingRange) {
    logoSpacingRange.value = options.logoSpacing !== undefined ? options.logoSpacing : 10;
    document.getElementById('logoSpacingVal').textContent = (options.logoSpacing !== undefined ? options.logoSpacing : 10) + 'px';
  }

  // Social options
  const socialColorModeSel = document.getElementById('socialIconColorMode');
  if (socialColorModeSel) {
    socialColorModeSel.value = options.socialIconColorMode || 'brand';
    toggleSocialCustomColorRow(options.socialIconColorMode === 'custom');
  }
  const socialShapeSel = document.getElementById('socialIconShape');
  if (socialShapeSel) socialShapeSel.value = options.socialIconShape || 'circle';

  const contactIconShapeSel = document.getElementById('contactIconShape');
  if (contactIconShapeSel) contactIconShapeSel.value = options.contactIconShape || 'square';

  const contactIconColorInput = document.getElementById('contactIconColor');
  if (contactIconColorInput) contactIconColorInput.value = options.contactIconColor || '#6366f1';
  
  const socialCustomColorInput = document.getElementById('socialIconCustomColor');
  if (socialCustomColorInput) socialCustomColorInput.value = options.socialIconCustomColor || '#6366f1';

  // Advanced spacing
  const contactLineHeightRange = document.getElementById('contactLineHeight');
  if (contactLineHeightRange) {
    contactLineHeightRange.value = options.contactLineHeight !== undefined ? options.contactLineHeight : 24;
    document.getElementById('contactLineHeightVal').textContent = (options.contactLineHeight !== undefined ? options.contactLineHeight : 24) + 'px';
  }

  const socialSpacingTopRange = document.getElementById('socialSpacingTop');
  if (socialSpacingTopRange) {
    socialSpacingTopRange.value = options.socialSpacingTop !== undefined ? options.socialSpacingTop : 10;
    document.getElementById('socialSpacingTopVal').textContent = (options.socialSpacingTop !== undefined ? options.socialSpacingTop : 10) + 'px';
  }

  // Individual social colors
  const socialKeys = ['linkedin', 'twitter', 'instagram', 'github', 'dribbble', 'youtube', 'calendly', 'whatsapp', 'behance', 'substack', 'pinterest'];
  socialKeys.forEach(key => {
    const normalInput = document.getElementById(`socialColor_${key}`);
    if (normalInput) normalInput.value = options[`socialColor_${key}`] || DEFAULT_PROFILE.options[`socialColor_${key}`];
    
    const hoverInput = document.getElementById(`socialHover_${key}`);
    if (hoverInput) hoverInput.value = options[`socialHover_${key}`] || DEFAULT_PROFILE.options[`socialHover_${key}`];
  });

  const toggles = ['showDivider','showAvatar','showLogo','showIcons','showTagline','showDisclaimer','showContactIcons'];
  toggles.forEach(key => {
    const el = document.getElementById(key);
    if (el) el.checked = options[key] ?? (key === 'showContactIcons' ? false : true);
  });

  // Apply template selection
  selectTemplate(options.template || 'minimal', false);

  // Apply accent color
  const accent = options.accentColor || '#6366f1';
  PreviewRenderer.setAccentColor(accent);
  const cp = document.getElementById('customColor');
  if (cp) cp.value = accent;

  // Sync companion text fields
  syncAllColorTexts();
}

/* ══════════════════════════════════════════════════════════════════
   RENDER LOOP
   ══════════════════════════════════════════════════════════════════ */

/**
 * Master render function — reads current form state,
 * generates signature HTML, and pushes it to the preview.
 * Debounced for performance during rapid typing.
 */
const renderSignature = Utils.debounce(function () {
  const data    = readFormData();
  const options = readOptions();

  // Check if any meaningful content exists
  const hasContent = data.firstName || data.lastName || data.company || data.jobTitle;

  if (!hasContent) {
    PreviewRenderer.showEmptyState();
    return;
  }

  // Merge avatar & logo from state/inputs (external URL takes precedence over base64)
  data.avatar     = data.avatarExternalUrl || State.active?.data?.avatar || null;
  data.showAvatar = options.showAvatar;
  data.logo       = data.logoExternalUrl || State.active?.data?.logo || null;
  data.showLogo   = options.showLogo;

  // Update UI Previews based on presence of external URL or fallback base64
  if (data.avatarExternalUrl) {
    setAvatarPreview(data.avatarExternalUrl, true);
  } else if (State.active?.data?.avatar) {
    setAvatarPreview(State.active.data.avatar, false);
  } else {
    clearAvatarPreview();
  }

  if (data.logoExternalUrl) {
    setLogoPreview(data.logoExternalUrl, true);
  } else if (State.active?.data?.logo) {
    setLogoPreview(State.active.data.logo, false);
  } else {
    clearLogoPreview();
  }

  const html      = SignatureGenerator.generate(data, options);
  const plainText = SignatureGenerator.generatePlainText(data, options);

  PreviewRenderer.render(html);

  // Persist current state to active profile
  if (State.active) {
    State.active.data    = { ...State.active.data, ...data };
    State.active.options = { ...options };
    saveProfiles();
  }

  // Expose current signature for copy utils
  window.__currentHtml      = html;
  window.__currentPlainText = plainText;
}, 120);

/* ══════════════════════════════════════════════════════════════════
   PROFILE MANAGEMENT
   ══════════════════════════════════════════════════════════════════ */

function loadProfiles() {
  const saved = Utils.storage.get(STORAGE_KEY_PROFILES);
  if (saved && Array.isArray(saved) && saved.length) {
    State.profiles = saved.map(profile => {
      // Ensure missing/new properties from DEFAULT_PROFILE are initialized
      profile.data = { ...DEFAULT_PROFILE.data, ...profile.data };
      profile.options = { ...DEFAULT_PROFILE.options, ...profile.options };
      
      // Ensure correct color initialization for new social networks in old profiles
      const newKeys = ['behance', 'substack', 'pinterest'];
      newKeys.forEach(key => {
        if (profile.options[`socialColor_${key}`] === undefined || profile.options[`socialColor_${key}`] === null || profile.options[`socialColor_${key}`] === '') {
          profile.options[`socialColor_${key}`] = DEFAULT_PROFILE.options[`socialColor_${key}`];
        }
        if (profile.options[`socialHover_${key}`] === undefined || profile.options[`socialHover_${key}`] === null || profile.options[`socialHover_${key}`] === '') {
          profile.options[`socialHover_${key}`] = DEFAULT_PROFILE.options[`socialHover_${key}`];
        }
      });
      
      // If disclaimer is missing or empty, populate with DEFAULT_PROFILE disclaimer
      if (profile.data.disclaimer === undefined || profile.data.disclaimer === null || profile.data.disclaimer === '') {
        profile.data.disclaimer = DEFAULT_PROFILE.data.disclaimer;
      }
      if (profile.options.disclaimerSize === undefined) {
        profile.options.disclaimerSize = 10;
      }
      if (profile.options.disclaimerSpacingTop === undefined) {
        profile.options.disclaimerSpacingTop = 10;
      }
      if (profile.options.showContactIcons === undefined) {
        profile.options.showContactIcons = false;
      }
      if (profile.options.contactIconShape === undefined) {
        profile.options.contactIconShape = 'square';
      }
      return profile;
    });
  } else {
    State.profiles = [Utils.deepClone(DEFAULT_PROFILE)];
  }
  State.activeId = Utils.storage.get(STORAGE_KEY_ACTIVE) || State.profiles[0].id;
  // Ensure activeId is valid
  if (!State.profiles.find(p => p.id === State.activeId)) {
    State.activeId = State.profiles[0].id;
  }
}

function saveProfiles() {
  Utils.storage.set(STORAGE_KEY_PROFILES, State.profiles);
  Utils.storage.set(STORAGE_KEY_ACTIVE, State.activeId);
}

function createProfile(name) {
  const profile = Utils.deepClone(DEFAULT_PROFILE);
  profile.id   = Utils.uid();
  profile.name = name || 'New Signature';
  State.profiles.push(profile);
  switchProfile(profile.id);
}

function switchProfile(id) {
  State.activeId = id;
  saveProfiles();
  populateForm(State.active);
  renderSignature();
  renderProfileList();
  updateProfileButton();
  closeProfileDropdown();
}

function deleteProfile(id) {
  if (State.profiles.length <= 1) {
    Utils.showToast('⚠ You need at least one signature profile.');
    return;
  }
  State.profiles = State.profiles.filter(p => p.id !== id);
  if (State.activeId === id) {
    State.activeId = State.profiles[0].id;
    populateForm(State.active);
    renderSignature();
  }
  saveProfiles();
  renderProfileList();
  updateProfileButton();
}

function renameProfile(id, newName) {
  const p = State.profiles.find(p => p.id === id);
  if (p) {
    p.name = newName.trim() || p.name;
    saveProfiles();
    renderProfileList();
    updateProfileButton();
  }
}

function renderProfileList() {
  const list = document.getElementById('profileList');
  if (!list) return;
  list.innerHTML = '';

  State.profiles.forEach(profile => {
    const item = document.createElement('div');
    item.className = 'ef-profile-item' + (profile.id === State.activeId ? ' active' : '');
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', profile.id === State.activeId);
    item.innerHTML = `
      <span class="ef-profile-name">${Utils.escapeHtml(profile.name)}</span>
      <span class="ef-profile-item-actions">
        <button class="ef-profile-action-btn rename" title="Rename" aria-label="Rename ${Utils.escapeHtml(profile.name)}">✎</button>
        <button class="ef-profile-action-btn del" title="Delete" aria-label="Delete ${Utils.escapeHtml(profile.name)}">✕</button>
      </span>`;

    item.addEventListener('click', e => {
      if (e.target.classList.contains('del')) {
        deleteProfile(profile.id);
        return;
      }
      if (e.target.classList.contains('rename')) {
        openModal('rename', profile.id, profile.name);
        return;
      }
      switchProfile(profile.id);
    });

    list.appendChild(item);
  });
}

function updateProfileButton() {
  const nameEl = document.getElementById('activeProfileName');
  if (nameEl && State.active) nameEl.textContent = State.active.name;
}

/* ══════════════════════════════════════════════════════════════════
   TEMPLATE SELECTION
   ══════════════════════════════════════════════════════════════════ */

function renderTemplateGrid() {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  SignatureGenerator.getTemplates().forEach(tmpl => {
    const card = document.createElement('div');
    card.className    = 'ef-template-card';
    card.dataset.tmpl = tmpl.id;
    card.setAttribute('role', 'option');
    card.setAttribute('aria-label', `${tmpl.label} template`);
    card.setAttribute('tabindex', '0');

    const currentAccent = State.active?.options?.accentColor || '#6366f1';
    const thumbHtml     = SignatureGenerator.getThumbnailHtml(tmpl.id, currentAccent);

    card.innerHTML = `
      <div class="ef-template-preview">
        <div class="ef-template-mini">${thumbHtml}</div>
      </div>
      <span>${tmpl.label}</span>`;

    card.addEventListener('click', () => selectTemplate(tmpl.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTemplate(tmpl.id);
      }
    });

    grid.appendChild(card);
  });
}

function selectTemplate(id, rerender = true) {
  // Update active profile option
  if (State.active) State.active.options.template = id;

  // Update UI selection state
  document.querySelectorAll('.ef-template-card').forEach(card => {
    const isActive = card.dataset.tmpl === id;
    card.classList.toggle('selected', isActive);
    card.setAttribute('aria-selected', isActive);
  });

  if (rerender) renderSignature();
}

/* ══════════════════════════════════════════════════════════════════
   COLOR PRESETS
   ══════════════════════════════════════════════════════════════════ */

function renderColorPresets() {
  const container = document.getElementById('colorPresets');
  if (!container) return;
  container.innerHTML = '';

  COLOR_PRESETS.forEach(({ hex, name }) => {
    const swatch = document.createElement('button');
    swatch.className        = 'ef-color-swatch';
    swatch.dataset.color    = hex;
    swatch.style.background = hex;
    swatch.title            = name;
    swatch.setAttribute('aria-label', `${name} accent color`);
    swatch.setAttribute('role', 'option');

    swatch.addEventListener('click', () => applyAccentColor(hex));
    container.appendChild(swatch);
  });
}

function applyAccentColor(hex) {
  if (State.active) State.active.options.accentColor = hex;
  PreviewRenderer.setAccentColor(hex);
  const cp = document.getElementById('customColor');
  if (cp) cp.value = hex;
  // Refresh template thumbnails with new color
  renderTemplateGrid();
  renderSignature();
  // Sync companion text fields
  syncAllColorTexts();
}

/* ══════════════════════════════════════════════════════════════════
   TAB NAVIGATION
   ══════════════════════════════════════════════════════════════════ */

function initTabs() {
  document.querySelectorAll('.ef-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab.dataset.tab);
      }
    });
  });
}

function activateTab(tabId) {
  document.querySelectorAll('.ef-tab').forEach(t => {
    const isActive = t.dataset.tab === tabId;
    t.classList.toggle('ef-tab-active', isActive);
    t.setAttribute('aria-selected', isActive);
  });
  document.querySelectorAll('.ef-tab-panel').forEach(p => {
    const isActive = p.id === `panel-${tabId}`;
    p.classList.toggle('ef-tab-panel-active', isActive);
    p.hidden = !isActive;
  });
}

/* ══════════════════════════════════════════════════════════════════
   AVATAR & LOGO UPLOAD (WITH CROPPER.JS)
   ══════════════════════════════════════════════════════════════════ */

function initImageCropper() {
  const cropModal = document.getElementById('cropModalOverlay');
  const cropImgSrc = document.getElementById('cropImageSource');
  const cancelBtn = document.getElementById('cancelCropModal');
  const saveBtn = document.getElementById('saveCropModal');
  
  const avatarInput = document.getElementById('avatarUpload');
  const avatarRemoveBtn = document.getElementById('removeAvatar');
  const avatarCropBtn = document.getElementById('cropAvatarBtn');
  
  const logoInput = document.getElementById('logoUpload');
  const logoRemoveBtn = document.getElementById('removeLogo');
  const logoCropBtn = document.getElementById('cropLogoBtn');

  let activeCropper = null;
  let cropTarget = null; // 'avatar' | 'logo'

  // Helper to open modal and start cropper
  function openCropModal(imageSrc, target) {
    cropTarget = target;
    cropImgSrc.src = imageSrc;
    cropModal.hidden = false;
    
    if (activeCropper) {
      activeCropper.destroy();
      activeCropper = null;
    }
    
    const aspectRatio = target === 'avatar' ? 1 : NaN;
    
    // Tiny delay to ensure modal display completes
    setTimeout(() => {
      activeCropper = new Cropper(cropImgSrc, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        autoCropArea: 0.95,
        responsive: true,
        restore: false,
        checkOrientation: false,
      });
    }, 50);
  }

  // Avatar Upload Handler
  if (avatarInput) {
    avatarInput.addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        Utils.showToast('⚠ Image too large — please use an image under 2 MB.');
        return;
      }
      try {
        const dataUrl = await Utils.readFileAsDataURL(file);
        if (State.active) {
          State.active.data.originalAvatar = dataUrl;
        }
        openCropModal(dataUrl, 'avatar');
        avatarInput.value = '';
      } catch {
        Utils.showToast('⚠ Could not read image file.');
      }
    });
  }

  // Logo Upload Handler
  if (logoInput) {
    logoInput.addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        Utils.showToast('⚠ Image too large — please use an image under 2 MB.');
        return;
      }
      try {
        const dataUrl = await Utils.readFileAsDataURL(file);
        if (State.active) {
          State.active.data.originalLogo = dataUrl;
        }
        openCropModal(dataUrl, 'logo');
        logoInput.value = '';
      } catch {
        Utils.showToast('⚠ Could not read image file.');
      }
    });
  }

  // Manual Crop Button Clicks
  if (avatarCropBtn) {
    avatarCropBtn.addEventListener('click', () => {
      const original = State.active?.data?.originalAvatar || State.active?.data?.avatar;
      if (original) {
        openCropModal(original, 'avatar');
      }
    });
  }

  if (logoCropBtn) {
    logoCropBtn.addEventListener('click', () => {
      const original = State.active?.data?.originalLogo || State.active?.data?.logo;
      if (original) {
        openCropModal(original, 'logo');
      }
    });
  }

  // Remove buttons
  if (avatarRemoveBtn) {
    avatarRemoveBtn.addEventListener('click', () => {
      clearAvatarPreview();
      const urlInput = document.getElementById('avatarExternalUrl');
      if (urlInput) urlInput.value = '';
      if (State.active) {
        State.active.data.avatar = null;
        State.active.data.originalAvatar = null;
        State.active.data.avatarExternalUrl = '';
      }
      renderSignature();
    });
  }

  if (logoRemoveBtn) {
    logoRemoveBtn.addEventListener('click', () => {
      clearLogoPreview();
      const urlInput = document.getElementById('logoExternalUrl');
      if (urlInput) urlInput.value = '';
      if (State.active) {
        State.active.data.logo = null;
        State.active.data.originalLogo = null;
        State.active.data.logoExternalUrl = '';
      }
      renderSignature();
    });
  }

  // Close modal
  function closeCropModal() {
    cropModal.hidden = true;
    if (activeCropper) {
      activeCropper.destroy();
      activeCropper = null;
    }
  }

  if (cancelBtn) cancelBtn.addEventListener('click', closeCropModal);
  if (cropModal) {
    cropModal.addEventListener('click', e => {
      if (e.target === cropModal) closeCropModal();
    });
  }

  // Apply Crop and Save
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!activeCropper) return;
      const canvas = activeCropper.getCroppedCanvas({
        maxWidth: 500,
        maxHeight: 500,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      const mimeType = cropTarget === 'logo' ? 'image/png' : 'image/jpeg';
      const croppedUrl = canvas.toDataURL(mimeType, mimeType === 'image/jpeg' ? 0.95 : undefined);

      if (State.active) {
        if (cropTarget === 'avatar') {
          State.active.data.avatar = croppedUrl;
          setAvatarPreview(croppedUrl);
        } else if (cropTarget === 'logo') {
          State.active.data.logo = croppedUrl;
          setLogoPreview(croppedUrl);
        }
      }

      renderSignature();
      closeCropModal();
    });
  }
}

function setAvatarPreview(dataUrl, isExternal = false) {
  const preview   = document.getElementById('avatarPreview');
  const removeBtn = document.getElementById('removeAvatar');
  const cropBtn   = document.getElementById('cropAvatarBtn');
  if (!preview) return;
  preview.innerHTML = `<img src="${dataUrl}" alt="Avatar preview" />`;
  if (removeBtn) removeBtn.style.display = 'inline-flex';
  if (cropBtn) cropBtn.style.display = isExternal ? 'none' : 'inline-flex';
}

function clearAvatarPreview() {
  const preview   = document.getElementById('avatarPreview');
  const removeBtn = document.getElementById('removeAvatar');
  const cropBtn   = document.getElementById('cropAvatarBtn');
  if (preview) preview.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  if (removeBtn) removeBtn.style.display = 'none';
  if (cropBtn) cropBtn.style.display = 'none';
}

function setLogoPreview(dataUrl, isExternal = false) {
  const preview = document.getElementById('logoPreview');
  const removeBtn = document.getElementById('removeLogo');
  const cropBtn = document.getElementById('cropLogoBtn');
  if (!preview) return;
  preview.innerHTML = `<img src="${dataUrl}" alt="Logo preview" style="object-fit: contain; width: 100%; height: 100%;" />`;
  if (removeBtn) removeBtn.style.display = 'inline-flex';
  if (cropBtn) cropBtn.style.display = isExternal ? 'none' : 'inline-flex';
}

function clearLogoPreview() {
  const preview = document.getElementById('logoPreview');
  const removeBtn = document.getElementById('removeLogo');
  const cropBtn = document.getElementById('cropLogoBtn');
  if (preview) preview.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 17L10 12L13 15L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (removeBtn) removeBtn.style.display = 'none';
  if (cropBtn) cropBtn.style.display = 'none';
}

function toggleSocialCustomColorRow(show) {
  const row = document.getElementById('socialIconCustomColorRow');
  if (row) row.style.display = show ? 'block' : 'none';
}

/* ══════════════════════════════════════════════════════════════════
   PROFILE DROPDOWN
   ══════════════════════════════════════════════════════════════════ */

function initProfileDropdown() {
  const btn      = document.getElementById('profileMenuBtn');
  const dropdown = document.getElementById('profileDropdown');
  const newBtn   = document.getElementById('newProfileBtn');

  if (btn) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      if (isOpen) closeProfileDropdown();
      else openProfileDropdown();
    });
  }

  if (newBtn) {
    newBtn.addEventListener('click', e => {
      e.stopPropagation();
      openModal('new');
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.ef-profile-selector')) {
      closeProfileDropdown();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProfileDropdown();
  });
}

function openProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const btn      = document.getElementById('profileMenuBtn');
  if (dropdown) dropdown.classList.add('open');
  if (btn)      btn.setAttribute('aria-expanded', 'true');
}

function closeProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const btn      = document.getElementById('profileMenuBtn');
  if (dropdown) dropdown.classList.remove('open');
  if (btn)      btn.setAttribute('aria-expanded', 'false');
}

/* ══════════════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════════════ */

function openModal(mode, profileId = null, currentName = '') {
  State.pendingModal = { mode, profileId };
  const overlay = document.getElementById('modalOverlay');
  const input   = document.getElementById('profileNameInput');
  const title   = overlay?.querySelector('.ef-modal-title');
  const desc    = overlay?.querySelector('.ef-modal-desc');

  if (title) title.textContent = mode === 'new' ? 'New Signature Profile' : 'Rename Profile';
  if (desc)  desc.textContent  = mode === 'new'
    ? 'Give this profile a name so you can find it easily later.'
    : `Rename "${currentName}" to something new.`;
  if (input) {
    input.value = mode === 'rename' ? currentName : '';
    setTimeout(() => input.focus(), 100);
  }
  if (overlay) overlay.hidden = false;
  closeProfileDropdown();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.hidden = true;
  State.pendingModal = null;
}

function confirmModal() {
  const input = document.getElementById('profileNameInput');
  const name  = input?.value?.trim();
  if (!name) { input?.focus(); return; }

  const { mode, profileId } = State.pendingModal || {};
  if (mode === 'new') createProfile(name);
  else if (mode === 'rename' && profileId) renameProfile(profileId, name);

  closeModal();
}

function initModal() {
  document.getElementById('saveModal')?.addEventListener('click', confirmModal);
  document.getElementById('cancelModal')?.addEventListener('click', closeModal);
  document.getElementById('profileNameInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmModal();
    if (e.key === 'Escape') closeModal();
  });
  document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

/* ══════════════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════════════ */

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Restore saved theme
  const savedTheme = Utils.storage.get(STORAGE_KEY_THEME, 'dark');
  if (savedTheme === 'light') {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      Utils.storage.set(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    });
  }
}

/* ══════════════════════════════════════════════════════════════════
   FORM EVENT BINDING
   ══════════════════════════════════════════════════════════════════ */

function bindFormInputs() {
  // All text inputs + selects → debounced re-render
  const allInputs = document.querySelectorAll(
    '.ef-input:not([type="file"]):not([type="color"]), .ef-select'
  );
  allInputs.forEach(el => {
    el.addEventListener('input',  renderSignature);
    el.addEventListener('change', renderSignature);
  });

  // Font size range
  const fontRange = document.getElementById('fontSize');
  const fontVal   = document.getElementById('fontSizeVal');
  if (fontRange) {
    fontRange.addEventListener('input', () => {
      if (fontVal) fontVal.textContent = fontRange.value + 'px';
      renderSignature();
    });
  }

  // Avatar size range
  const avatarSizeRange = document.getElementById('avatarSize');
  const avatarSizeVal   = document.getElementById('avatarSizeVal');
  if (avatarSizeRange) {
    avatarSizeRange.addEventListener('input', () => {
      if (avatarSizeVal) avatarSizeVal.textContent = avatarSizeRange.value + 'px';
      renderSignature();
    });
  }

  // Logo size range
  const logoSizeRange = document.getElementById('logoSize');
  const logoSizeVal   = document.getElementById('logoSizeVal');
  if (logoSizeRange) {
    logoSizeRange.addEventListener('input', () => {
      if (logoSizeVal) logoSizeVal.textContent = logoSizeRange.value + 'px';
      renderSignature();
    });
  }

  // Avatar top spacing slider
  const avatarSpacingTopRange = document.getElementById('avatarSpacingTop');
  const avatarSpacingTopVal   = document.getElementById('avatarSpacingTopVal');
  if (avatarSpacingTopRange) {
    avatarSpacingTopRange.addEventListener('input', () => {
      if (avatarSpacingTopVal) avatarSpacingTopVal.textContent = avatarSpacingTopRange.value + 'px';
      renderSignature();
    });
  }

  // Avatar border width slider
  const avatarBorderWidthRange = document.getElementById('avatarBorderWidth');
  const avatarBorderWidthVal   = document.getElementById('avatarBorderWidthVal');
  if (avatarBorderWidthRange) {
    avatarBorderWidthRange.addEventListener('input', () => {
      if (avatarBorderWidthVal) avatarBorderWidthVal.textContent = avatarBorderWidthRange.value + 'px';
      renderSignature();
    });
  }

  // Logo spacing slider
  const logoSpacingRange = document.getElementById('logoSpacing');
  const logoSpacingVal   = document.getElementById('logoSpacingVal');
  if (logoSpacingRange) {
    logoSpacingRange.addEventListener('input', () => {
      if (logoSpacingVal) logoSpacingVal.textContent = logoSpacingRange.value + 'px';
      renderSignature();
    });
  }

  // Disclaimer size slider
  const disclaimerSizeRange = document.getElementById('disclaimerSize');
  const disclaimerSizeVal   = document.getElementById('disclaimerSizeVal');
  if (disclaimerSizeRange) {
    disclaimerSizeRange.addEventListener('input', () => {
      if (disclaimerSizeVal) disclaimerSizeVal.textContent = disclaimerSizeRange.value + 'px';
      renderSignature();
    });
  }

  // Disclaimer top spacing slider
  const disclaimerSpacingTopRange = document.getElementById('disclaimerSpacingTop');
  const disclaimerSpacingTopVal   = document.getElementById('disclaimerSpacingTopVal');
  if (disclaimerSpacingTopRange) {
    disclaimerSpacingTopRange.addEventListener('input', () => {
      if (disclaimerSpacingTopVal) disclaimerSpacingTopVal.textContent = disclaimerSpacingTopRange.value + 'px';
      renderSignature();
    });
  }

  // Contact row spacing slider
  const contactLineHeightRange = document.getElementById('contactLineHeight');
  const contactLineHeightVal   = document.getElementById('contactLineHeightVal');
  if (contactLineHeightRange) {
    contactLineHeightRange.addEventListener('input', () => {
      if (contactLineHeightVal) contactLineHeightVal.textContent = contactLineHeightRange.value + 'px';
      renderSignature();
    });
  }

  // Socials top spacing slider
  const socialSpacingTopRange = document.getElementById('socialSpacingTop');
  const socialSpacingTopVal   = document.getElementById('socialSpacingTopVal');
  if (socialSpacingTopRange) {
    socialSpacingTopRange.addEventListener('input', () => {
      if (socialSpacingTopVal) socialSpacingTopVal.textContent = socialSpacingTopRange.value + 'px';
      renderSignature();
    });
  }

  // All custom color pickers (typography & avatar border & individual social colors)
  const socialKeys = ['linkedin', 'twitter', 'instagram', 'github', 'dribbble', 'youtube', 'calendly', 'whatsapp', 'behance', 'substack', 'pinterest'];
  const allColorPickers = ['colorName', 'colorJobTitle', 'colorCompany', 'colorContact', 'colorContactHover', 'colorTagline', 'colorDisclaimer', 'avatarBorderColor', 'socialIconCustomColor', 'contactIconColor'];
  socialKeys.forEach(key => {
    allColorPickers.push(`socialColor_${key}`);
    allColorPickers.push(`socialHover_${key}`);
  });

  allColorPickers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', Utils.throttle(() => {
        renderSignature();
      }, 80));
    }
  });

  // Selects and custom shape selectors
  const allSelectors = ['avatarShape', 'logoShape', 'showLogo', 'logoPlacement', 'socialIconColorMode', 'socialIconShape', 'contactIconShape'];
  allSelectors.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (id === 'socialIconColorMode') {
          toggleSocialCustomColorRow(el.value === 'custom');
        }
        renderSignature();
      });
    }
  });

  // Toggle switches
  ['showDivider','showAvatar','showIcons','showTagline','showDisclaimer','showContactIcons'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderSignature);
  });

  // Custom color picker
  const colorPicker = document.getElementById('customColor');
  if (colorPicker) {
    colorPicker.addEventListener('input', Utils.throttle(e => {
      applyAccentColor(e.target.value);
    }, 80));
  }
}

/* ══════════════════════════════════════════════════════════════════
   GLOBAL EVENT LISTENERS (cross-module)
   ══════════════════════════════════════════════════════════════════ */

function bindGlobalEvents() {
  // AI module applied data → re-render + switch tab
  document.addEventListener('ef:aiApplied', e => {
    const { template, accentColor } = e.detail;
    if (template)     selectTemplate(template, false);
    if (accentColor)  applyAccentColor(accentColor);
    renderSignature();
  });

  // AI module requests tab switch
  document.addEventListener('ef:switchTab', e => {
    activateTab(e.detail.tab);
  });

  // Preview renderer client changed → re-render (client font change)
  document.addEventListener('ef:clientChanged', () => renderSignature());
}

/* ══════════════════════════════════════════════════════════════════
   COPY UTILS INIT
   ══════════════════════════════════════════════════════════════════ */

function initCopyUtils() {
  CopyUtils.init(
    () => window.__currentHtml      || '',
    () => window.__currentPlainText || ''
  );
}

/* ══════════════════════════════════════════════════════════════════
   DATE FORMATTER & EXPORT DIRECTORY MANAGER
   ══════════════════════════════════════════════════════════════════ */

function getFormattedDate() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const ExportDirManager = (() => {
  const DB_NAME = 'ef_export_settings';
  const DB_VERSION = 1;
  const STORE_NAME = 'settings';
  const KEY_DIR_HANDLE = 'exportDirHandle';

  let dirHandle = null;

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getSetting(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function setSetting(key, val) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function init() {
    try {
      if (window.showDirectoryPicker) {
        dirHandle = await getSetting(KEY_DIR_HANDLE);
        const folderBtn = document.getElementById('setExportDirBtn');
        if (folderBtn) {
          folderBtn.style.display = 'flex';
          folderBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await selectDirectory();
          });
        }
      }
    } catch (err) {
      console.warn('Error loading export directory handle:', err);
    }
  }

  async function selectDirectory() {
    try {
      dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      await setSetting(KEY_DIR_HANDLE, dirHandle);
      Utils.showToast('✓ Folder configured successfully!');
      closeProfileDropdown();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Directory selection failed:', err);
        Utils.showToast('⚠ Failed to configure directory.');
      }
    }
  }

  async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    try {
      if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
      }
      if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
      }
    } catch (err) {
      console.error('Permission request failed:', err);
    }
    return false;
  }

  async function autoWriteFile(filename, content) {
    if (!dirHandle) return false;
    try {
      const hasPermission = await verifyPermission(dirHandle, true);
      if (!hasPermission) {
        console.warn('Permission denied to access configured directory.');
        return false;
      }
      
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return true;
    } catch (err) {
      console.error('Failed to auto-write file to configured directory:', err);
      return false;
    }
  }

  return {
    init,
    autoWriteFile,
    hasConfigured: () => !!dirHandle
  };
})();

/* ══════════════════════════════════════════════════════════════════
   BACKUP & EXPORT ACTIONS
   ══════════════════════════════════════════════════════════════════ */

function initBackupActions() {
  const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
  const exportBackupBtn = document.getElementById('exportBackupBtn');
  const importBackupBtn = document.getElementById('importBackupBtn');
  const importBackupInput = document.getElementById('importBackupInput');

  // 1. Download HTML signature
  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener('click', async () => {
      const html = window.__currentHtml || '';
      if (!html) {
        Utils.showToast('⚠ Nothing to save. Please fill out some fields first.');
        return;
      }
      
      // Rewrite relative icon paths to absolute for export
      const cleanHtml = CopyUtils.sanitise ? CopyUtils.sanitise(html) : html;
      
      const profileName = (State.active ? State.active.name : 'signature').toLowerCase().replace(/\s+/g, '_');
      const formattedDate = getFormattedDate();
      const filename = `${profileName}_signature_${formattedDate}.html`;

      // Try auto-saving to local directory if configured
      let autoSaved = false;
      if (ExportDirManager.hasConfigured()) {
        autoSaved = await ExportDirManager.autoWriteFile(filename, cleanHtml);
      }
      
      const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (autoSaved) {
        Utils.showToast(`✓ Saved to /exported-signatures/${filename} and browser downloads!`);
      } else {
        Utils.showToast(`✓ Signature HTML file downloaded as ${filename}!`);
      }
      Utils.flashButton(downloadHtmlBtn, '✓ Saved!');
    });
  }

  // 2. Export Profiles JSON Backup
  if (exportBackupBtn) {
    exportBackupBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // prevent dropdown close
      
      if (!State.profiles || !State.profiles.length) {
        Utils.showToast('⚠ No profiles to backup.');
        return;
      }
      
      const backupData = JSON.stringify(State.profiles, null, 2);
      const formattedDate = getFormattedDate();
      const filename = `signatures_backup_${formattedDate}.json`;

      // Try auto-saving to local directory if configured
      let autoSaved = false;
      if (ExportDirManager.hasConfigured()) {
        autoSaved = await ExportDirManager.autoWriteFile(filename, backupData);
      }
      
      const blob = new Blob([backupData], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (autoSaved) {
        Utils.showToast(`✓ Backup saved to /exported-signatures/${filename} and browser downloads!`);
      } else {
        Utils.showToast(`✓ Backup downloaded as ${filename}!`);
      }
      closeProfileDropdown();
    });
  }

  // 3. Import Profiles JSON Backup
  if (importBackupBtn && importBackupInput) {
    importBackupBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent dropdown close
      importBackupInput.click();
    });

    importBackupInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const parsed = JSON.parse(evt.target.result);
          
          // Validate backup format
          const isValid = Array.isArray(parsed) && parsed.length > 0 && parsed.every(p => p.id && p.name && p.data && p.options);
          
          if (isValid) {
            State.profiles = parsed;
            // Select the first imported profile as active
            State.activeId = parsed[0].id;
            saveProfiles();
            
            // Repopulate form and re-render everything completely
            populateForm(State.active);
            renderSignature();
            renderProfileList();
            updateProfileButton();
            
            Utils.showToast('✓ All signature profiles restored successfully!');
          } else {
            Utils.showToast('⚠ Invalid backup file structure. Must contain signature profiles.');
          }
        } catch(err) {
          console.error(err);
          Utils.showToast('⚠ Error parsing backup JSON file.');
        }
        
        // Reset file input so the same file can be selected again
        importBackupInput.value = '';
        closeProfileDropdown();
      };
      
      reader.readAsText(file);
    });
  }
}

/* ─── COLOR PICKERS HEX COMPANIONS ───────────────────────────── */

function initColorPickersHexCompanion() {
  document.querySelectorAll('input[type="color"]').forEach(colorInput => {
    // Avoid double initialization
    if (colorInput.nextSibling && colorInput.nextSibling.classList && (colorInput.nextSibling.classList.contains('ef-color-text-input') || colorInput.nextSibling.classList.contains('ef-color-text-input-small'))) {
      return;
    }

    const textInput = document.createElement('input');
    textInput.type = 'text';
    
    // Choose appropriate class name depending on size
    const isSmall = colorInput.classList.contains('ef-field-color-picker');
    textInput.className = isSmall ? 'ef-color-text-input-small' : 'ef-color-text-input';
    textInput.value = colorInput.value.replace('#', '').toUpperCase();
    textInput.placeholder = 'FFF';
    textInput.maxLength = 6;
    textInput.title = 'Color HEX';

    // Insert text input directly after the color input
    colorInput.parentNode.insertBefore(textInput, colorInput.nextSibling);

    // Sync from color picker to text field
    colorInput.addEventListener('input', () => {
      textInput.value = colorInput.value.replace('#', '').toUpperCase();
    });

    // Sync from text field to color picker (validation + cleaning)
    textInput.addEventListener('input', () => {
      let val = textInput.value.trim().toUpperCase();
      // Remove leading hash if typed or pasted
      if (val.startsWith('#')) {
        val = val.substring(1);
      }
      // Remove any non-hex characters
      val = val.replace(/[^0-9A-F]/g, '');
      textInput.value = val;

      if (val.length === 3 || val.length === 6) {
        let hexColor = '#' + val;
        if (val.length === 3) {
          hexColor = '#' + val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
        }
        colorInput.value = hexColor;
        // Trigger both input and change events to update the rendering and active profile state
        colorInput.dispatchEvent(new Event('input', { bubbles: true }));
        colorInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Clean formatting on blur
    textInput.addEventListener('blur', () => {
      textInput.value = colorInput.value.replace('#', '').toUpperCase();
    });
  });
}

function syncAllColorTexts() {
  document.querySelectorAll('input[type="color"]').forEach(colorInput => {
    const textInput = colorInput.nextSibling;
    if (textInput && textInput.classList && (textInput.classList.contains('ef-color-text-input') || textInput.classList.contains('ef-color-text-input-small'))) {
      textInput.value = colorInput.value.replace('#', '').toUpperCase();
    }
  });
}

/* ══════════════════════════════════════════════════════════════════
   BOOTSTRAP
   ══════════════════════════════════════════════════════════════════ */

function boot() {
  // 1. Theme
  initThemeToggle();

  // 2. Load persisted profiles
  loadProfiles();

  // 3. Build UI components
  renderColorPresets();
  renderTemplateGrid();
  renderProfileList();
  updateProfileButton();

  // 4. Populate form from active profile
  populateForm(State.active);

  // 5. Wire up all interactions
  initTabs();
  bindFormInputs();
  initColorPickersHexCompanion();
  initImageCropper();
  initProfileDropdown();
  initModal();
  initCopyUtils();
  initBackupActions();
  ExportDirManager.init();
  PreviewRenderer.initClientTabs();
  bindGlobalEvents();

  // 6. AI builder
  AISignatureBuilder.init(data => {
    if (State.active) {
      State.active.data    = { ...State.active.data, ...data };
      State.active.options = { ...State.active.options,
        template:    data.template,
        accentColor: data.accentColor,
      };
    }
    renderSignature();
  });

  // 7. Initial render
  renderSignature();

  // 8. Log ready
  console.log('%cEmailForge ✦ Ready', 'color:#6366f1;font-weight:700;font-size:14px;');
}

/* ─── Entry point ─────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
