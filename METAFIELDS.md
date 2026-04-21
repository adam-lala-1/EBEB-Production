# Shopify Metafield Definitions

These metafields enable the editorial Trident product template to be reused for any product (Trojan, Lightning, etc.) by the client — no developer required.

The client sets these up **once** in their Shopify admin under
**Settings → Custom data → Products → Add definition**.

## Product metafields

| Namespace | Key | Type | Used by section | Purpose |
|---|---|---|---|---|
| `eeb` | `subtitle` | Single line text | `trident-overview` | Shown under product title (e.g. "Semi-Recumbent Fat Tyre Electric Tricycle") |
| `eeb` | `tagline` | Single line text | `trident-overview` | Optional short marketing line |
| `eeb` | `key_features` | List of single-line text | `trident-key-features` | Quick-scan badges (label + sub) |
| `eeb` | `tech_cards` | List of references → metaobject `tech_card` | `trident-tech-showcase` | Close-up tech feature cards |
| `eeb` | `ride_story_quote` | Multi-line text | `trident-ride-story` | Customer testimonial |
| `eeb` | `ride_story_image` | File reference (image) | `trident-ride-story` | Story photo |
| `eeb` | `ride_story_attribution` | Single line text | `trident-ride-story` | "Active at 72" |
| `eeb` | `motor_options` | List of single-line text | `trident-overview` | e.g. ["Cadence Sensor", "Torque Sensor"] |
| `eeb` | `colour_swatches` | List of color | `trident-overview` | Colour chips |

## Metaobject: `tech_card`

For the tech showcase. Define under **Settings → Custom data → Metaobjects → Add definition**:

| Field | Type |
|---|---|
| `title` | Single line text |
| `description` | Multi-line text |
| `image` | File reference (image) |

## How to apply

1. Define the metafields above
2. Open the Trident product → fill in the metafield values
3. Open **Online Store → Themes → Customize → Products → Trident** → choose template `product.trident`
4. The same template can be assigned to other products in admin once they have these metafields filled in

The Liquid sections already reference `product.metafields.eeb.*` where relevant — no theme code changes needed when adding a new product.
