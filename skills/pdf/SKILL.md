---
name: pdf
description: "Use esta skill sempre que o usuário quiser fazer qualquer coisa com arquivos PDF. Inclui ler ou extrair texto e tabelas de PDFs, combinar ou juntar vários PDFs em um, dividir PDFs, girar páginas, adicionar marcas d'água, criar PDFs novos, preencher formulários em PDF, criptografar e descriptografar, extrair imagens e fazer OCR em PDFs escaneados para torná-los pesquisáveis. Se o usuário citar um arquivo .pdf ou pedir para produzir um, use esta skill."
license: Complete terms in LICENSE.txt
---

# Guia de processamento de PDF

## Visão geral

Este guia cobre as operações essenciais de processamento de PDF com bibliotecas Python e ferramentas de linha de comando. Para recursos avançados, bibliotecas JavaScript e exemplos detalhados, veja REFERENCE.md. Se precisar preencher um formulário em PDF, leia FORMS.md e siga as instruções.

## Início rápido

```python
from pypdf import PdfReader, PdfWriter

# Ler um PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# Extrair texto
text = ""
for page in reader.pages:
    text += page.extract_text()
```

## Bibliotecas Python

### pypdf: operações básicas

#### Juntar PDFs
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

#### Dividir um PDF
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

#### Extrair metadados
```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

#### Girar páginas
```python
reader = PdfReader("input.pdf")
writer = PdfWriter()

page = reader.pages[0]
page.rotate(90)  # Gira 90 graus no sentido horário
writer.add_page(page)

with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

### pdfplumber: extração de texto e tabelas

#### Extrair texto com o layout
```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

#### Extrair tabelas
```python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"Table {j+1} on page {i+1}:")
            for row in table:
                print(row)
```

#### Extração avançada de tabelas
```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:  # Verifica se a tabela não está vazia
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

# Combina todas as tabelas
if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### reportlab: criar PDFs

#### Criação básica de PDF
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter

# Adiciona texto
c.drawString(100, height - 100, "Hello World!")
c.drawString(100, height - 120, "This is a PDF created with reportlab")

# Adiciona uma linha
c.line(100, height - 140, 400, height - 140)

# Salva
c.save()
```

#### Criar PDF com várias páginas
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

# Adiciona conteúdo
title = Paragraph("Report Title", styles['Title'])
story.append(title)
story.append(Spacer(1, 12))

body = Paragraph("This is the body of the report. " * 20, styles['Normal'])
story.append(body)
story.append(PageBreak())

# Página 2
story.append(Paragraph("Page 2", styles['Heading1']))
story.append(Paragraph("Content for page 2", styles['Normal']))

# Gera o PDF
doc.build(story)
```

#### Subscritos e sobrescritos

**IMPORTANTE**: nunca use caracteres Unicode de subscrito/sobrescrito (₀₁₂₃₄₅₆₇₈₉, ⁰¹²³⁴⁵⁶⁷⁸⁹) em PDFs do ReportLab. As fontes embutidas não têm esses glifos, e eles aparecem como caixas pretas sólidas.

Em vez disso, use as tags de marcação XML do ReportLab em objetos Paragraph:
```python
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

styles = getSampleStyleSheet()

# Subscritos: use a tag <sub>
chemical = Paragraph("H<sub>2</sub>O", styles['Normal'])

# Sobrescritos: use a tag <super>
squared = Paragraph("x<super>2</super> + y<super>2</super>", styles['Normal'])
```

Para texto desenhado no canvas (não em objetos Paragraph), ajuste manualmente o tamanho da fonte e a posição em vez de usar subscritos/sobrescritos Unicode.

## Ferramentas de linha de comando

### pdftotext (poppler-utils)
```bash
# Extrair texto
pdftotext input.pdf output.txt

# Extrair texto preservando o layout
pdftotext -layout input.pdf output.txt

# Extrair páginas específicas
pdftotext -f 1 -l 5 input.pdf output.txt  # Páginas 1 a 5
```

### qpdf
```bash
# Juntar PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Dividir páginas
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf
qpdf input.pdf --pages . 6-10 -- pages6-10.pdf

# Girar páginas
qpdf input.pdf output.pdf --rotate=+90:1  # Gira a página 1 em 90 graus

# Remover senha
qpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```

### pdftk (se disponível)
```bash
# Juntar
pdftk file1.pdf file2.pdf cat output merged.pdf

# Dividir
pdftk input.pdf burst

# Girar
pdftk input.pdf rotate 1east output rotated.pdf
```

## Tarefas comuns

### Extrair texto de PDFs escaneados
```python
# Requer: pip install pytesseract pdf2image
import pytesseract
from pdf2image import convert_from_path

# Converte o PDF em imagens
images = convert_from_path('scanned.pdf')

# Faz OCR de cada página
text = ""
for i, image in enumerate(images):
    text += f"Página {i+1}:\n"
    text += pytesseract.image_to_string(image)
    text += "\n\n"

print(text)
```

### Adicionar marca d'água
```python
from pypdf import PdfReader, PdfWriter

# Cria a marca d'água (ou carrega uma existente)
watermark = PdfReader("watermark.pdf").pages[0]

# Aplica a todas as páginas
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

### Extrair imagens
```bash
# Usando pdfimages (poppler-utils)
pdfimages -j input.pdf output_prefix

# Isso extrai todas as imagens como output_prefix-000.jpg, output_prefix-001.jpg etc.
```

### Proteção por senha
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

# Adiciona a senha
writer.encrypt("userpassword", "ownerpassword")

with open("encrypted.pdf", "wb") as output:
    writer.write(output)
```

## Referência rápida

| Tarefa | Melhor ferramenta | Comando/Código |
|--------|-------------------|----------------|
| Juntar PDFs | pypdf | `writer.add_page(page)` |
| Dividir PDFs | pypdf | Uma página por arquivo |
| Extrair texto | pdfplumber | `page.extract_text()` |
| Extrair tabelas | pdfplumber | `page.extract_tables()` |
| Criar PDFs | reportlab | Canvas ou Platypus |
| Juntar pela linha de comando | qpdf | `qpdf --empty --pages ...` |
| OCR de PDFs escaneados | pytesseract | Converta em imagem primeiro |
| Preencher formulários PDF | pdf-lib ou pypdf (veja FORMS.md) | Veja FORMS.md |

## Próximos passos

- Para uso avançado do pypdfium2, veja REFERENCE.md
- Para bibliotecas JavaScript (pdf-lib), veja REFERENCE.md
- Se precisar preencher um formulário em PDF, siga as instruções do FORMS.md
- Para guias de solução de problemas, veja REFERENCE.md
