/** Chinese UI smoke checks. Start the dev server before running this script. */
import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import { chromium } from "playwright"

const output = "output/inkline-3d/zh-check"
await mkdir(output, { recursive: true })
const executablePath = process.env.BROWSER_EXECUTABLE_PATH
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
const facts: Array<Record<string, unknown>> = []
try {
  // Run one viewport at a time, including a narrow 320px phone.
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 844 }, locale: "zh-CN" })
    page.setDefaultTimeout(60_000)
    const errors: Array<string> = []
    page.on("pageerror", (e) => errors.push(e.message))
    await page.goto(process.env.GAME_BASE_URL ?? "http://127.0.0.1:5232")
    await page.waitForFunction(() => window.town)
    assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN")
    await page.screenshot({ path: `${output}/charter-${width}.png` })
    await page.getByRole("button", { name: "小型", exact: true }).click()
    await page.getByRole("button", { name: "建立城镇", exact: true }).click()
    await page.waitForFunction(() => !window.town.ui.founding)
    await page.locator(".toolbar .pause").click()
    let tooltipCount = 0
    for (const panel of ["建造", "城镇"]) {
      await page.locator(".toolbar button").filter({ hasText: new RegExp("^" + panel) }).click()
      await page.locator(".panel.open").waitFor()
      const text = await page.locator(".panel").innerText()
      assert.match(text, /[\u3400-\u9fff]/)
      assert.doesNotMatch(text.replace(/Esc/g, ""), /[a-z]{3,}/i)
      const tips = await page.locator("[title]").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("title") ?? ""))
      for (const tip of tips) assert.doesNotMatch(tip.replace(/Esc|Home|[A-Z]/g, ""), /[a-z]{3,}/)
      tooltipCount += tips.length
      await page.screenshot({ path: `${output}/${panel === "建造" ? "build" : "town"}-${width}.png` })
      const overflow = await page.locator(".panel").evaluate((el) => ({ scroll: el.scrollWidth, width: el.clientWidth }))
      assert.ok(overflow.scroll <= overflow.width + 1, JSON.stringify({ width, panel, overflow }))
      await page.locator(".panel .close").click()
    }
    // Load a legacy-format save fixture through the real UI to cover labels that menus miss.
    if (width === 1440) {
      const fixture = await page.evaluate(() => {
        const world = window.town.runtime.snapshot()
        const trees = world.entities.filter(e => e.components["Town/Tree"]).slice(0, 2)
        if (trees.length !== 2) throw new Error("Fixture needs two trees")
        const [park, ruin] = trees
        park!.components = { "Town/Tile": park!.components["Town/Tile"], "Town/Park": { ground: "lawn", prop: "none" } }
        ruin!.components = { "Town/Tile": ruin!.components["Town/Tile"], "Town/Ruin": { cause: "burnt" } }
        localStorage.removeItem("inkline-town/save/auto")
        localStorage.setItem("inkline-town/save/manual", JSON.stringify(world))
        const hall = world.entities.find(e => e.components["Town/TownHall"])!
        return [
          { id: hall.id, tile: hall.components["Town/Tile"], title: "市政厅", tip: "市政厅", height: 48 },
          { id: park!.id, tile: park!.components["Town/Tile"], title: "公园", tip: "公园", height: 0 },
          { id: ruin!.id, tile: ruin!.components["Town/Tile"], title: "废墟", tip: "烧毁", height: 8 }
        ]
      })
      await page.getByRole("button", { name: "读取", exact: true }).click()
      await page.getByRole("button", { name: "读取（不保存）", exact: true }).click()
      await page.waitForFunction(() => window.town.runtime.snapshot().entities.some(e => e.components["Town/Park"]))
      for (const item of fixture) {
        const frame = await page.evaluate(({ tile }) => {
          window.town.view.focus(tile.x + tile.size / 2, tile.y + tile.size / 2)
          return window.town.view.stats().frames
        }, item)
        await page.waitForFunction(f => window.town.view.stats().frames > f + 3, frame)
        const point = await page.evaluate(({ tile, height }) => window.town.view.project(tile.x + tile.size / 2, tile.y + tile.size / 2, height), item)
        await page.mouse.move(point.x, point.y)
        await page.waitForFunction(tip => window.town.ui.preview.tooltip?.includes(tip), item.tip)
        assert.doesNotMatch(await page.evaluate(() => window.town.ui.preview.tooltip!), /[a-z]{3,}/i)
        await page.mouse.click(point.x, point.y)
        await page.waitForFunction(title => document.querySelector(".panel h2")?.textContent === title, item.title)
        assert.doesNotMatch(await page.locator(".panel").innerText(), /[a-z]{3,}/i)
        await page.locator(".panel .close").click()
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    const labels = await page.locator("[aria-label]").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label") ?? ""))
    for (const label of labels) assert.doesNotMatch(label, /[A-Za-z]{3,}/)
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily)
    assert.match(font, /PingFang SC|Microsoft YaHei|Noto Sans CJK SC/)
    assert.deepEqual(errors, [])
    facts.push({ width, panels: true, tooltipCount, noPageOverflow: true, font, errors })
    await writeFile(`${output}/results.json`, JSON.stringify(facts, null, 2))
    console.log(`Passed Chinese UI at ${width}px`)
    await page.close()
  }
  await writeFile(`${output}/results.json`, JSON.stringify(facts, null, 2))
  console.log(JSON.stringify(facts, null, 2))
} finally {
  await browser.close()
}
