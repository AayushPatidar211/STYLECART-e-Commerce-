from pathlib import Path
import re
import sys
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "stylecart-project-report.md"
OUTPUT = ROOT / "docs" / "StyleCart_Project_Interview_Report.pdf"


def inline_markup(text):
    escaped = escape(text)
    escaped = re.sub(r"`([^`]+)`", r'<font name="Courier" size="8">\1</font>', escaped)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"\*(.+?)\*", r"<i>\1</i>", escaped)
    return escaped


def build_story(markdown, styles):
    story = []
    paragraph_lines = []
    list_items = []
    code_lines = []
    in_code = False
    list_kind = None

    def flush_paragraph():
        if paragraph_lines:
            text = " ".join(line.strip() for line in paragraph_lines)
            story.append(Paragraph(inline_markup(text), styles["BodyTextCustom"]))
            story.append(Spacer(1, 3))
            paragraph_lines.clear()

    def flush_list():
        nonlocal list_kind
        if list_items:
            for item in list_items:
                bullet = "&#8226;" if list_kind == "bullet" else "&#8226;"
                story.append(Paragraph(f"{bullet} &nbsp; {inline_markup(item)}", styles["ListCustom"]))
            story.append(Spacer(1, 3))
            list_items.clear()
        list_kind = None

    for raw in markdown.splitlines():
        line = raw.rstrip()
        if line.startswith("```"):
            flush_paragraph()
            flush_list()
            if in_code:
                story.append(Preformatted("\n".join(code_lines), styles["CodeCustom"]))
                story.append(Spacer(1, 5))
                code_lines.clear()
            in_code = not in_code
            continue
        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            flush_paragraph()
            flush_list()
            continue

        heading = re.match(r"^(#{1,3})\s+(.*)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            level = len(heading.group(1))
            style = styles[f"Heading{level}Custom"]
            story.append(KeepTogether([Paragraph(inline_markup(heading.group(2)), style), HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#cbd5e1"), spaceAfter=5)]))
            continue

        if line.startswith("> "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(inline_markup(line[2:]), styles["QuoteCustom"]))
            story.append(Spacer(1, 4))
            continue

        if re.fullmatch(r"[-*_]{3,}", line.strip()):
            flush_paragraph()
            flush_list()
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=7))
            continue

        bullet = re.match(r"^\s*[-+]\s+(.*)$", line)
        numbered = re.match(r"^\s*\d+\.\s+(.*)$", line)
        if bullet or numbered:
            flush_paragraph()
            requested_kind = "bullet" if bullet else "numbered"
            if list_kind and list_kind != requested_kind:
                flush_list()
            list_kind = requested_kind
            list_items.append((bullet or numbered).group(1))
            continue

        if line.startswith("|") and line.endswith("|"):
            flush_paragraph()
            flush_list()
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
                story.append(Paragraph(" &nbsp; | &nbsp; ".join(inline_markup(cell) for cell in cells), styles["TableLineCustom"]))
            continue

        flush_list()
        paragraph_lines.append(line)

    flush_paragraph()
    flush_list()
    if code_lines:
        story.append(Preformatted("\n".join(code_lines), styles["CodeCustom"]))
    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 14 * mm, width - doc.rightMargin, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#475569"))
    canvas.drawString(doc.leftMargin, 9 * mm, "StyleCart | Project Interview Report")
    canvas.drawRightString(width - doc.rightMargin, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def main():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Heading1Custom", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=17, leading=21, textColor=colors.HexColor("#16324f"), spaceBefore=12, spaceAfter=6, keepWithNext=True))
    styles.add(ParagraphStyle(name="Heading2Custom", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=colors.HexColor("#0f766e"), spaceBefore=9, spaceAfter=4, keepWithNext=True))
    styles.add(ParagraphStyle(name="Heading3Custom", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=colors.HexColor("#334155"), spaceBefore=6, spaceAfter=3, keepWithNext=True))
    styles.add(ParagraphStyle(name="BodyTextCustom", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.7, leading=12, textColor=colors.HexColor("#1f2937"), spaceAfter=3))
    styles.add(ParagraphStyle(name="ListCustom", parent=styles["BodyTextCustom"], leftIndent=12, firstLineIndent=-8, spaceAfter=2))
    styles.add(ParagraphStyle(name="QuoteCustom", parent=styles["BodyTextCustom"], leftIndent=10, rightIndent=10, borderColor=colors.HexColor("#0f766e"), borderWidth=2, borderPadding=6, backColor=colors.HexColor("#f0fdfa"), fontName="Helvetica-Oblique"))
    styles.add(ParagraphStyle(name="CodeCustom", fontName="Courier", fontSize=7, leading=9, leftIndent=6, rightIndent=6, backColor=colors.HexColor("#f1f5f9"), borderPadding=6, spaceBefore=3, spaceAfter=3))
    styles.add(ParagraphStyle(name="TableLineCustom", parent=styles["BodyTextCustom"], fontSize=8, leading=11, leftIndent=8, spaceAfter=2))

    markdown = SOURCE.read_text(encoding="utf-8")
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4,
        rightMargin=17 * mm, leftMargin=17 * mm,
        topMargin=17 * mm, bottomMargin=20 * mm,
        title="StyleCart Project Interview Report",
        author="StyleCart Project Documentation",
        subject="Architecture, technology stack, features, and interview preparation",
    )
    story = build_story(markdown, styles)
    document.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"Created {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"PDF generation failed: {error}", file=sys.stderr)
        raise