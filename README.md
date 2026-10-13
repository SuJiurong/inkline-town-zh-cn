# Inkline Town

**墨线小镇 · 简体中文版**

这是一款在浏览器中运行的城镇建设游戏。你将担任一届市长，修路、建房、规划产业链，
为居民提供食物与服务，并在任期结束前完成建设目标。
游戏主界面、建城设置、资源与建筑说明、政策、事件提示和结算界面默认使用简体中文。
内部标识与存档格式保持兼容；旧存档中已经记录的历史事件仍保留原文。
模型预览与美术开发页面暂时保留英文。

[中文玩法说明](docs/how-to-play.zh-CN.md) · [Cloudflare 自动部署](#部署到-cloudflare-workers)

**A town-builder drawn in ink, played in one sitting.** You are the mayor for
a single term: 45, 60, or 90 minutes. Lay the roads, house the settlers, build
the chains that feed and clothe them, and grow a busy town of citizens before
your time runs out. Or watch it go bankrupt, revolt, or empty out.

![A complete town at the end of its fifth year: hundreds of homes, farms, mills, and workshops on a pale island](docs/screenshots/town-complete.webp)

Inkline Town plays like a small Anno in a small box. Every building, cart, and
person is drawn live in thin 3D line art. Pan, zoom and rotate the island;
every map is new, and every
term ends with a verdict and the story of how you got there.

## A new charter, a new land

Each town starts with a charter. You choose the size of the land, how rich it
is in forest, stone, ore, and lakes, and how long your term runs. Every seed
makes a different island, with a wandering coast and capes reaching out.

![The charter: choosing a large, rich land and a 60-minute term, with a preview of the island](docs/screenshots/charter.webp)

<table>
  <tr>
    <td><img src="docs/screenshots/map-small-rich.webp" alt="A small, rich town 25 minutes in: farms, a windmill, and homes around the town hall"></td>
    <td><img src="docs/screenshots/map-large-harsh.webp" alt="A large, harsh island 50 minutes into a 90-minute term, the town clustered in the middle while the crown asks for tools"></td>
  </tr>
  <tr>
    <td align="center"><sub>small land, rich: farms and mills by year three</sub></td>
    <td align="center"><sub>large land, harsh: thin woods, little stone, and the crown wants tools</sub></td>
  </tr>
</table>

## Build the chains, watch them work

Lumberjacks fell trees and sawmills cut planks. Quarries and mines dig stone
and ore for the smithy's tools. Farms grow wheat for the mill and the
bakery, sheep give wool for the weaver, and fisheries feed the first
settlers. You never move a crate yourself: carriers push their carts along
the roads, each loaded with what it carries, and markets send walkers
through the streets with baskets of fish, bread, and cloth.

![A close look at a busy street: carts of planks and logs, a market walker, residents out walking, the town hall and the chapel](docs/screenshots/street.webp)

Settlers need food. Give them bread, cloth, and a chapel's faith, and their
cottages grow into two-story citizens' homes that hold and pay twice as
much. Then they come out in long coats and top hats, each household dressed
in the colour of its roof.

## A town that looks and works like a real one

Every street has a desirability. A smithy or a quarry drags it down for
several cells around; parks you lay out yourself (lawns, flower beds,
walks in from the street, lamps, a fountain, a statue), a chapel, and paved streets
lift it. Citizens will only live on a decent street, and the
finest streets, with every service calling, grow three-storey townhouses.
Settlers do the rough work and citizens the skilled, and nobody walks more
than fifteen road cells to a job, so the far-off mine needs its own
workers' cottages. Zone the town well and it sorts itself into a fine
centre, an industrial edge, and cottages by the mill.

Then keep it standing. A fire watch, a healer, and a watch house send
walkers to keep down the risk of fire, sickness, and theft; a sign goes up
over a home long before disaster, and a fire watch's firefighters race to
any blaze. Fish and bread rot unless a granary keeps them, tools wear out,
and a builder's yard has to mend what runs down. Each year's winter is
mild, normal, or hard, and the almanac tells you which a year ahead. Map
views show desirability, workers, fire, health, order, and condition across
the town.

## Govern under pressure

The bigger the town, the harder it pulls. Winters stop the fields and thin
the catch. Running the town costs more for every home. Traders pay less the
more you sell. The crown asks for goods on a deadline, and it remembers when
you don't deliver. Approval decides how many people each home holds.

You hold the levers: taxes for settlers and citizens, what to sell or buy and
how much to keep, which buildings to pause, and when to answer the crown.

<table>
  <tr>
    <td><img src="docs/screenshots/ui-town-panel.webp" alt="The town panel: goals, approval and what drives it, the treasury, and tax rates"></td>
    <td><img src="docs/screenshots/ui-build-menu.webp" alt="The build menu: each building pictured with its cost, workers, and upkeep"></td>
  </tr>
  <tr>
    <td align="center"><sub>the town panel: goals, approval, treasury, taxes, trade</sub></td>
    <td align="center"><sub>the build menu, unlocking as the town grows</sub></td>
  </tr>
</table>

![A mill selected: working, two workers, 261 batches of flour made](docs/screenshots/ui-building.webp)

## Every term ends

Hold every goal for two minutes (enough people and coins, three in ten of
them citizens, a town that approves of you) and the town is **complete**.
Retire, or keep governing to the end. Three minutes in debt, two minutes of
uproar, a town that empties out, or three of the crown's requests ignored,
and the term is **lost**. Otherwise time runs out and the town is judged:
flourishing, holding on, or declining.

The reckoning shows how it went: residents, coins, and approval across the
whole term, with the winters shaded, and the chronicle of everything that
happened.

<p align="center"><img src="docs/screenshots/reckoning.webp" width="640" alt="The reckoning of a complete town: 581 residents, 352 citizens, 9000 coins, a chart of the term, and its chronicle"></p>

## Drawn in ink

There are no sprites or image files: every picture in the game is drawn in
code with two weights of line on a pale ground. Each building wears the
colour of what it makes and keeps its work in its yard: a log pile, a silo,
a pen of sheep, a striped market stall. Trees, rocks, water, and roads are
different on every cell.

![Every building: town hall, warehouse, lumberjack, forester, quarry, mine, fishery, sawmill, smithy, farm, mill, bakery, sheep farm, weaver, market, chapel](docs/screenshots/sheet-buildings.webp)

![Carriers pushing handcarts and barrows, each loaded with its good: logs, planks, stone, ore, tools, fish, wheat, flour, bread, wool, cloth](docs/screenshots/sheet-walkers.webp)

![A market walker with a basket, a chapel walker with a bell, settlers, and citizens in top hats](docs/screenshots/sheet-people.webp)

![Homes for settlers and citizens](docs/screenshots/sheet-homes.webp)

![Trees, rocks and ore, and fields as they ripen](docs/screenshots/sheet-land.webp)

## Play

Inkline Town runs in the browser. Saves stay in your browser, and the town
autosaves every two minutes of play.

```sh
pnpm install
pnpm dev
```

Then open the address it prints. New to the game? [How to play](docs/how-to-play.md)
covers the controls, the rules of a term, and how the town works underneath.

## 部署到 Cloudflare Workers

可以直接在 Cloudflare 中授权 GitHub 仓库，自动构建并部署游戏：

1. 在 Cloudflare 的 **Workers & Pages** 中创建应用，选择导入 Git 仓库，授权并选择 `SuJiurong/inkline-town-zh-cn`（或你自己的 fork）。
2. 选择 **Workers**，生产分支设为 `main`，项目名称设为 `inkline-town-zh-cn`。仓库根目录使用默认值。
3. 确认以下构建设置，点击部署：

   | 设置 | 值 |
   | --- | --- |
   | 构建命令 | `pnpm build` |
   | 部署命令 | `pnpm exec wrangler deploy` |

Cloudflare 会安装依赖并提供部署授权，无需在 GitHub 中手动添加 API Token。
完成后打开 Cloudflare 提供的 `workers.dev` 地址即可游玩；以后推送到 `main` 会自动重新部署。
仓库已固定 Node.js 和 Wrangler 版本，游戏不需要数据库或运行时密钥。
存档仍保存在玩家浏览器中。

如果使用其他 Worker 名称，请同步修改 `wrangler.jsonc` 中的 `name`，保持它与 Cloudflare 项目名称一致。
自定义域名可以在部署完成后，从 Worker 的 **Settings → Domains & Routes** 中添加。
此方式使用仓库根目录的 Wrangler 配置；`deploy/` 是原有的 Alchemy 部署方式。

---

[How to play](docs/how-to-play.md) · [Developing](DEVELOPMENT.md) · [The design behind the term](docs/mayor-plan.md)
