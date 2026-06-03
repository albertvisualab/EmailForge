<div style="background-color: #F9F4EF; color: #141313; padding: 40px; font-family: sans-serif; border-radius: 8px; line-height: 1.6;">

<h1 style="color: #97A788; border-bottom: 3px solid #D6B972; padding-bottom: 10px;">📖 EmailForge - Manual d'Usuari Complet</h1>

<p>Benvingut al manual complet de <b>EmailForge</b>, la teva eina en local per a dissenyar signatures de correu electrònic professionals. Aquesta aplicació està dissenyada per generar signatures dinàmiques 100% compatibles amb qualsevol client de correu modern (Gmail, Outlook, Apple Mail) utilitzant una estructura robusta basada en taules HTML i CSS en línia.</p>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">👤 1. Gestió de Perfils i Desament en Local</h2>
<p>L'aplicació compta amb un sistema de <b>multiperfil</b> a la part superior per gestionar diferents signatures de manera independent:</p>
<ul>
  <li><b>Desament Automàtic:</b> Qualsevol text, imatge o paràmetre de disseny es desa automàticament a la base de dades local del teu navegador (<code>localStorage</code>).</li>
  <li><b>Creació de Perfils:</b> El desplegable superior et permet crear noves signatures o eliminar les existents a l'instant.</li>
</ul>

<blockquote style="background-color: #f1ebd8; border-left: 4px solid #D6B972; padding: 10px 15px; margin: 15px 0; font-size: 0.95em;">
  <b>💡 Important sobre la Pèrdua de Dades:</b> Com que els perfils es desen localment al navegador, si esborres la memòria cau de navegació es podrien perdre. Per evitar-ho, utilitza el menú desplegable:
  <ul style="margin-top: 5px; padding-left: 20px;">
    <li><b>Backup (JSON):</b> Descarrega un arxiu <code>signatures_backup.json</code> amb totes les teves signatures i fotos codificades. Et recomanem desar aquest arxiu a la carpeta <code>exported-signatures/</code> del repositori per tenir una còpia física versionada a GitHub.</li>
    <li><b>Restore (JSON):</b> Et permet pujar el teu arxiu de còpia de seguretat JSON per restaurar tots els teus perfils a l'instant.</li>
  </ul>
</blockquote>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🎨 2. Dissenys i Plantilles (Pestanya Design)</h2>
<p>EmailForge ofereix <b>7 plantilles de disseny professionals</b> a punt per fer servir:</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 15px; background-color: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
  <tr style="background-color: #97A788; color: #F9F4EF;">
    <th style="padding: 12px; text-align: left; border: 1px solid #d1c8b4;">Plantilla</th>
    <th style="padding: 12px; text-align: left; border: 1px solid #d1c8b4;">Descripció i Comportament</th>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Minimal</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Disseny net i polit amb foto/avatar a l'esquerra i dades senzilles.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Executive</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Estructura moderna separada per una línia divisòria vertical gruixuda amb el color d'accent.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Modern</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Format cridaner amb una capçalera de color sòlid que ressalta el teu nom i càrrec.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Creative</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Una targeta de disseny arrodonit i modern, ideal per a perfils artístics o tecnològics.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Corporate</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Estructura corporativa clàssica, ideal per a signatures d'empresa molt formals.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Luxury</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Línies primes, àmplies i tipografies espaiades per a una imatge de marca premium.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Hound 🌟</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Inspirada en el clàssic disseny de Signature Hound: avatar centrat a la part superior, línia divisòria horitzontal i una base neta amb dades a l'esquerra, logotip i xarxes a la dreta.</td>
  </tr>
</table>

<h3 style="color: #97A788; margin-top: 25px;">Paràmetres Estètics Generals</h3>
<ul>
  <li><b>Accent Color:</b> Controla el color de les línies, càrrecs i enllaços actius de la teva signatura.</li>
  <li><b>Toggles de Visibilitat:</b> Activa o desactiva elements com la foto de perfil, logotip corporatiu, eslògan o divisors a l'instant.</li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🖼️ 3. Configuració d'Avatar, Logotip i URLs Externes (Hotlinking)</h2>
<p>EmailForge gestiona de manera independent les imatges personals i corporatives, oferint dues maneres d'afegir-les:</p>

