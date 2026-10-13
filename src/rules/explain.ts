/**
 * Why a home is short of something, in a line that names the cause and
 * what to do about it. The panel reads these out, and the legibility test
 * checks that the usual dead ends (cloth withheld from a poor street, no
 * market in reach, nothing in store) are each told plainly. Plain
 * functions over plain facts: nothing here knows the ECS.
 */
import type { Need, Tier } from "../content.ts"
import { shippedRules, type Rules } from "./config.ts"
import { riskTitles } from "../labels.ts"
import { kept as keptBy, met, wantsCitizenGoods, type Needs } from "./households.ts"

export interface Part {
  readonly label: string
  readonly value: number
}
/** A street as a home sees it: its desirability, and what makes it (strongest first). */
export interface Street {
  readonly desirability: number
  readonly parts: ReadonlyArray<Part>
}
/** What the town has of each provision: in storage and on market shelves together. */
export interface InTown {
  readonly fish: number
  readonly smoked: number
  readonly bread: number
  readonly cloth: number
}
/** Whether a walker of each kind can reach the home at all: a market's (or the town hall's) with provisions, and a chapel's. */
export interface Served {
  readonly goods: boolean
  readonly faith: boolean
}

export const signed = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}`

/** What counts most against a street, for a cause in a line: "quarry −6, warehouse −2". */
export const against = (parts: ReadonlyArray<Part>, most = 2): string =>
  parts.filter((p) => p.value < 0).slice(0, most).map((p) => `${p.label} ${signed(p.value)}`).join(", ")

/** A street against what the next tier needs: "−4 here, 5 needed: quarry −6". */
export const streetShort = (street: Street, needed: number): string => {
  const why = against(street.parts)
  return `当前 ${signed(street.desirability)}，需要 ${needed}${why ? `：${why}` : ""}`
}

/** What would lift a street: the things a mayor can do. */
export const streetAdvice = (street: Street): string =>
  street.parts.some((p) => p.value < 0)
    ? "迁走工业建筑，或增设公园、教堂与铺石道路"
    : "在附近建设公园、教堂或铺石道路"

const noWalker = (what: "market" | "chapel", rules: Rules) =>
  what === "market"
    ? `市场配送员无法到达这条街道：市场配送范围为 ${rules.kinds.market.service!.range} 格道路，市政厅为 ${rules.kinds.townhall.service!.range}`
    : `传教士无法到达这条街道：教堂服务范围为 ${rules.kinds.chapel.service!.range} 格道路`

/**
 * Why a need is unmet, as a cause and a cure, or `null` when it is met.
 * Cloth is the one a town is most often puzzled by: it is only brought to
 * a street fit for citizens, however much is in store.
 */
export const whyUnmet = (need: Need, h: Needs, street: Street, inTown: InTown, served: Served, rules: Rules = shippedRules): string | null => {
  if (met(h, need)) return null
  const needed = rules.home.tiers[2].appeal
  switch (need) {
    case "cloth": {
      if (!wantsCitizenGoods(h, street.desirability, rules))
        return `此处不供应布料：街道宜居度为 ${signed(street.desirability)}，需要达到 ${needed}${against(street.parts) ? ` (${against(street.parts)})` : ""}`
      if (!served.goods) return noWalker("market", rules)
      if (inTown.cloth === 0) return "城镇没有布料：纺织坊使用牧羊场的羊毛生产布料"
      return "市场配送员近期未携带布料经过此处"
    }
    case "bread": {
      if (!served.goods) return noWalker("market", rules)
      if (inTown.bread === 0) return "城镇没有面包：农场小麦送至磨坊，再将面粉送至面包坊"
      return "市场配送员近期未携带面包经过此处"
    }
    case "food": {
      if (!served.goods) return noWalker("market", rules)
      if (inTown.fish + inTown.smoked + inTown.bread === 0) return "城镇食物库存为空：在水边建立渔场是最快的补给方式"
      return "市场配送员近期未经过此处"
    }
    case "faith": {
      if (!served.faith) return noWalker("chapel", rules)
      return "传教士近期未经过此处"
    }
  }
}

export interface Blocker {
  readonly what: Need | "street" | "services"
  readonly text: string
}

/**
 * Everything keeping a home from the next tier, a line each: unmet needs
 * with their causes, a street too poor, and (for a townhouse) services not
 * all calling. Empty when nothing stands in the way.
 */
export const blockers = (
  h: Needs,
  street: Street,
  inTown: InTown,
  served: Served,
  risk: { readonly fire: number; readonly health: number; readonly order: number } | undefined,
  rules: Rules = shippedRules
): ReadonlyArray<Blocker> => {
  if (h.tier >= 3) return []
  const next = (h.tier + 1) as Tier
  const out: Array<Blocker> = []
  for (const need of rules.home.tiers[next].needs) {
    const why = whyUnmet(need, h, street, inTown, served, rules)
    if (why) out.push({ what: need, text: why })
  }
  if (street.desirability < rules.home.tiers[next].appeal) out.push({ what: "street", text: `街道宜居度为 ${streetShort(street, rules.home.tiers[next].appeal)} · ${streetAdvice(street)}` })
  if (next === 3 && (!risk || !keptBy(risk, rules))) {
    const high = risk ? (["fire", "health", "order"] as const).filter((r) => risk[r] >= rules.risk.kept) : ["fire", "health", "order"]
    out.push({ what: "services", text: `${high.map((r) => riskTitles[r as keyof typeof riskTitles]).join("、")}风险未受控制：消防站、医馆和治安所都必须为此处提供服务` })
  }
  return out
}
