<div style="background-color: #F9F4EF; color: #141313; padding: 40px; font-family: sans-serif; border-radius: 8px; line-height: 1.6;">

<h1 style="color: #97A788; border-bottom: 3px solid #D6B972; padding-bottom: 10px;">📖 EmailForge - Manual de Usuario Completo</h1>

<p>Bienvenido al manual completo de <b>EmailForge</b>, tu herramienta en local para diseñar firmas de correo electrónico profesionales. Esta aplicación está diseñada para compilar firmas dinámicas 100% compatibles con cualquier cliente de correo moderno (Gmail, Outlook, Apple Mail) utilizando una estructura robusta basada en tablas HTML y CSS en línea.</p>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">👤 1. Gestión de Perfiles y Guardado en Local</h2>
<p>La aplicación cuenta con un sistema de <b>multiperfil</b> en la parte superior para gestionar diferentes firmas de manera independiente:</p>
<ul>
  <li><b>Guardado Automático:</b> Cualquier texto, imagen o parámetro de diseño se guarda automáticamente en la base de datos local de tu navegador (<code>localStorage</code>).</li>
  <li><b>Creación de Perfiles:</b> El desplegable superior te permite crear nuevas firmas o eliminar las existentes al instante.</li>
</ul>

<blockquote style="background-color: #f1ebd8; border-left: 4px solid #D6B972; padding: 10px 15px; margin: 15px 0; font-size: 0.95em;">
  <b>💡 Importante sobre la Pérdida de Datos:</b> Como los perfiles se guardan localmente en el navegador, si borras la caché de navegación se podrían perder. Para evitarlo, usa el menú desplegable:
  <ul style="margin-top: 5px; padding-left: 20px;">
    <li><b>Backup (JSON):</b> Descarga un archivo <code>signatures_backup.json</code> con todas tus firmas y fotos codificadas. Te recomendamos guardar este archivo en la carpeta <code>exported-signatures/</code> del repositorio para tener un backup físico versionado en GitHub.</li>
    <li><b>Restore (JSON):</b> Te permite subir tu archivo de copia de seguridad JSON para restaurar todos tus perfiles al instante.</li>
  </ul>
</blockquote>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🎨 2. Diseños y Plantillas (Pestaña Design)</h2>
<p>EmailForge ofrece <b>7 plantillas de diseño profesionales</b> listas para usar:</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 15px; background-color: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
  <tr style="background-color: #97A788; color: #F9F4EF;">
    <th style="padding: 12px; text-align: left; border: 1px solid #d1c8b4;">Plantilla</th>
    <th style="padding: 12px; text-align: left; border: 1px solid #d1c8b4;">Descripción y Comportamiento</th>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Minimal</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Diseño limpio y pulido con foto/avatar a la izquierda y datos sencillos.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Executive</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Estructura moderna separada por una gruesa línea divisoria vertical en color de acento.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Modern</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Formato llamativo con una cabecera de color sólido que resalta tu nombre y cargo.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Creative</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Una tarjeta de diseño redondeado y moderno, ideal para perfiles artísticos o tecnológicos.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Corporate</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Estructura corporativa clásica, ideal para firmas de empresa muy formales.</td>
  </tr>
  <tr style="color: #141313; background-color: #faf7f2;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Luxury</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Líneas delgadas, amplias y tipografías espaciadas para una imagen de marca premium.</td>
  </tr>
  <tr style="color: #141313; background-color: #ffffff;">
    <td style="padding: 12px; border: 1px solid #e0d5c1;"><b>Hound 🌟</b></td>
    <td style="padding: 12px; border: 1px solid #e0d5c1;">Inspirada en el clásico diseño Signature Hound: avatar centrado en la parte superior, línea divisoria horizontal y una base limpia con datos a la izquierda, logotipo y redes a la derecha.</td>
  </tr>
</table>

