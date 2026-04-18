# ⚖ Shopkeepr

> *A Lich script and GitHub Pages site for browsing player-owned plaza shops across Elanthia — DragonRealms Prime.*

---

## What is this?

**Shopkeepr** is a two-part project for [DragonRealms](https://www.play.net/dr/) players:

1. **`shopkeepr.lic`** — A [Lich](https://lichproject.org/) script that walks the player-owned plazas in Crossing, Riverhaven, Shard, and Therenborough, scrapes every sale item (name, price, and description), and pushes the results directly to this repo via the GitHub API.

2. **`index.html`** — A GitHub Pages site that reads the scraped data and presents it as a fast, filterable, searchable table — so you can browse the plazas without logging in.

---

## Live Site

👉 **[your-username.github.io/shopkeepr](https://your-username.github.io/shopkeepr)**

---

## Features

- 🏘 Covers **Crossing, Riverhaven, Shard,** and **Therenborough** plazas
- 🔍 Search by item name or description
- 🗺 Filter by town and shop
- ↕ Sort any column
- 🔄 **Merges** new data with previous runs — items from shops you couldn't visit are retained until next time
- 📅 Each item shows the date it was last seen on sale
- 🚫 No server required — plain static HTML + JSON

---

## Repo Structure

```
shopkeepr/
├── index.html              # GitHub Pages site
├── data/
│   └── plaza_items.json    # Scraped item data (updated by the Lich script)
└── .gitignore
```

The Lich script and config file live **only on your local machine** and are never committed here.

```
~/.lich/scripts/shopkeepr.lic          # the script
~/.lich/data/shopkeepr_config.yaml     # your PAT + repo name (keep this private)
```

---

## Setup

### 1. Enable GitHub Pages

In your repo settings, set GitHub Pages source to **`main` branch, root (`/`)**.

### 2. Create a GitHub Personal Access Token

Go to [github.com/settings/tokens](https://github.com/settings/tokens) and create a token with the **`repo`** scope. You only need to do this once.

### 3. Configure the script locally

Copy `shopkeepr_config.yaml.example` to `~/.lich/data/shopkeepr_config.yaml` and fill it in:

```yaml
github_token: ghp_yourPersonalAccessTokenHere
github_repo:  yourusername/shopkeepr
```

> ⚠️ This file contains your PAT. It is listed in `.gitignore` and must **never** be committed.

### 4. Install the Lich script

Place `shopkeepr.lic` in your Lich scripts folder (`~/.lich/scripts/`).

### 5. Update room IDs

Open `shopkeepr.lic` and fill in the correct room IDs for each plaza shop in the `PLAZA_SHOPS` table near the top of the file. Use `;whereami` in Lich or the [DR map database](https://drinferno.net/map/) to find the right IDs for Prime.

```ruby
PLAZA_SHOPS = [
  { name: "Shop 1", town: "Crossing", room_id: 12345 },
  # ... etc
]
```

### 6. Run it

```
;shopkeepr
```

The script will navigate to each shop using `go2`, scrape the sale listings, fetch item descriptions, merge with any existing data, and push the updated JSON to this repo. Your GitHub Pages site will reflect the changes within a minute or two.

---

## How the Data Pipeline Works

```
Lich script
  └─ go2 navigates to each plaza shop room
  └─ LIST + LOOK scrapes items and descriptions
  └─ Merges with existing JSON (retains items from unvisited shops)
  └─ PUT https://api.github.com/repos/.../plaza_items.json
        └─ Commits updated file to this repo
              └─ GitHub Pages serves index.html
                    └─ index.html fetches data/plaza_items.json on load
```

---

## Data Format

`data/plaza_items.json` looks like this:

```json
{
  "updated_at": "2025-01-15T03:42:00Z",
  "item_count": 347,
  "items": [
    {
      "town":        "Crossing",
      "shop":        "The Gilded Otter",
      "name":        "a silver-hilted hunting knife",
      "price":       "1500 Kronars",
      "description": "A slim blade of folded steel, its hilt wrapped in dark leather...",
      "last_seen":   "2025-01-15"
    }
  ]
}
```

---

## Notes & Caveats

- **Room IDs may shift** after game updates or housing resets. If the script stops visiting a shop, double-check its room ID with `;whereami`.
- The script uses `go2` for navigation — make sure you have the `go2` script installed and your character is in a safe, accessible location before running.
- Sale items in DR plazas are set by shop owners and change frequently. Run the script regularly for fresh data.
- This project is not affiliated with or endorsed by [Simutronics](https://www.play.net/).

---

## License

MIT — do whatever you like with it. A mention or link back is appreciated but not required.

---

*Built with [Lich](https://lichproject.org/) and a lot of wandering through plazas.*
