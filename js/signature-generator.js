/**
 * EmailForge — signature-generator.js
 * Generates the HTML output for each signature template.
 * All templates are pure inline-CSS table-based HTML for maximum
 * email client compatibility (Gmail, Outlook, Apple Mail).
 */

'use strict';

const SignatureGenerator = (() => {

  let currentHoverStyles = [];

  /* ─── Template registry ──────────────────────────────────────── */

  const TEMPLATES = {
    minimal:   { id: 'minimal',   label: 'Minimal',   desc: 'Clean & pure' },
    executive: { id: 'executive', label: 'Executive', desc: 'Bold & authoritative' },
    modern:    { id: 'modern',    label: 'Modern',    desc: 'Fresh & geometric' },
    creative:  { id: 'creative',  label: 'Creative',  desc: 'Bold & expressive' },
    corporate: { id: 'corporate', label: 'Corporate', desc: 'Classic & trustworthy' },
    luxury:    { id: 'luxury',    label: 'Luxury',    desc: 'Refined & prestigious' },
  };

  /* ─── Shared inline social icons (SVG data URIs) ─────────────── */

  const SOCIAL_ICONS = {
    linkedin:  { label: 'LinkedIn',  color: '#0A66C2', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z'/><circle cx='4' cy='4' r='2'/></svg>` },
    twitter:   { label: 'X/Twitter', color: '#000000', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>` },
    instagram: { label: 'Instagram', color: '#E4405F', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'><rect x='2' y='2' width='20' height='20' rx='5'/><circle cx='12' cy='12' r='4'/><circle cx='17.5' cy='6.5' r='1' fill='white' stroke='none'/></svg>` },
    github:    { label: 'GitHub',    color: '#181717', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'/></svg>` },
    dribbble:  { label: 'Dribbble',  color: '#EA4C89', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'><circle cx='12' cy='12' r='10'/><path d='M8.5 3.5C9.5 7 11 11 14 13.5'/><path d='M3.5 10.5c3 .5 7 .5 10 2.5'/><path d='M15.5 3.5c.5 3 0 8-2 12'/></svg>` },
    youtube:   { label: 'YouTube',   color: '#FF0000', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z'/></svg>` },
    calendly:  { label: 'Book a Call', color: '#006BFF', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'><rect x='3' y='4' width='18' height='18' rx='2'/><path d='M3 9h18M8 2v4M16 2v4'/></svg>` },
    whatsapp:  { label: 'WhatsApp',  color: '#25D366', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/><path d='M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.984-1.406A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z'/></svg>` },
  };

  /* ─── Helper: encode SVG for use in img src ──────────────────── */
  function svgToDataUri(svgStr) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  /* ─── Build social icons HTML row ────────────────────────────── */
  function buildSocialIcons(data, options, accentColor) {
    const showIcons = typeof options === 'object' ? options.showIcons : options;
    if (!showIcons) return '';
    const links = [];

    const colorMode = (options && options.socialIconColorMode) ? options.socialIconColorMode : 'brand';
    const shape = (options && options.socialIconShape) ? options.socialIconShape : 'circle';
    const customColor = (options && options.socialIconCustomColor) ? options.socialIconCustomColor : accentColor;

    const borderRadius = shape === 'circle' ? '50%' : (shape === 'rounded' ? '4px' : '0px');
    
    const hoverStyles = [];

    const add = (key, url) => {
      const icon = SOCIAL_ICONS[key];
      if (!url || !icon) return;
      const href = Utils.normaliseUrl(url);

      // Normal state background color
      let bg = icon.color;
      if (colorMode === 'accent') {
        bg = accentColor;
      } else if (colorMode === 'custom') {
        bg = customColor;
      } else if (options && options[`socialColor_${key}`]) {
        bg = options[`socialColor_${key}`];
      } else if (key === 'calendly') {
        bg = accentColor;
      }

      // Hover state background color
      let hoverBg = Utils.adjustColor(bg, -30); // Default hover is slightly darker
      if (options && options[`socialHover_${key}`]) {
        hoverBg = options[`socialHover_${key}`];
      }

      const uniqueClass = `ef-social-${key}`;
      hoverStyles.push(`.${uniqueClass}:hover { background-color: ${hoverBg} !important; }`);

      links.push(`<a href="${href}" class="${uniqueClass}" target="_blank" rel="noopener" title="${icon.label}" style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:${borderRadius};background-color:${bg};margin-right:5px;text-decoration:none;transition:background-color 150ms ease-in-out;">
  <img src="${svgToDataUri(icon.svg)}" width="13" height="13" alt="${icon.label}" style="display:block;" />
</a>`);
    };

    add('linkedin',  data.linkedin);
    add('twitter',   data.twitter);
    add('instagram', data.instagram);
    add('github',    data.github);
    add('dribbble',  data.dribbble);
    add('youtube',   data.youtube);
    add('calendly',  data.calendly);
    add('whatsapp',  data.whatsapp);

    if (!links.length) return '';
    
    if (hoverStyles.length) {
      currentHoverStyles.push(...hoverStyles);
    }
      
    return `<tr><td style="padding-top:10px;">${links.join('')}</td></tr>`;
  }

  /* ─── Helper: build plain text social links ──────────────────── */
  function buildSocialText(data) {
    const lines = [];
    if (data.linkedin)  lines.push(`LinkedIn: ${data.linkedin}`);
    if (data.twitter)   lines.push(`X/Twitter: ${data.twitter}`);
    if (data.instagram) lines.push(`Instagram: ${data.instagram}`);
    if (data.github)    lines.push(`GitHub: ${data.github}`);
    if (data.calendly)  lines.push(`Book a Call: ${data.calendly}`);
    return lines.join(' | ');
  }

  /* ─── Avatar cell ────────────────────────────────────────────── */
  function avatarCell(data, options, defaultSize = 60, defaultShape = 'circle', defaultBorder = '') {
    const showAvatar = options ? options.showAvatar : data.showAvatar;
    if (!data.avatar || !showAvatar) return '';

    const size = (options && options.avatarSize) ? options.avatarSize : defaultSize;
    const shape = (options && options.avatarShape) ? options.avatarShape : defaultShape;
    const radius = shape === 'circle' ? '50%' : (shape === 'rounded' ? '8px' : '0px');

    const spacingTop = (options && options.avatarSpacingTop !== undefined) ? options.avatarSpacingTop : 0;
    
    const borderWidth = (options && options.avatarBorderWidth !== undefined) ? options.avatarBorderWidth : null;
    const borderColor = (options && options.avatarBorderColor) ? options.avatarBorderColor : (options ? options.accentColor : '#6366f1');
    
    let borderStyle = defaultBorder;
    if (borderWidth !== null) {
      borderStyle = borderWidth > 0 ? `border:${borderWidth}px solid ${borderColor};` : '';
    }

    return `<td style="padding-right:16px;padding-top:${spacingTop}px;vertical-align:top;">
  <img src="${data.avatar}" width="${size}" height="${size}"
       alt="${Utils.escapeHtml(data.firstName || 'Avatar')}"
       style="width:${size}px;height:${size}px;border-radius:${radius};object-fit:cover;display:block;${borderStyle}" />
</td>`;
  }

  /* ─── Left column cell (Stacks Avatar and Logo vertically if placement = 'photo') ─── */
  function leftColumnCell(data, options, defaultSize = 60, defaultShape = 'circle', defaultBorder = '') {
    const showAvatar = options ? options.showAvatar : data.showAvatar;
    const showLogo = options ? options.showLogo : false;
    const hasAvatar = data.avatar && showAvatar;
    const hasLogo = data.logo && showLogo && options && options.logoPlacement === 'photo';

    if (!hasAvatar && !hasLogo) return '';

    const spacingTop = (options && options.avatarSpacingTop !== undefined) ? options.avatarSpacingTop : 0;

    // Fallback to standard avatar cell if no logo placed under photo
    if (!hasLogo) {
      return avatarCell(data, options, defaultSize, defaultShape, defaultBorder);
    }

    // Stack both vertically using nested table
    const size = (options && options.avatarSize) ? options.avatarSize : defaultSize;
    const shape = (options && options.avatarShape) ? options.avatarShape : defaultShape;
    const radius = shape === 'circle' ? '50%' : (shape === 'rounded' ? '8px' : '0px');
    
    const borderWidth = (options && options.avatarBorderWidth !== undefined) ? options.avatarBorderWidth : null;
    const borderColor = (options && options.avatarBorderColor) ? options.avatarBorderColor : (options ? options.accentColor : '#6366f1');
    
    let borderStyle = defaultBorder;
    if (borderWidth !== null) {
      borderStyle = borderWidth > 0 ? `border:${borderWidth}px solid ${borderColor};` : '';
    }

    const logoSize = options.logoSize || 60;
    const logoShape = options.logoShape || 'square';
    const logoRadius = logoShape === 'circle' ? '50%' : (logoShape === 'rounded' ? '6px' : '0px');
    const logoSpacing = options.logoSpacing !== undefined ? options.logoSpacing : 10;

    return `<td style="padding-right:16px;padding-top:${spacingTop}px;vertical-align:top;" align="center">
  <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tbody>
      ${hasAvatar ? `<tr>
        <td style="padding-bottom:${logoSpacing}px;vertical-align:top;" align="center">
          <img src="${data.avatar}" width="${size}" height="${size}"
               alt="${Utils.escapeHtml(data.firstName || 'Avatar')}"
               style="width:${size}px;height:${size}px;border-radius:${radius};object-fit:cover;display:block;margin:0 auto;${borderStyle}" />
        </td>
      </tr>` : ''}
      <tr>
        <td style="vertical-align:top;" align="center">
          ${data.logoUrl ? `<a href="${Utils.normaliseUrl(data.logoUrl)}" target="_blank" rel="noopener" style="text-decoration:none;display:block;">` : ''}
          <img src="${data.logo}" width="${logoSize}"
               alt="${Utils.escapeHtml(data.company || 'Logo')}"
               style="width:${logoSize}px;height:auto;max-height:${logoSize}px;border-radius:${logoRadius};display:block;margin:0 auto;" />
          ${data.logoUrl ? `</a>` : ''}
        </td>
      </tr>
    </tbody>
  </table>
</td>`;
  }

  /* ─── Logo row (Bottom details list placement) ────────────────── */
  function logoRow(data, options, templateId) {
    if (!data.logo || !options || !options.showLogo) return '';
    
    // Only bypass if position is 'photo' and template has a left column structure
    if (options.logoPlacement === 'photo' && ['minimal', 'executive', 'corporate', 'luxury'].includes(templateId)) {
      return '';
    }

    const size = options.logoSize || 60;
    const shape = options.logoShape || 'square';
    const radius = shape === 'circle' ? '50%' : (shape === 'rounded' ? '6px' : '0px');
    const logoSpacing = options.logoSpacing !== undefined ? options.logoSpacing : 10;

    return `<tr>
  <td style="padding-top:${logoSpacing}px;padding-bottom:2px;vertical-align:top;">
    ${data.logoUrl ? `<a href="${Utils.normaliseUrl(data.logoUrl)}" target="_blank" rel="noopener" style="text-decoration:none;display:block;">` : ''}
    <img src="${data.logo}" width="${size}"
         alt="${Utils.escapeHtml(data.company || 'Logo')}"
         style="width:${size}px;height:auto;max-height:${size}px;border-radius:${radius};display:block;" />
    ${data.logoUrl ? `</a>` : ''}
  </td>
</tr>`;
  }

  /* ─── Full name helper ───────────────────────────────────────── */
  function fullName(data) {
    return [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Your Name';
  }

  /* ════════════════════════════════════════════════════════════════
     TEMPLATE RENDERERS
     Each returns a complete inline-CSS HTML string.
  ════════════════════════════════════════════════════════════════ */

  /* ── 1. MINIMAL ──────────────────────────────────────────────── */
  function renderMinimal(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);
    const divider = showDivider
      ? `<tr><td style="padding:10px 0 8px;"><div style="width:40px;height:2px;background:${accentColor};"></div></td></tr>`
      : `<tr><td style="padding-top:10px;"></td></tr>`;

    const cName = options.colorName || '#111111';
    const cJob = options.colorJobTitle || accentColor;
    const cCompany = options.colorCompany || '#666666';
    const cContact = options.colorContact || '#666666';
    const cTagline = options.colorTagline || '#999999';

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;color:${cContact};line-height:1.5;max-width:500px;">
  <tbody>
    <tr>
      ${leftColumnCell(data, options, 52, 'circle', '')}
      <td style="vertical-align:top;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            ${divider}
            <tr>
              <td style="font-size:${fontSize + 3}px;font-weight:700;color:${cName};padding-bottom:1px;white-space:nowrap;">
                ${Utils.escapeHtml(name)}
              </td>
            </tr>
            ${data.jobTitle ? `<tr><td style="font-size:${fontSize}px;color:${cJob};font-weight:500;padding-bottom:4px;">${Utils.escapeHtml(data.jobTitle)}${data.company ? ` · <span style="color:${cCompany};">${Utils.escapeHtml(data.company)}</span>` : ''}</td></tr>` : ''}
            ${showTagline && data.tagline ? `<tr><td style="font-size:${fontSize - 1}px;color:${cTagline};font-style:italic;padding-bottom:6px;">${Utils.escapeHtml(data.tagline)}</td></tr>` : ''}
            ${data.email ? `<tr><td style="font-size:${fontSize - 1}px;color:${cContact};"><a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.email)}</a>${data.phone ? ` &nbsp;·&nbsp; <a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.phone)}</a>` : ''}</td></tr>` : ''}
            ${data.website ? `<tr><td style="font-size:${fontSize - 1}px;padding-top:2px;"><a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a></td></tr>` : ''}
            ${social}
            ${logoRow(data, options, 'minimal')}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
 </table>`;
  }

  /* ── 2. EXECUTIVE ────────────────────────────────────────────── */
  function renderExecutive(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);

    const cName = options.colorName || '#111111';
    const cJob = options.colorJobTitle || accentColor;
    const cCompany = options.colorCompany || '#555555';
    const cContact = options.colorContact || '#666666';
    const cTagline = options.colorTagline || '#999999';

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;color:${cContact};max-width:520px;">
  <tbody>
    <tr>
      ${leftColumnCell(data, options, 70, 'square', '')}
      <td style="vertical-align:top;border-left:3px solid ${accentColor};padding-left:16px;">
         <table cellpadding="0" cellspacing="0" border="0">
          <tbody>
            <tr>
              <td style="font-size:${fontSize + 5}px;font-weight:800;color:${cName};letter-spacing:-0.3px;line-height:1.2;padding-bottom:2px;">
                ${Utils.escapeHtml(name)}
              </td>
            </tr>
            ${data.jobTitle ? `<tr><td style="font-size:${fontSize + 1}px;font-weight:600;color:${cJob};padding-bottom:2px;letter-spacing:0.01em;">${Utils.escapeHtml(data.jobTitle)}</td></tr>` : ''}
            ${data.company ? `<tr><td style="font-size:${fontSize}px;color:${cCompany};font-weight:500;text-transform:uppercase;letter-spacing:0.05em;padding-bottom:${showTagline && data.tagline ? 4 : 8}px;">${Utils.escapeHtml(data.company)}</td></tr>` : ''}
            ${showTagline && data.tagline ? `<tr><td style="font-size:${fontSize - 1}px;color:${cTagline};font-style:italic;padding-bottom:8px;">"${Utils.escapeHtml(data.tagline)}"</td></tr>` : ''}
            ${showDivider ? `<tr><td style="padding-bottom:8px;"><div style="height:1px;background:linear-gradient(to right,${accentColor},transparent);width:180px;"></div></td></tr>` : ''}
            <tr>
              <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.8;">
                ${[
                  data.email ? `<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.email)}</a>` : '',
                  data.phone ? `<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.phone)}</a>` : '',
                  data.website ? `<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                  data.address ? `<span>${Utils.escapeHtml(data.address)}</span>` : '',
                ].filter(Boolean).join(' &nbsp;|&nbsp; ')}
              </td>
            </tr>
            ${social}
            ${logoRow(data, options, 'executive')}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
  }

  /* ── 3. MODERN ───────────────────────────────────────────────── */
  function renderModern(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);

    const cName = options.colorName && options.colorName !== '#111111' ? options.colorName : '#ffffff';
    const cJob = options.colorJobTitle && options.colorJobTitle !== accentColor ? options.colorJobTitle : 'rgba(255,255,255,0.8)';
    const cContact = options.colorContact || '#666666';
    const cTagline = options.colorTagline || '#888888';

    // Modern uses standard avatarCell because it has no left column stacking
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;color:${cContact};max-width:500px;">
  <tbody>
    <tr>
      <td style="background-color:${accentColor};padding:12px 16px;border-radius:8px 8px 0 0;" colspan="2">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            <tr>
              ${avatarCell(data, options, 44, 'circle', '')}
              <td style="vertical-align:middle;">
                <div style="font-size:${fontSize + 3}px;font-weight:700;color:${cName};line-height:1.2;">${Utils.escapeHtml(name)}</div>
                ${data.jobTitle ? `<div style="font-size:${fontSize - 1}px;color:${cJob};margin-top:1px;">${Utils.escapeHtml(data.jobTitle)}${data.company ? ` · ${Utils.escapeHtml(data.company)}` : ''}</div>` : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color:#f8f8fa;padding:10px 16px;border-radius:0 0 8px 8px;border:1px solid #e8e8ee;border-top:none;" colspan="2">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            ${showTagline && data.tagline ? `<tr><td style="font-size:${fontSize - 1}px;color:${cTagline};font-style:italic;padding-bottom:6px;">${Utils.escapeHtml(data.tagline)}</td></tr>` : ''}
            <tr>
              <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:2;">
                ${[
                  data.email ? `<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;margin-right:12px;">&#9993; ${Utils.escapeHtml(data.email)}</a>` : '',
                  data.phone ? `<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;margin-right:12px;">&#128222; ${Utils.escapeHtml(data.phone)}</a>` : '',
                  data.website ? `<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">&#127758; ${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                ].filter(Boolean).join(' ')}
              </td>
            </tr>
            ${social}
            ${logoRow(data, options, 'modern')}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
  }

  /* ── 4. CREATIVE ─────────────────────────────────────────────── */
  function renderCreative(data, options) {
    const { accentColor, fontSize, fontFamily, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);
    const darkText = Utils.isLightColor(accentColor) ? '#111' : '#fff';

    const cName = options.colorName && options.colorName !== '#111111' ? options.colorName : darkText;
    const cJob = options.colorJobTitle && options.colorJobTitle !== accentColor ? options.colorJobTitle : darkText;
    const cCompany = options.colorCompany && options.colorCompany !== '#666666' ? options.colorCompany : darkText;
    const cContact = options.colorContact || '#555555';
    const cTagline = options.colorTagline || darkText;

    const avatarSize = options.avatarSize || 56;
    const avatarShape = options.avatarShape || 'rounded';
    const avatarRadius = avatarShape === 'circle' ? '50%' : (avatarShape === 'rounded' ? '10px' : '0px');

    const cBorderW = options.avatarBorderWidth !== undefined ? options.avatarBorderWidth : 2;
    const cBorderColor = options.avatarBorderColor || 'rgba(255,255,255,0.3)';
    const borderStyle = cBorderW > 0 ? `border:${cBorderW}px solid ${cBorderColor};` : '';

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;max-width:520px;color:${cContact};">
  <tbody>
    <tr>
      <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            <tr>
              <td style="padding:14px 18px;background:${accentColor};border-radius:12px;position:relative;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tbody>
                    <tr>
                      ${data.avatar && options.showAvatar ? `<td style="padding-right:14px;vertical-align:middle;"><img src="${data.avatar}" width="${avatarSize}" height="${avatarSize}" alt="${Utils.escapeHtml(data.firstName || '')}" style="width:${avatarSize}px;height:${avatarSize}px;border-radius:${avatarRadius};object-fit:cover;display:block;${borderStyle}" /></td>` : ''}
                      <td style="vertical-align:middle;">
                        <div style="font-size:${fontSize + 5}px;font-weight:800;color:${cName};letter-spacing:-0.4px;line-height:1.1;">${Utils.escapeHtml(name)}</div>
                        ${data.jobTitle ? `<div style="font-size:${fontSize}px;color:${cJob};opacity:0.75;margin-top:3px;font-weight:500;">${Utils.escapeHtml(data.jobTitle)}${data.company ? ` · <span style="color:${cCompany}">${Utils.escapeHtml(data.company)}</span>` : ''}</div>` : ''}
                        ${showTagline && data.tagline ? `<div style="font-size:${fontSize - 1}px;color:${cTagline};opacity:0.6;margin-top:4px;font-style:italic;">${Utils.escapeHtml(data.tagline)}</div>` : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 4px 0;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tbody>
                    <tr>
                      <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.8;">
                        ${[
                          data.email ? `<a href="mailto:${data.email}" style="color:${accentColor};text-decoration:none;font-weight:500;">${Utils.escapeHtml(data.email)}</a>` : '',
                          data.phone ? `<a href="tel:${data.phone}" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.phone)}</a>` : '',
                          data.website ? `<a href="${Utils.normaliseUrl(data.website)}" style="color:${accentColor};text-decoration:none;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                         ].filter(Boolean).join(' &nbsp;&bull;&nbsp; ')}
                      </td>
                    </tr>
                    ${social}
                    ${logoRow(data, options, 'creative')}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
  }

  /* ── 5. CORPORATE ────────────────────────────────────────────── */
  function renderCorporate(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);

    const cName = options.colorName || '#1a1a1a';
    const cJob = options.colorJobTitle || accentColor;
    const cCompany = options.colorCompany || '#444444';
    const cContact = options.colorContact || '#555555';
    const cTagline = options.colorTagline || '#888888';

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;color:${cContact};max-width:520px;">
  <tbody>
    <tr>
      ${leftColumnCell(data, options, 64, 'square', '')}
      <td style="vertical-align:top;padding-top:2px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            <tr>
              <td style="font-size:${fontSize + 4}px;font-weight:700;color:${cName};letter-spacing:-0.2px;line-height:1.2;padding-bottom:2px;">
                ${Utils.escapeHtml(name)}
              </td>
            </tr>
            ${data.jobTitle ? `<tr><td style="font-size:${fontSize}px;color:${cJob};font-weight:600;padding-bottom:1px;">${Utils.escapeHtml(data.jobTitle)}</td></tr>` : ''}
            ${data.department ? `<tr><td style="font-size:${fontSize - 1}px;color:${cContact};padding-bottom:1px;">${Utils.escapeHtml(data.department)}</td></tr>` : ''}
            ${data.company ? `<tr><td style="font-size:${fontSize - 1}px;color:${cCompany};font-weight:600;padding-bottom:${showDivider ? 8 : 4}px;text-transform:uppercase;letter-spacing:0.04em;">${Utils.escapeHtml(data.company)}</td></tr>` : ''}
            ${showDivider ? `<tr><td style="padding-bottom:8px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;" /></td></tr>` : ''}
            ${showTagline && data.tagline ? `<tr><td style="font-size:${fontSize - 1}px;color:${cTagline};font-style:italic;padding-bottom:6px;">${Utils.escapeHtml(data.tagline)}</td></tr>` : ''}
            <tr>
              <td style="font-size:${fontSize - 1}px;line-height:1.8;color:${cContact};">
                ${data.email ? `<span><a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.email)}</a></span><br>` : ''}
                ${data.phone ? `<span><a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">T: ${Utils.escapeHtml(data.phone)}</a></span><br>` : ''}
                ${data.website ? `<span><a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a></span><br>` : ''}
                ${data.address ? `<span style="color:${cContact};opacity:0.8;">${Utils.escapeHtml(data.address)}</span>` : ''}
              </td>
            </tr>
            ${social}
            ${logoRow(data, options, 'corporate')}
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
  }

  /* ── 6. LUXURY ───────────────────────────────────────────────── */
  function renderLuxury(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);
    const gold   = accentColor; // Use the accent as the "gold" tone

    const cName = options.colorName || '#111111';
    const cJob = options.colorJobTitle || gold;
    const cCompany = options.colorCompany || '#555555';
    const cContact = options.colorContact || '#555555';
    const cTagline = options.colorTagline || '#888888';

    const avatarSize = options.avatarSize || 60;
    const avatarShape = options.avatarShape || 'circle';

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${fontFamily};font-size:${fontSize}px;color:${cContact};max-width:500px;">
  <tbody>
    <tr>
      <td style="border-top:2px solid ${gold};padding-top:14px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tbody>
            <tr>
              ${leftColumnCell(data, options, avatarSize, avatarShape, "border:2px solid " + gold + ";")}
              <td style="vertical-align:top;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tbody>
                    <tr>
                      <td style="font-size:${fontSize + 4}px;font-weight:700;color:${cName};letter-spacing:0.02em;line-height:1.2;padding-bottom:2px;">
                        ${Utils.escapeHtml(name)}
                      </td>
                    </tr>
                    ${data.jobTitle ? `<tr><td style="font-size:${fontSize - 1}px;color:${cJob};font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding-bottom:${showTagline && data.tagline ? 3 : 8}px;">${Utils.escapeHtml(data.jobTitle)}${data.company ? ` &nbsp;·&nbsp; <span style="color:${cCompany}">${Utils.escapeHtml(data.company)}</span>` : ''}</td></tr>` : ''}
                    ${showTagline && data.tagline ? `<tr><td style="font-size:${fontSize - 1}px;color:${cTagline};font-style:italic;letter-spacing:0.02em;padding-bottom:8px;">${Utils.escapeHtml(data.tagline)}</td></tr>` : ''}
                    ${showDivider ? `<tr><td style="padding-bottom:8px;"><div style="width:100%;height:1px;background:linear-gradient(to right,${gold},transparent);"></div></td></tr>` : ''}
                    <tr>
                      <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.9;letter-spacing:0.01em;">
                        ${[
                          data.email ? `<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.email)}</a>` : '',
                          data.phone ? `<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.phone)}</a>` : '',
                          data.website ? `<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                          data.address ? `<span style="color:${cContact};opacity:0.8;">${Utils.escapeHtml(data.address)}</span>` : '',
                        ].filter(Boolean).join(' &nbsp;·&nbsp; ')}
                      </td>
                    </tr>
                    ${social}
                    ${logoRow(data, options, 'luxury')}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top:12px;border-bottom:1px solid ${gold};"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`;
  }

  /* ════════════════════════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════════════════════════ */

  /**
   * Generate a complete HTML signature string.
   * @param {object} data     — form field values
   * @param {object} options  — template, accentColor, fontSize, fontFamily, toggles
   * @returns {string}        — HTML string
   */
  function generate(data, options) {
    currentHoverStyles = []; // Reset for this generation

    const hoverContactColor = options.colorContactHover || '#6366f1';
    currentHoverStyles.push(`.ef-contact-link { transition: color 150ms ease-in-out; }`);
    currentHoverStyles.push(`.ef-contact-link:hover { color: ${hoverContactColor} !important; }`);

    const template = options.template || 'minimal';
    let html = '';
    switch (template) {
      case 'executive': html = renderExecutive(data, options); break;
      case 'modern':    html = renderModern(data, options); break;
      case 'creative':  html = renderCreative(data, options); break;
      case 'corporate': html = renderCorporate(data, options); break;
      case 'luxury':    html = renderLuxury(data, options); break;
      case 'minimal':
      default:          html = renderMinimal(data, options); break;
    }

    if (data.disclaimer && data.disclaimer.trim() && (!options || options.showDisclaimer !== false)) {
      const dColor = options.colorDisclaimer || '#666666';
      const dSize = options.disclaimerSize || 10;
      const dSpacingTop = options.disclaimerSpacingTop !== undefined ? options.disclaimerSpacingTop : 10;
      const dFamily = options.fontFamily || 'Arial, Helvetica, sans-serif';
      const disclaimerHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:${dFamily};font-size:${dSize}px;color:${dColor};line-height:1.5;max-width:500px;width:100%;">
  <tbody>
    <tr>
      <td style="color:${dColor};font-size:${dSize}px;line-height:1.5;padding-top:${dSpacingTop}px;">
        ${Utils.escapeHtml(data.disclaimer).replace(/\n/g, '<br />')}
      </td>
    </tr>
  </tbody>
</table>`;
      html = html + disclaimerHtml;
    }

    if (currentHoverStyles.length > 0) {
      const styleBlock = `<style type="text/css">\n${currentHoverStyles.join('\n')}\n</style>\n`;
      html = styleBlock + html;
    }
    return html;
  }

  /**
   * Generate plain-text version of the signature.
   */
  function generatePlainText(data, options) {
    const name = [data.firstName, data.lastName].filter(Boolean).join(' ');
    const lines = [];
    if (name)           lines.push(`── ${name} ──`);
    if (data.jobTitle)  lines.push(data.jobTitle + (data.company ? ` · ${data.company}` : ''));
    if (data.tagline)   lines.push(`"${data.tagline}"`);
    lines.push('');
    if (data.email)     lines.push(`Email: ${data.email}`);
    if (data.phone)     lines.push(`Phone: ${data.phone}`);
    if (data.website)   lines.push(`Web:   ${data.website}`);
    if (data.address)   lines.push(`Addr:  ${data.address}`);
    const social = buildSocialText(data);
    if (social)         { lines.push(''); lines.push(social); }
    if (data.disclaimer && (!options || options.showDisclaimer !== false)) {
      lines.push('');
      lines.push('---');
      lines.push(data.disclaimer);
    }
    return lines.join('\n');
  }

  /**
   * Return the list of available templates (for UI rendering).
   */
  function getTemplates() {
    return Object.values(TEMPLATES);
  }

  /**
   * Generate a small thumbnail HTML for template preview cards.
   */
  function getThumbnailHtml(templateId, accentColor) {
    const dummyData = {
      firstName: 'Jane', lastName: 'Doe',
      jobTitle: 'Designer', company: 'Studio',
      email: 'jane@studio.co', phone: '+1 555 000',
      website: 'studio.co', tagline: 'Great work.',
      avatar: null, showAvatar: false, logo: null, showLogo: false
    };
    const opts = {
      template: templateId, accentColor,
      fontSize: 10, fontFamily: 'Arial, sans-serif',
      showDivider: true, showTagline: true, showIcons: false, showLogo: false
    };
    return generate(dummyData, opts);
  }

  return { generate, generatePlainText, getTemplates, getThumbnailHtml };
})();