<h3 style="color: #97A788; margin-top: 25px;">Parámetros Estéticos Generales</h3>
<ul>
  <li><b>Accent Color:</b> Controla el tono de las líneas, cargos y enlaces activos de tu firma.</li>
  <li><b>Toggles de Visibilidad:</b> Activa o desactiva elementos como la foto de perfil, logotipo corporativo, eslogan o divisores al instante.</li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🖼️ 3. Configuración de Avatar y Logotipo</h2>
<p>EmailForge gestiona de manera independiente las imágenes personales e institucionales:</p>
<ul>
  <li><b>Avatar (Foto):</b> Subida desde la pestaña <i>Details</i>, incluye una herramienta de recorte dinámico. Permite controlar la forma (círculo, cuadrado, redondeado), el tamaño en píxeles y el espaciado superior.</li>
  <li><b>Logotipo de Empresa:</b>
    <ul>
      <li><b>Ubicación:</b> Mediante el selector <i>Logo Position</i>, puedes colocar el logo debajo de tus datos (<i>Below Details</i>) o apilado verticalmente bajo la foto (<i>Below Photo</i>). En ambos casos, el logo se alinea perfectamente.</li>
      <li><b>Escalado Proporcional:</b> El logo se ajusta proporcionalmente al tamaño que indiques en <code>Logo Size</code>, eliminando por completo cualquier espacio en blanco no deseado.</li>
      <li><b>Logo Link URL:</b> Puedes añadir una dirección web para convertir tu logotipo en un hipervínculo que derive tráfico a tu página.</li>
    </ul>
  </li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">🏷️ 4. Iconos de Contacto Opcionales</h2>
<p>Para añadir dinamismo visual a tus datos, puedes activar la casilla <b>Show contact icons</b> en la pestaña <i>Design</i>:</p>
<ul>
  <li><b>Iconos SVG en Línea:</b> Añade elegantes iconos vectoriales autoejecutables para teléfono, email, web y dirección.</li>
  <li><b>Contact Icon Shape:</b> Un menú selector exclusivo te permite elegir la forma del fondo de estos iconos (Círculo, Arredondeado o Cuadrado) de manera independiente de tus iconos sociales.</li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">⚖️ 5. Bloque de Nota Legal (Legal Disclaimer)</h2>
<p>Al pie de la firma puedes añadir y personalizar una nota legal de confidencialidad:</p>
<ul>
  <li><b>Texto por Defecto:</b> Se carga automáticamente el texto legal estándar corporativo para que no tengas que escribirlo a mano.</li>
  <li><b>Controles de Estilo:</b>
    <ul>
      <li><b>Show legal disclaimer:</b> Interruptor para ocultarlo o mostrarlo dinámicamente de tu firma final (HTML y texto plano).</li>
      <li><b>Tamaño y Espaciado:</b> Sliders dedicados para regular la altura del texto (de 8px a 16px) y la distancia superior de separación (de 0px a 40px).</li>
      <li><b>Color picker:</b> Te permite ajustar el color exacto del disclaimer para que quede sutil y profesional.</li>
    </ul>
  </li>
</ul>

<h2 style="color: #D6B972; margin-top: 40px; border-bottom: 1px solid #e0d5c1; padding-bottom: 5px;">📊 6. Formas de Exportar</h2>
<p>Una vez terminada tu firma, usa la barra de acciones superior derecha del visor de previsualización:</p>
<ol>
  <li><b>Copy HTML:</b> Copia el código fuente HTML con estilos incrustados directamente al portapapeles para pegarlo en tu gestor de correo habitual.</li>
  <li><b>Copy Text:</b> Copia la versión simplificada de sólo texto plano.</li>
  <li><b>Save File:</b> Descarga la firma como un archivo <code>.html</code> físico e independiente.</li>
</ol>

<hr style="border: 0; height: 1px; background-color: #D6B972; margin-top: 40px; margin-bottom: 20px;">
<p style="text-align: center; font-size: 0.9em;"><i>La aplicación recordará automáticamente tus perfiles y elecciones para que editar tus firmas diarias requiera apenas un par de clics.</i></p>

</div>
