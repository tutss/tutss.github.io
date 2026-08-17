---
description: Retire a sold item from the /shop catalog (_data/products.yml)
argument-hint: [item id or title, optional]
allowed-tools: Read, Edit, Bash, AskUserQuestion, Glob
---

You are removing one sold item from the shop catalog at `_data/products.yml`, the
counterpart to `/new-item`. Work only inside this repository.

Item the user named (may be empty): $ARGUMENTS

## Steps

1. Read `_data/products.yml` and list every item as `id — title — R$ price`.

2. Pick which item sold. If the description above already identifies one (by id or by
   title), use it. Otherwise ask with `AskUserQuestion`, offering the current items as
   options. If nothing matches, stop and tell the user what is in the catalog.

3. Confirm with the user before removing, showing the id and title you are about to
   retire. This edit deletes the listing, so do not skip the confirmation.

4. Remove that item's full YAML entry (from its `- id:` line through its last field,
   including the `images` line). Leave the header comment and the other items intact and
   correctly formatted.

5. Photos: if the removed item had an `images` list pointing at `files/images/shop/`,
   ask whether to also delete those files. Default to deleting them so the repo stays
   clean; keep them only if the user wants a record.

6. Validate: run `bundle exec jekyll build` and confirm it finishes without a YAML error
   for `products.yml`. Confirm `/shop/` no longer lists the item.

7. Report back: which item was retired, how many items remain, and a reminder that the
   family chips and price range on `/shop/` update automatically from what is left. Do
   not commit unless the user asks.

Note: this removes the item entirely rather than showing a "sold" badge. If you ever
want a visible sold-archive instead, that is a separate change to `shop.html`/`shop.js`.