<h3 style="color: #97A788;">A. Imatges locals amb retall dinàmic (Base64)</h3>
<p>Pots pujar un fitxer local des del teu ordinador:</p>
<ul>
  <li><b>Crop (Retallar):</b> L'aplicació obre un editor de retall per assegurar la proporció.</li>
  <li><b>Limitacions:</b> Les imatges locals es codifiquen en format Base64 (Data URI). Aquest format és ideal perquè s'inclou directament al codi, però té el desavantatge que alguns clients de correu (com Microsoft Outlook) bloquegen o no mostren les imatges en format Base64 per raons de seguretat.</li>
</ul>

<h3 style="color: #97A788;">B. URLs Externes (Hotlinked) 🌟 Recomanat</h3>
<p>Si disposes de la teva foto o logotip allotjats en un servidor extern a Internet (per exemple, al web de la teva empresa, Dropbox, Imgur, etc.), pots introduir la seva URL directa als camps corresponents:</p>
<ul>
  <li><b>Camps:</b> <code>Or photo URL (hotlink)</code> i <code>Or logo URL (hotlink)</code>.</li>
  <li><b>Prioritat:</b> Si introdueixes una URL externa vàlida, aquesta tindrà prioritat absoluta sobre qualsevol imatge local carregada.</li>
  <li><b>Avantatges:</b> Aquest mètode és la millor pràctica per a signatures professionals, ja que tots els clients de correu (inclòs Outlook) renderitzen perfectament les imatges hotlinked en línia.</li>
  <li><b>Comportament del disseny:</b> El botó <i>Crop</i> s'oculta automàticament per a imatges externes ja que s'enllacen directament sense passar pel processador local. Si buides la URL externa, l'aplicació restaurarà la imatge local retallada que tenies guardada en aquest perfil.</li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🏷️ 4. Icones de Contacte Opcionals</h2>
<p>Per afegir dinamisme visual a les teves dades, pots activar la casella <b>Show contact icons</b> a la pestanya <i>Design</i>:</p>
<ul>
  <li><b>Icones SVG en línia:</b> Afegeix elegants icones vectorials per a telèfon, email, web i adreça.</li>
  <li><b>Contact Icon Shape:</b> Un menú selector exclusiu et permet triar la forma del fons d'aquestes icones (Cercle, Arrodonit o Quadrat) de manera independent dels teus icones socials.</li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">⚖️ 5. Bloc de Nota Legal (Legal Disclaimer)</h2>
<p>Al peu de la signatura pots afegir i personalitzar una nota legal de confidencialitat:</p>
<ul>
  <li><b>Text per Defecte:</b> Es carrega automàticament el text legal corporatiu estàndard perquè no l'hagis d'escriure a mà.</li>
  <li><b>Controls d'Estil:</b>
    <ul>
      <li><b>Show legal disclaimer:</b> Interruptor per ocultar-lo o mostrar-lo dinàmicament a la teva signatura final (HTML i text pla).</li>
      <li><b>Mida i Espaiat:</b> Sliders dedicats per regular l'alçada del text (de 8px a 16px) i la distància de separació superior (de 0px a 40px).</li>
      <li><b>Color Picker:</b> Et permet ajustar el color exacte de la nota legal perquè quedi subtil i elegant.</li>
    </ul>
  </li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">📊 6. Formes d'Exportar</h2>
<p>Una vegada acabada la signatura, utilitza la barra d'accions superior dreta del visor de previsualització:</p>
<ol>
  <li><b>Copy HTML:</b> Copia el codi font HTML amb estils incrustats directament al portapapeles per enganxar-lo al teu gestor de correu habitual.</li>
  <li><b>Copy Text:</b> Copia la versió simplificada de només text pla.</li>
  <li><b>Save File:</b> Descarrega la signatura com un arxiu <code>.html</code> físic i independent.</li>
</ol>

<hr style="border: 0; height: 1px; background-color: #D6B972; margin-top: 40px; margin-bottom: 20px;">
<p style="text-align: center; font-size: 0.9em;"><i>L'aplicació recordarà automàticament els teus perfils i eleccions perquè editar les teves signatures diàries requereixi tot just un parell de clics.</i></p>

</div>
