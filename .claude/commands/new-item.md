---
description: Add a new item to the /shop catalog (_data/products.yml)
argument-hint: [free-form description of the item, optional]
allowed-tools: Read, Edit, Write, Bash, AskUserQuestion, Glob
---

You are adding one item to the shop catalog at `_data/products.yml`. Each item becomes
a card on `/shop/` and a detail page. Work only inside this repository.

Item described by the user (may be empty): $ARGUMENTS

## Steps

1. Read `_data/products.yml`. Note the existing `family` values and all existing `id`
   values so you can reuse family names and avoid id collisions.

2. Collect the fields below. Take whatever the user already gave in the description
   above, then ask only for what is missing. Use `AskUserQuestion` for the choices
   (condition, and family when reusing an existing one); ask for the free-text fields
   in plain chat. Keep every value in the user's language (Portuguese for the current
   catalog).

   - `title`: required, e.g. "iPhone 15 256GB".
   - `family`: the filter group. Offer the existing families first; only create a new
     one if the item does not fit any of them.
   - `condition`: `novo` or `usado`.
   - `price`: selling price as a plain number in BRL (no "R$", no thousands separator),
     e.g. `3990`.
   - `original`: optional list/original price for the strikethrough. Omit the field if
     there is no discount.
   - `short`: one-line summary (shown on the list layout).
   - `notes`: your personal notes about the item ("Minhas notas").
   - `vendor`: manufacturer-style description ("Descrição do fabricante").
   - `specs`: 3 to 6 rows of `[label, value]`, e.g. `["Armazenamento", "256 GB"]`.

3. Generate a short, unique `id` slug from the title (lowercase, letters and digits
   only, no spaces), e.g. `ip15`, `xm5`. If it collides with an existing id, add a
   short suffix.

4. Photos (optional). Ask if the user has photos to include.
   - If yes, ask for the file paths. Create `files/images/shop/` if it does not exist,
     copy each photo there as `<id>-1.<ext>`, `<id>-2.<ext>`, ... and set `images` to
     the site paths, e.g. `["/files/images/shop/ip15-1.jpg", "/files/images/shop/ip15-2.jpg"]`.
     The first image is the hero; the rest become thumbnails.
   - If no photos, set `images: []`. The card shows a "Foto — <title>" placeholder.

5. Append the new entry to the end of `_data/products.yml`, matching the exact
   indentation and quoting style of the entries already in the file. Multi-line free
   text stays on one line (plain scalar); wrap a value in double quotes only if it
   contains a colon-space or other YAML-sensitive characters.

6. Validate: run `bundle exec jekyll build` and confirm it finishes without a YAML
   error for `products.yml`. If it fails, fix the entry and rebuild.

7. Report back: the item's `id`, `title`, `price`, whether a discount is shown, and how
   to preview it (`bundle exec jekyll serve`, then open `/shop/`). Do not commit unless
   the user asks.

## Example entry

```yaml
- id: ip15
  family: iPhones
  title: iPhone 15 256GB
  condition: novo
  price: 4890
  original: 5499
  short: Lacrado, comprado esse mês. Não me adaptei ao tamanho.
  notes: Comprado esse mês, lacrado. Não me adaptei ao tamanho e prefiro vender.
  vendor: iPhone 15 com Dynamic Island, chip A16 Bionic, câmera de 48 MP e USB-C.
  specs:
    - ["Armazenamento", "256 GB"]
    - ["Saúde da bateria", "100%"]
    - ["Cor", "Preto"]
    - ["Estado", "Lacrado"]
    - ["Conector", "USB-C"]
  images: []
```
