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
    hound:     { id: 'hound',     label: 'Hound',     desc: 'Centered & symmetrical' },
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
    behance:   { label: 'Behance',   color: '#1769ff', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z'/></svg>` },
    substack:  { label: 'Substack',  color: '#FF6719', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M4 3h16v2.5H4V3zm0 4.25h16V21l-8-5-8 5V7.25z'/></svg>` },
    pinterest: { label: 'Pinterest', color: '#BD081C', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M12 2C6.48 2 2 6.48 2 12c0 4.22 2.62 7.83 6.35 9.32-.09-.79-.17-2 .03-2.87.19-.79 1.2-5.18 1.2-5.18s-.31-.61-.31-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.41-.24 1.01.51 1.84 1.51 1.84 1.81 0 3.2-1.9 3.2-4.66 0-2.43-1.75-4.14-4.25-4.14-2.89 0-4.58 2.17-4.58 4.4 0 .87.34 1.81.76 2.31.08.1.1.17.07.28-.08.33-.26 1.05-.3 1.2-.05.21-.17.26-.39.16-1.47-.68-2.39-2.83-2.39-4.56 0-3.71 2.7-7.13 7.78-7.13 4.09 0 7.27 2.91 7.27 6.8 0 4.06-2.56 7.33-6.11 7.33-1.19 0-2.31-.62-2.7-1.36l-.74 2.82c-.27 1.03-.99 2.32-1.48 3.12 1.13.35 2.34.54 3.59.54 5.52 0 10-4.48 10-10S17.52 2 12 2z'/></svg>` },
  };

  /* ─── Shared inline contact icons (SVG data URIs) ────────────── */

  const CONTACT_ICONS = {
    phone:   `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z'/></svg>`,
    email:   `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/></svg>`,
    website: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'></circle><line x1='2' y1='12' x2='22' y2='12'></line><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path></svg>`,
    address: `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/></svg>`
  };

  /* ─── Helper: encode SVG for use in img src ──────────────────── */
  function svgToDataUri(svgStr) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  /* ─── Helper: build contact icon HTML ────────────────────────── */
  function getContactIconHtml(key, options, accentColor) {
    const showContactIcons = options ? options.showContactIcons : false;
    if (!showContactIcons) return '';
    const icon = CONTACT_ICONS[key];
    if (!icon) return '';

    const bg = (options && options.contactIconColor) ? options.contactIconColor : (accentColor || '#6366f1');
    const shape = (options && options.contactIconShape) ? options.contactIconShape : 'square';
    const borderRadius = shape === 'circle' ? '50%' : (shape === 'rounded' ? '3px' : '0px');

    // Use relative path for local Nginx preview, converted to absolute at export time
    const iconUrl = `assets/icons/${key}.png`;

    return `<span style="display:inline-block;vertical-align:middle;background-color:${bg};width:10px;height:10px;padding:3px;border-radius:${borderRadius};margin-right:6px;line-height:0;font-size:0;box-sizing:content-box;">` +
           `<img src="${iconUrl}" width="10" height="10" alt="${key}" style="display:block;border:none;margin:0;padding:0;" />` +
           `</span>`;
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

      // Use relative path for local Nginx preview, converted to absolute at export time
      const iconUrl = `assets/icons/${key}.png`;
      links.push(`<a href="${href}" class="${uniqueClass}" target="_blank" rel="noopener" title="${icon.label}" style="display:inline-block;text-align:center;vertical-align:middle;line-height:24px;width:24px;height:24px;border-radius:${borderRadius};background-color:${bg};margin-right:5px;text-decoration:none;transition:background-color 150ms ease-in-out;">
  <img src="${iconUrl}" width="13" height="13" alt="${icon.label}" style="display:inline-block;vertical-align:middle;margin:0;border:none;" />
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
    add('behance',   data.behance);
    add('substack',  data.substack);
    add('pinterest', data.pinterest);

    if (!links.length) return '';
    
    if (hoverStyles.length) {
      currentHoverStyles.push(...hoverStyles);
    }
      
    const sSpacing = (options && options.socialSpacingTop !== undefined) ? options.socialSpacingTop : 10;
    return `<tr><td style="padding-top:${sSpacing}px;">${links.join('')}</td></tr>`;
  }

  /* ─── Helper: build plain text social links ──────────────────── */
  function buildSocialText(data) {
    const lines = [];
    if (data.linkedin)  lines.push(`LinkedIn: ${data.linkedin}`);
    if (data.twitter)   lines.push(`X/Twitter: ${data.twitter}`);
    if (data.instagram) lines.push(`Instagram: ${data.instagram}`);
    if (data.github)    lines.push(`GitHub: ${data.github}`);
    if (data.calendly)  lines.push(`Book a Call: ${data.calendly}`);
    if (data.whatsapp)  lines.push(`WhatsApp: ${data.whatsapp}`);
    if (data.behance)   lines.push(`Behance: ${data.behance}`);
    if (data.substack)  lines.push(`Substack: ${data.substack}`);
    if (data.pinterest) lines.push(`Pinterest: ${data.pinterest}`);
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
               style="width:${logoSize}px !important;height:auto !important;max-height:${logoSize}px;border-radius:${logoRadius};display:block;margin:0 auto;" />
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
         style="width:${size}px !important;height:auto !important;max-height:${size}px;border-radius:${radius};display:block;" />
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
            ${data.email ? `<tr><td style="font-size:${fontSize - 1}px;color:${cContact};vertical-align:middle;">${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.email)}</a>${data.phone ? ` &nbsp;·&nbsp; ${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.phone)}</a>` : ''}</td></tr>` : ''}
            ${data.website ? `<tr><td style="font-size:${fontSize - 1}px;padding-top:2px;vertical-align:middle;">${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a></td></tr>` : ''}
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
              <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.8;vertical-align:middle;">
                ${[
                  data.email ? `${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.email)}</a>` : '',
                  data.phone ? `${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.phone)}</a>` : '',
                  data.website ? `${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                  data.address ? `${getContactIconHtml('address', options, accentColor)}<span style="color:${cContact};vertical-align:middle;">${Utils.escapeHtml(data.address)}</span>` : '',
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
              <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:2;vertical-align:middle;">
                ${[
                  data.email ? `${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;margin-right:12px;vertical-align:middle;">${options.showContactIcons ? '' : '&#9993; '}${Utils.escapeHtml(data.email)}</a>` : '',
                  data.phone ? `${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;margin-right:12px;vertical-align:middle;">${options.showContactIcons ? '' : '&#128222; '}${Utils.escapeHtml(data.phone)}</a>` : '',
                  data.website ? `${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${options.showContactIcons ? '' : '&#127758; '}${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
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
                      <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.8;vertical-align:middle;">
                        ${[
                          data.email ? `${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" style="color:${accentColor};text-decoration:none;font-weight:500;vertical-align:middle;">${Utils.escapeHtml(data.email)}</a>` : '',
                          data.phone ? `${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.phone)}</a>` : '',
                          data.website ? `${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" style="color:${accentColor};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
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
              <td style="font-size:${fontSize - 1}px;line-height:${options.contactLineHeight !== undefined ? (options.contactLineHeight / (fontSize - 1)).toFixed(2) : '1.8'};color:${cContact};vertical-align:middle;">
                ${data.email ? `<span style="vertical-align:middle;">${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.email)}</a></span><br>` : ''}
                ${data.phone ? `<span style="vertical-align:middle;">${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${options.showContactIcons ? '' : 'T: '}${Utils.escapeHtml(data.phone)}</a></span><br>` : ''}
                ${data.website ? `<span style="vertical-align:middle;">${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a></span><br>` : ''}
                ${data.address ? `<span style="vertical-align:middle;">${getContactIconHtml('address', options, accentColor)}<span style="color:${cContact};opacity:0.8;vertical-align:middle;">${Utils.escapeHtml(data.address)}</span></span>` : ''}
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
                      <td style="font-size:${fontSize - 1}px;color:${cContact};line-height:1.9;letter-spacing:0.01em;vertical-align:middle;">
                        ${[
                          data.email ? `${getContactIconHtml('email', options, accentColor)}<a href="mailto:${data.email}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.email)}</a>` : '',
                          data.phone ? `${getContactIconHtml('phone', options, accentColor)}<a href="tel:${data.phone}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.phone)}</a>` : '',
                          data.website ? `${getContactIconHtml('website', options, accentColor)}<a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="color:${cContact};text-decoration:none;vertical-align:middle;">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>` : '',
                          data.address ? `${getContactIconHtml('address', options, accentColor)}<span style="color:${cContact};opacity:0.8;vertical-align:middle;">${Utils.escapeHtml(data.address)}</span>` : '',
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

  /* ── 7. HOUND ────────────────────────────────────────────────── */
  function renderHound(data, options) {
    const { accentColor, fontSize, fontFamily, showDivider, showTagline } = options;
    const name = fullName(data);
    const social = buildSocialIcons(data, options, accentColor);

    const cName = options.colorName || '#3A3A3A';
    const cJob = options.colorJobTitle || accentColor;
    const cCompany = options.colorCompany || '#555555';
    const cContact = options.colorContact || '#3a3a3a';
    const cTagline = options.colorTagline || '#555555';

    // Separator line logic
    const dividerColor = accentColor || 'rgb(159,100,75)';
    const separatorHtml = showDivider ? `
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tbody>
    <tr><td height="20" style="font-size:1px;line-height:1px;">&nbsp;</td></tr>
    <tr><td color="${dividerColor}" width="auto" height="1" style="width:100%;border-bottom:1px solid ${dividerColor};border-left:none;display:block;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    <tr><td height="20" style="font-size:1px;line-height:1px;">&nbsp;</td></tr>
  </tbody>
</table>` : `
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
  <tbody>
    <tr><td height="15" style="font-size:1px;line-height:1px;">&nbsp;</td></tr>
  </tbody>
</table>`;

    // Avatar section
    const avatarSize = options.avatarSize || 60;
    const avatarRadius = options.avatarShape === 'circle' ? '50%' : (options.avatarShape === 'rounded' ? '8px' : '0px');
    const avatarHtml = (data.avatar && options.showAvatar) ? `
      <tr>
        <td style="text-align:center;padding-bottom:12px;">
          <img src="${data.avatar}" width="${avatarSize}" height="${avatarSize}"
               style="display:inline-block;width:${avatarSize}px;height:${avatarSize}px;max-width:${avatarSize}px;border-radius:${avatarRadius};object-fit:cover;display:block;margin:0 auto;" 
               alt="${Utils.escapeHtml(name)}">
        </td>
      </tr>` : '';

    const contactsLineH = options.contactLineHeight !== undefined ? options.contactLineHeight : 24;
    // Contact details stacked vertically with icons (optional)
    const contactsHtml = `
      <table cellpadding="0" cellspacing="0" border="0" style="font-size:${fontSize}px;font-family:${fontFamily};color:${cContact};">
        <tbody>
          ${data.phone ? `
            <tr style="vertical-align:middle" height="${contactsLineH}">
              ${options.showContactIcons ? `<td width="22" style="vertical-align:middle;">${getContactIconHtml('phone', options, accentColor)}</td>` : ''}
              <td style="padding:0px;color:${cContact};vertical-align:middle;">
                <a href="tel:${data.phone}" class="ef-contact-link" style="text-decoration:none;color:${cContact};font-size:${fontSize}px;" target="_blank">${Utils.escapeHtml(data.phone)}</a>
              </td>
            </tr>` : ''}
          ${data.email ? `
            <tr style="vertical-align:middle" height="${contactsLineH}">
              ${options.showContactIcons ? `<td width="22" style="vertical-align:middle;">${getContactIconHtml('email', options, accentColor)}</td>` : ''}
              <td style="padding:0px;color:${cContact};vertical-align:middle;">
                <a href="mailto:${data.email}" class="ef-contact-link" style="text-decoration:none;color:${cContact};font-size:${fontSize}px;" target="_blank">${Utils.escapeHtml(data.email)}</a>
              </td>
            </tr>` : ''}
          ${data.website ? `
            <tr style="vertical-align:middle" height="${contactsLineH}">
              ${options.showContactIcons ? `<td width="22" style="vertical-align:middle;">${getContactIconHtml('website', options, accentColor)}</td>` : ''}
              <td style="padding:0px;color:${cContact};vertical-align:middle;">
                <a href="${Utils.normaliseUrl(data.website)}" class="ef-contact-link" style="text-decoration:none;color:${cContact};font-size:${fontSize}px;" target="_blank">${Utils.escapeHtml(data.website.replace(/^https?:\/\//, ''))}</a>
              </td>
            </tr>` : ''}
          ${data.address ? `
            <tr style="vertical-align:middle" height="${contactsLineH}">
              ${options.showContactIcons ? `<td width="22" style="vertical-align:middle;">${getContactIconHtml('address', options, accentColor)}</td>` : ''}
              <td style="padding:0px;color:${cContact};vertical-align:middle;font-size:${fontSize}px;">
                ${Utils.escapeHtml(data.address)}
              </td>
            </tr>` : ''}
        </tbody>
      </table>`;

    // Right column: Logo and social icons
    const logoSize = options.logoSize || 60;
    const logoRadius = options.logoShape === 'circle' ? '50%' : (options.logoShape === 'rounded' ? '6px' : '0px');
    const logoHtml = (data.logo && options.showLogo) ? `
      <tr>
        <td style="text-align:right;">
          ${data.logoUrl ? `<a href="${Utils.normaliseUrl(data.logoUrl)}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-block;">` : ''}
          <img src="${data.logo}" width="${logoSize}"
               style="display:inline-block;width:${logoSize}px !important;height:auto !important;max-height:${logoSize}px;border-radius:${logoRadius};" 
               alt="${Utils.escapeHtml(data.company || 'Logo')}">
          ${data.logoUrl ? `</a>` : ''}
        </td>
      </tr>` : '';

    const socialHtml = social ? `
      <tr align="right">
        <td>
          <table cellpadding="0" cellspacing="0" border="0" align="right" style="margin-left:auto;margin-right:0px;">
            <tbody>
              ${social}
            </tbody>
          </table>
        </td>
      </tr>` : '';

    return `<table cellpadding="0" cellspacing="0" border="0" style="min-width:450px;width:100%;max-width:500px;font-size:${fontSize}px;font-family:${fontFamily};color:${cContact};">
  <tbody>
    ${avatarHtml}
    <tr style="text-align:center">
      <td>
        <h2 style="margin:0px;font-size:${fontSize + 4}px;color:${cName};font-weight:600">${Utils.escapeHtml(name)}</h2>
        ${data.jobTitle ? `<p style="margin:0px;color:${cJob};font-size:${fontSize}px;line-height:22px;font-weight:500;">${Utils.escapeHtml(data.jobTitle)}${data.company ? ` · <span style="color:${cCompany}">${Utils.escapeHtml(data.company)}</span>` : ''}</p>` : ''}
        ${showTagline && data.tagline ? `<p style="margin:2px 0 0;color:${cTagline};font-size:${fontSize - 1}px;font-style:italic;">"${Utils.escapeHtml(data.tagline)}"</p>` : ''}
      </td>
    </tr>
    <tr>
      <td>
        ${separatorHtml}
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
          <tbody>
            <tr style="vertical-align:middle">
              <td style="vertical-align:middle;">
                ${contactsHtml}
              </td>
              <td width="15" style="font-size:1px;line-height:1px;">&nbsp;</td>
              <td style="text-align:right;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tbody>
                    ${logoHtml}
                    ${socialHtml}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        ${separatorHtml}
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
      case 'hound':     html = renderHound(data, options); break;
      case 'minimal':
      default:          html = renderMinimal(data, options); break;
    }

    if (data.disclaimer && data.disclaimer.trim() && (!options || options.showDisclaimer !== false)) {
      const dColor = options.colorDisclaimer || '#969696';
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
