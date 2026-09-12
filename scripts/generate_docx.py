import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_proposal_docx(output_path):
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
        # Header & Footer
        footer = section.footer
        p_footer = footer.paragraphs[0]
        p_footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_footer_run = p_footer.add_run("AdventureOS · Propuesta Comercial Confidencial")
        p_footer_run.font.size = Pt(8.5)
        p_footer_run.font.color.rgb = RGBColor(148, 163, 184)

    # Styles
    navy = RGBColor(15, 23, 42)      # #0F172A
    orange = RGBColor(234, 88, 12)    # #EA580C
    slate = RGBColor(71, 85, 105)     # #475569
    dark = RGBColor(30, 41, 59)       # #1E293B

    # Document Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_badge = title_p.add_run("PROPUESTA COMERCIAL DE MODERNIZACIÓN TECNOLÓGICA")
    run_badge.font.name = "Segoe UI"
    run_badge.font.size = Pt(10)
    run_badge.font.bold = True
    run_badge.font.color.rgb = orange

    h1_p = doc.add_paragraph()
    h1_p.paragraph_format.space_before = Pt(2)
    h1_p.paragraph_format.space_after = Pt(6)
    run_title = h1_p.add_run("Plataforma AdventureOS")
    run_title.font.name = "Segoe UI"
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = navy

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Solución Integral de Ventas Online, Waivers Digitales, Taquilla POS y Control de Acceso Anti-Fraude para Parques Recreativos")
    run_sub.font.name = "Segoe UI"
    run_sub.font.size = Pt(12)
    run_sub.font.color.rgb = slate

    # Metadata Box Table
    meta_table = doc.add_table(rows=2, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    cell_meta = meta_table.cell(0, 0)
    set_cell_background(cell_meta, "F8FAFC")
    set_cell_margins(cell_meta, 180, 180, 220, 220)
    
    p_meta1 = cell_meta.paragraphs[0]
    p_meta1.paragraph_format.space_after = Pt(3)
    r1 = p_meta1.add_run("Preparado para: ")
    r1.font.bold = True
    r1.font.color.rgb = navy
    p_meta1.add_run("Dirección General, Gerencia de Operaciones y Dirección Financiera").font.color.rgb = dark

    p_meta2 = cell_meta.add_paragraph()
    p_meta2.paragraph_format.space_after = Pt(0)
    r2 = p_meta2.add_run("Asunto: ")
    r2.font.bold = True
    r2.font.color.rgb = navy
    p_meta2.add_run("Implementación de AdventureOS — Modernización y Rentabilidad Operativa").font.color.rgb = dark

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Greeting & Opening Letter
    p_greet = doc.add_paragraph()
    r_greet = p_greet.add_run("Estimado(a) Director(a) / Propietario(a):")
    r_greet.font.name = "Segoe UI"
    r_greet.font.bold = True
    r_greet.font.size = Pt(11)
    r_greet.font.color.rgb = navy

    p_body1 = doc.add_paragraph()
    p_body1.paragraph_format.line_spacing = 1.15
    p_body1.paragraph_format.space_after = Pt(8)
    r_b1 = p_body1.add_run(
        "Gestionar un centro recreativo de alta afluencia presenta desafíos diarios muy específicos: filas lentas en taquilla que frustran a los clientes, cientos de hojas de papel de descargos de responsabilidad (waivers) difíciles de archivar y validar ante un reclamo legal, reingresos no controlados de boletos en pista y descuadres de caja entre cobros en efectivo y terminales bancarias."
    )
    r_b1.font.name = "Segoe UI"
    r_b1.font.size = Pt(10)
    r_b1.font.color.rgb = dark

    p_body2 = doc.add_paragraph()
    p_body2.paragraph_format.line_spacing = 1.15
    p_body2.paragraph_format.space_after = Pt(14)
    r_b2 = p_body2.add_run(
        "AdventureOS fue concebido y desarrollado para solucionar de manera definitiva estos dolores operativos. Le presentamos una plataforma moderna, probada y lista para operar, diseñada para multiplicar sus ventas anticipadas por internet, reducir en un 90% el tiempo de atención en recepción y blindar legal y financieramente cada metro de su operación."
    )
    r_b2.font.name = "Segoe UI"
    r_b2.font.size = Pt(10)
    r_b2.font.color.rgb = dark

    def add_section_header(title):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(6)
        run = h.add_run(title)
        run.font.name = "Segoe UI"
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = navy
        return h

    # Section 1: Impacto en el Negocio
    add_section_header("1. El Impacto en su Negocio: ¿Por qué AdventureOS?")
    
    t1 = doc.add_table(rows=5, cols=3)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.autofit = False

    t1_headers = ["Desafío Actual en su Parque", "Cómo lo Resuelve AdventureOS", "Beneficio Económico Directo"]
    t1_widths = [Inches(2.1), Inches(2.7), Inches(2.2)]

    for i, h_text in enumerate(t1_headers):
        cell = t1.cell(0, i)
        cell.width = t1_widths[i]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 120, 120, 140, 140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(h_text)
        r.font.name = "Segoe UI"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    t1_rows = [
        ("Pérdida de clientes por filas largas en taquilla", "Los clientes compran online, eligen horario y firman el waiver desde su celular antes de llegar.", "Aumento de ventas: Clientes que antes se desanimaban por la fila compran con anticipación."),
        ("Costo y riesgo legal de waivers en papel", "Firma electrónica en pantalla (móvil o kiosco) con registro forense inmutable (IP, hora exacta, tutor legal).", "Cero gasto en papel y tranquilidad total respaldada ante aseguradoras y litigios."),
        ("Boletos compartidos o fotocopiados en pista", "Pases digitales QR de un solo uso validados atómicamente por operarios con semáforo óptico instantáneo.", "Cero filtraciones: Nadie entra a una actividad sin validación confirmada del pago."),
        ("Descuadres en caja al final del turno", "Módulo POS con apertura formal de fondo de caja, calculadora de cambio y arqueo ciego por cajero.", "Control total del dinero: Cada peso y dólar queda cuadrado de forma transparente.")
    ]

    for row_idx, row_data in enumerate(t1_rows, start=1):
        bg = "FFFFFF" if row_idx % 2 != 0 else "F8FAFC"
        for col_idx, text in enumerate(row_data):
            cell = t1.cell(row_idx, col_idx)
            cell.width = t1_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 100, 100, 120, 120)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.font.size = Pt(9)
            r.font.color.rgb = dark
            if col_idx == 0:
                r.font.bold = True

    # Section 2: Experiencia del Visitante
    add_section_header("2. La Experiencia para sus Visitantes (Vender Más y Mejor)")
    
    bullets_sec2 = [
        ("Catálogo Visual de Experiencias y Paquetes: ", "Presentación atractiva de experiencias individuales y paquetes cerrados para grupos y familias (Crew 5, Battle 10, Triple Pass) con tarifas transparentes."),
        ("Registro Anticipado de Participantes: ", "En compras grupales, el cliente asigna los nombres de sus acompañantes desde la web, ahorrándole a su personal de recepción la captura manual de datos."),
        ("Bilingüe Nativo (Español / Inglés): ", "Indispensable si recibe turismo internacional. El visitante cambia de idioma en un clic y todo el catálogo, descargo legal y checkout se adapta al instante."),
        ("Claridad Impositiva Total: ", "Impuestos locales (ITBIS 18%) claramente desglosados en el flujo para evitar fricciones al momento de pagar.")
    ]

    for b_title, b_desc in bullets_sec2:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(b_title)
        r_bt.font.name = "Segoe UI"
        r_bt.font.bold = True
        r_bt.font.size = Pt(9.5)
        r_bt.font.color.rgb = navy
        r_bd = bp.add_run(b_desc)
        r_bd.font.name = "Segoe UI"
        r_bd.font.size = Pt(9.5)
        r_bd.font.color.rgb = dark

    # Section 3: Control Operativo
    add_section_header("3. Control Operativo y Seguridad para su Personal")

    sec3_items = [
        ("A) Taquilla y Recepción (Módulo Cajero POS)", [
            "Búsqueda instantánea en 1 segundo por código de orden, nombre o QR.",
            "Cobro flexible con tarjeta física en terminal bancario o en efectivo con calculadora de cambio.",
            "Impresión de ticket térmico de 80mm con autocorte y voucher desglosado.",
            "Control formal de turnos de caja con fondo inicial y arqueo de cierre."
        ]),
        ("B) Control en Pista y Atracciones (Módulo Escáner Staff)", [
            "Escaneo rápido con smartphone o lector óptico 2D inalámbrico.",
            "Semáforo óptico gigante en pantalla (Verde: Aprobado, Rojo: Ya usado, Ámbar: Espera) visible bajo luz solar.",
            "Bloqueo atómico anti-doble uso que invalida duplicados o capturas de pantalla instantáneamente."
        ]),
        ("C) Dirección y Gerencia (Panel Administrativo en Vivo)", [
            "Métricas clave en tiempo real: ingresos del día, órdenes procesadas, participantes y waivers completados.",
            "Conversión automática de divisas en Dólares (USD) y Pesos Dominicanos (DOP).",
            "Gestión inmediata de catálogo para activar experiencias o ajustar precios en segundos."
        ])
    ]

    for title, items in sec3_items:
        hp = doc.add_paragraph()
        hp.paragraph_format.space_before = Pt(8)
        hp.paragraph_format.space_after = Pt(3)
        hrun = hp.add_run(title)
        hrun.font.name = "Segoe UI"
        hrun.font.bold = True
        hrun.font.size = Pt(10.5)
        hrun.font.color.rgb = orange

        for item in items:
            ip = doc.add_paragraph(style='List Bullet')
            ip.paragraph_format.space_after = Pt(2)
            irun = ip.add_run(item)
            irun.font.name = "Segoe UI"
            irun.font.size = Pt(9.5)
            irun.font.color.rgb = dark

    # Section 4: Cobros y Pagos
    add_section_header("4. Cobros y Pasarelas de Pago: Depósito Directo a su Banco")
    
    p_bank = doc.add_paragraph()
    p_bank.paragraph_format.space_after = Pt(6)
    r_bank = p_bank.add_run(
        "Usted mantiene el control total de sus finanzas. AdventureOS no retiene su dinero ni actúa como intermediario; los fondos de cada venta online o presencial se acreditan directamente en las cuentas bancarias de su empresa."
    )
    r_bank.font.name = "Segoe UI"
    r_bank.font.size = Pt(9.5)
    r_bank.font.color.rgb = dark

    gateways = [
        ("AZUL (Banco Popular - República Dominicana): ", "Integración oficial con Hosted Checkout y protocolo 3D-Secure 2.0 con firma criptográfica HMAC-SHA512. Depósitos en DOP o USD en su cuenta local."),
        ("CardNet / Carnet: ", "Conexión con adquirencia local para aceptación masiva de tarjetas dominicanas e internacionales."),
        ("Stripe & Apple Pay / Google Pay: ", "Cobros instantáneos para turistas internacionales con tarjetas Visa, Mastercard y American Express de todo el mundo."),
        ("PayPal Commerce: ", "Ideal para captar reservas anticipadas de turistas extranjeros antes de que viajen a su destino."),
        ("Cobro Físico en Taquilla: ", "Integración con terminales bancarias físicas y registro de efectivo con calculadora de cambio.")
    ]

    for g_title, g_desc in gateways:
        gp = doc.add_paragraph(style='List Bullet')
        gp.paragraph_format.space_after = Pt(3)
        gr1 = gp.add_run(g_title)
        gr1.font.bold = True
        gr1.font.name = "Segoe UI"
        gr1.font.size = Pt(9.5)
        gr1.font.color.rgb = navy
        gr2 = gp.add_run(g_desc)
        gr2.font.name = "Segoe UI"
        gr2.font.size = Pt(9.5)
        gr2.font.color.rgb = dark

    # Section 5: Propuesta Económica
    add_section_header("5. Propuesta Económica y Opciones de Inversión")

    p_eco_intro = doc.add_paragraph()
    p_eco_intro.paragraph_format.space_after = Pt(8)
    r_eco = p_eco_intro.add_run(
        "Presentamos dos esquemas comerciales claros, sin costos ocultos, estructurados para adaptarse al modelo financiero y flujo de caja de su complejo recreativo:"
    )
    r_eco.font.name = "Segoe UI"
    r_eco.font.size = Pt(9.5)
    r_eco.font.color.rgb = dark

    # Pricing Table (2 columns: Option A and Option B)
    t_price = doc.add_table(rows=9, cols=3)
    t_price.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_price.autofit = False

    t_price_headers = ["Concepto / Módulo", "Opción A: Plan Cloud SaaS (Recomendado)", "Opción B: Licencia Empresarial (Propiedad)"]
    t_price_widths = [Inches(2.6), Inches(2.3), Inches(2.1)]

    for i, h_text in enumerate(t_price_headers):
        cell = t_price.cell(0, i)
        cell.width = t_price_widths[i]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 120, 120, 140, 140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i > 0 else WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(h_text)
        r.font.name = "Segoe UI"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    price_rows = [
        ("Cuota de Implementación & Setup Inicial (Pago único)", "US$ 1,200 (~RD$ 72,000)", "US$ 6,800 (~RD$ 408,000)"),
        ("Cuota de Servicio Mensual", "US$ 290 / mes (~RD$ 17,400)", "US$ 0 / mes"),
        ("Pases Digitales QR y Waivers", "Ilimitados", "Ilimitados"),
        ("Usuarios y Cajas POS", "Ilimitados", "Ilimitados"),
        ("Servidores Cloud, SSL y Base de Datos", "Incluido", "Gestionado por el cliente"),
        ("Equipamiento Físico (Hardware)", "No incluido", "No incluido"),
        ("Propiedad del Código Fuente", "No (Licencia por uso)", "Sí (Código entregado)"),
        ("Soporte Técnico y Actualizaciones", "24/7 Continuo incluido", "90 días incluidos (luego opcional)")
    ]

    for row_idx, row_data in enumerate(price_rows, start=1):
        bg = "FFFFFF" if row_idx % 2 != 0 else "F8FAFC"
        for col_idx, text in enumerate(row_data):
            cell = t_price.cell(row_idx, col_idx)
            cell.width = t_price_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 100, 100, 120, 120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx > 0 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.font.size = Pt(9)
            r.font.color.rgb = dark
            if col_idx == 0:
                r.font.bold = True
            if row_idx in (1, 2) and col_idx > 0:
                r.font.bold = True
                r.font.color.rgb = orange if col_idx == 1 else navy

    # ROI Section
    p_roi_h = doc.add_paragraph()
    p_roi_h.paragraph_format.space_before = Pt(14)
    p_roi_h.paragraph_format.space_after = Pt(4)
    r_roi_h = p_roi_h.add_run("5.2. Análisis de Retorno de Inversión (ROI Mensual): ¿Por qué se paga solo?")
    r_roi_h.font.name = "Segoe UI"
    r_roi_h.font.bold = True
    r_roi_h.font.size = Pt(11)
    r_roi_h.font.color.rgb = navy

    t_roi = doc.add_table(rows=8, cols=3)
    t_roi.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_roi.autofit = False

    t_roi_headers = ["Concepto de Ahorro / Recuperación", "Cálculo Estimado Mensual", "Retorno Estimado"]
    t_roi_widths = [Inches(2.6), Inches(2.5), Inches(1.9)]

    for i, h_text in enumerate(t_roi_headers):
        cell = t_roi.cell(0, i)
        cell.width = t_roi_widths[i]
        set_cell_background(cell, "1E293B")
        set_cell_margins(cell, 100, 100, 120, 120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if i == 2 else WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(h_text)
        r.font.name = "Segoe UI"
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    roi_rows = [
        ("Ahorro en papel, tóner y archivadores de waivers", "~1,200 hojas impresas, carpetas y archivo manual", "+ US$ 350 / mes"),
        ("Eliminación de fraude y boletos duplicados en pista", "Recuperación de un 2% de entradas filtradas", "+ US$ 720 / mes"),
        ("Incremento en ticket promedio por venta online previa", "Paquetes cerrados grupales comprados con anticipación", "+ US$ 1,100 / mes"),
        ("Reducción de personal extra en taquilla en horas pico", "Descongestión del 90% de la fila mediante pre-check-in", "+ US$ 400 / mes"),
        ("Beneficio Neto Mensual Estimado", "Ingresos adicionales y ahorros generados", "+ US$ 2,570 / mes"),
        ("Costo del Software (Plan SaaS)", "Cuota de servicio mensual", "- US$ 290 / mes"),
        ("Ganancia Neta Mensual para su Parque", "Retorno Positivo desde el Primer Mes", "+ US$ 2,280 / mes")
    ]

    for row_idx, row_data in enumerate(roi_rows, start=1):
        bg = "FFFFFF" if row_idx % 2 != 0 else "F8FAFC"
        if row_idx == 7:
            bg = "FEF3C7"  # light amber highlight
        for col_idx, text in enumerate(row_data):
            cell = t_roi.cell(row_idx, col_idx)
            cell.width = t_roi_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 90, 90, 110, 110)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if col_idx == 2 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.font.size = Pt(8.5)
            r.font.color.rgb = dark
            if row_idx in (5, 6, 7):
                r.font.bold = True
            if row_idx == 7:
                r.font.size = Pt(9.5)
                r.font.color.rgb = orange

    # Commercial Conditions
    p_cond_h = doc.add_paragraph()
    p_cond_h.paragraph_format.space_before = Pt(12)
    p_cond_h.paragraph_format.space_after = Pt(4)
    r_cond_h = p_cond_h.add_run("5.3. Condiciones Comerciales y Forma de Pago")
    r_cond_h.font.name = "Segoe UI"
    r_cond_h.font.bold = True
    r_cond_h.font.size = Pt(11)
    r_cond_h.font.color.rgb = navy

    conds = [
        ("Moneda de Cotización: ", "Valores expresados en Dólares Estadounidenses (USD) o pagaderos en Pesos Dominicanos (DOP) a la tasa oficial del Banco Central de la República Dominicana al momento de la facturación."),
        ("Forma de Pago de Implementación: ", "50% de anticipo a la firma de la orden de servicio y entrega del cronograma; 50% restante contra entrega del sistema en vivo y finalización de la capacitación del personal."),
        ("Validez de la Oferta: ", "Esta cotización económica se mantiene garantizada por 30 días calendario a partir de la fecha de entrega."),
        ("Garantía de Satisfacción Operativa: ", "Incluye acompañamiento técnico dedicado durante el primer fin de semana completo de operación con público para garantizar cero incidencias en taquilla y pista.")
    ]

    for c_title, c_desc in conds:
        cp = doc.add_paragraph(style='List Bullet')
        cp.paragraph_format.space_after = Pt(3)
        cr1 = cp.add_run(c_title)
        cr1.font.bold = True
        cr1.font.name = "Segoe UI"
        cr1.font.size = Pt(9.5)
        cr1.font.color.rgb = navy
        cr2 = cp.add_run(c_desc)
        cr2.font.name = "Segoe UI"
        cr2.font.size = Pt(9.5)
        cr2.font.color.rgb = dark

    # Section 6: Cronograma de Implementación
    add_section_header("6. Cronograma de Implementación (En Marcha en 3 Semanas)")

    t_cron = doc.add_table(rows=5, cols=3)
    t_cron.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_cron.autofit = False

    t_cron_headers = ["Etapa", "Plazo", "Entregables Principales"]
    t_cron_widths = [Inches(1.8), Inches(1.2), Inches(4.0)]

    for i, h_text in enumerate(t_cron_headers):
        cell = t_cron.cell(0, i)
        cell.width = t_cron_widths[i]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 100, 100, 120, 120)
        p = cell.paragraphs[0]
        r = p.add_run(h_text)
        r.font.name = "Segoe UI"
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    cron_rows = [
        ("Fase 1: Configuración y Marca", "Días 1 a 5", "Carga de catálogo con fotos y tarifas, personalización gráfica y redacción de waiver legal adaptado."),
        ("Fase 2: Conexión Bancaria", "Días 6 a 10", "Conexión con credenciales de AZUL, CardNet o Stripe; pruebas de cobro real y simulado en ambiente seguro."),
        ("Fase 3: Capacitación de Personal", "Días 11 a 15", "Talleres prácticos de 30 minutos con cajeros (POS) y operarios de pista (Escáner). Pruebas de estrés."),
        ("Fase 4: Lanzamiento en Vivo", "Día 16 en adelante", "Apertura del sistema al público con acompañamiento y monitoreo técnico en tiempo real.")
    ]

    for row_idx, row_data in enumerate(cron_rows, start=1):
        bg = "FFFFFF" if row_idx % 2 != 0 else "F8FAFC"
        for col_idx, text in enumerate(row_data):
            cell = t_cron.cell(row_idx, col_idx)
            cell.width = t_cron_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, 90, 90, 110, 110)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.name = "Segoe UI"
            r.font.size = Pt(8.5)
            r.font.color.rgb = dark
            if col_idx == 0:
                r.font.bold = True

    # Section 7: Call to Action
    add_section_header("7. Próximo Paso Recomendado")

    p_cta1 = doc.add_paragraph(style='List Bullet')
    p_cta1.paragraph_format.space_after = Pt(4)
    r_cta1_t = p_cta1.add_run("Demostración Interactiva en Vivo (20 minutos): ")
    r_cta1_t.font.bold = True
    r_cta1_t.font.name = "Segoe UI"
    r_cta1_t.font.size = Pt(9.5)
    r_cta1_t.font.color.rgb = navy
    p_cta1.add_run("Navegaremos juntos por el catálogo, realizaremos una compra de prueba, firmaremos un waiver desde el celular y validaremos el pase en el escáner de pista.").font.size = Pt(9.5)

    p_cta2 = doc.add_paragraph(style='List Bullet')
    p_cta2.paragraph_format.space_after = Pt(12)
    r_cta2_t = p_cta2.add_run("Planificación de Despliegue Personalizada: ")
    r_cta2_t.font.bold = True
    r_cta2_t.font.name = "Segoe UI"
    r_cta2_t.font.size = Pt(9.5)
    r_cta2_t.font.color.rgb = navy
    p_cta2.add_run("Definiremos la fecha óptima de inicio para que su parque esté 100% operativo y modernizado en menos de 3 semanas.").font.size = Pt(9.5)

    # Signoff Block
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(12)
    r_sign1 = p_sign.add_run("AdventureOS — Tecnología que Acelera su Parque.\n")
    r_sign1.font.name = "Segoe UI"
    r_sign1.font.bold = True
    r_sign1.font.size = Pt(11)
    r_sign1.font.color.rgb = orange

    r_sign2 = p_sign.add_run("Quedamos a su entera disposición para coordinar la sesión demostrativa en el día y horario que mejor convenga a su agenda.")
    r_sign2.font.name = "Segoe UI"
    r_sign2.font.italic = True
    r_sign2.font.size = Pt(10)
    r_sign2.font.color.rgb = slate

    # Save
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\DevIa\SunKartPC\docs\PROPUESTA_COMERCIAL.docx")
    create_proposal_docx(out)
