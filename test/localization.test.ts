import assert from "node:assert/strict"
import { test } from "node:test"
import { goods, goodIds, kinds, kindIds, grounds, props, home, tierHome, needTitle, sizes, lands, winters, costText } from "../src/content.ts"
import { categoryTitles, crewTitles, riskTitles, statusTitles, ruinTitles } from "../src/labels.ts"
import { blockers, whyUnmet } from "../src/rules/explain.ts"
import { counted, placeName } from "../src/places.ts"

const chinese = (s: string) => {
  assert.match(s, /[\u3400-\u9fff]/)
  assert.doesNotMatch(s, /[A-Za-z]/)
}

test("player-facing content uses Chinese while resource and building IDs stay stable", () => {
  assert.deepEqual(goodIds, ["wood", "planks", "stone", "ore", "tools", "fish", "smoked", "wheat", "flour", "bread", "wool", "cloth"])
  for (const id of kindIds) assert.equal(kinds[id].id, id)
  for (const collection of [goods, kinds, grounds, props, home.tiers, sizes, lands, winters]) {
    for (const item of Object.values(collection)) {
      chinese(item.title)
      if ("blurb" in item) chinese(item.blurb)
    }
  }
  for (const collection of [tierHome, needTitle, categoryTitles, crewTitles, riskTitles, statusTitles, ruinTitles]) {
    for (const title of Object.values(collection)) chinese(title)
  }
  assert.equal(costText({ coins: 10, materials: { planks: 2, tools: 1 } }), "10 金币 · 2 木板 · 1 工具")
})

test("upgrade explanations name missing services and provisions in Chinese", () => {
  const h = { tier: 2 as const, residents: 8, food: 1, bread: 1, cloth: 1, faith: 1, clock: 0 }
  const street = { desirability: 15, parts: [] }
  const stock = { fish: 1, smoked: 0, bread: 1, cloth: 1 }
  const served = { goods: true, faith: true }
  const result = blockers(h, street, stock, served, { fire: 6000, health: 6000, order: 6000 })
  assert.equal(result.length, 1)
  assert.equal(result[0]!.what, "services")
  assert.match(result[0]!.text, /火灾、疾病、治安/)
  chinese(result[0]!.text)
  for (const need of ["food", "bread", "cloth", "faith"] as const) {
    chinese(whyUnmet(need, { ...h, [need]: 0 }, street, { fish: 0, smoked: 0, bread: 0, cloth: 0 }, { goods: false, faith: false })!)
  }
})

test("news uses Chinese place names and counts without English plural suffixes", () => {
  assert.equal(placeName([], { x: 0, y: 0 }), "城镇边缘")
  assert.equal(placeName([{ kind: "townhall", x: 0, y: 0, size: 3 }], { x: 1, y: 1 }), "市政厅广场")
  for (const kind of kindIds) chinese(placeName([{ kind, x: 0, y: 0, size: 2 }], { x: 1, y: 1 }))
  assert.equal(counted(1, "栋住宅"), "1 栋住宅")
  assert.equal(counted(8, "栋住宅"), "8 栋住宅")
})
