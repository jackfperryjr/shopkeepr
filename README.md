# ⚖ shopkeepr

> *A live browser for player-owned plaza shops across Elanthia — DragonRealms Prime.*

👉 **[your-username.github.io/shopkeepr](https://jackfperryjr.github.io/shopkeepr)**

---

## What is this?

DragonRealms has player-owned shops scattered across plazas in Crossing, Riverhaven, Shard, and Therenborough. Finding what's for sale means wandering from shop to shop, typing `LIST` in each one, and hoping something catches your eye. That gets old fast.

shopkeepr solves that. It's a searchable, filterable web page that shows every item currently for sale across all four plazas — item name, price, shop, town, and description — updated regularly by a [Lich](https://lichproject.org/) script that walks the plazas and pushes the data here automatically.

---

## What can I do with it?

- **Search** by item name or description — find that perfect weapon or piece of armor without logging in
- **Filter** by town or individual shop
- **Sort** any column — compare prices, browse by shop, find the most recently seen items
- No account needed, no login, works in any browser

---

## How is the data collected?

A Lich script navigates each plaza shop, issues `LIST` and `LOOK` commands to capture sale items and their descriptions, then pushes the results to this repo via the GitHub API. The page loads the JSON directly — no server, no database.

Data is **merged across runs**, so items from shops that couldn't be visited on a given pass are retained until the next successful visit. Each item shows the date it was last confirmed on sale.

---

## Coverage

| Town | Plaza |
|---|---|
| Crossing | The Crossing Plaza |
| Riverhaven | Riverhaven Plaza |
| Shard | The Shard Plaza |
| Therenborough | Therenborough Plaza |

---

## Caveats

Plaza shop inventories change frequently — owners add, remove, and reprice items regularly. The data here reflects the most recent scrape and may not match what's currently on the shelves. Always verify in-game before making a trip.

---

*Not affiliated with or endorsed by [Simutronics](https://www.play.net/). DragonRealms is a trademark of Simutronics Corp.*