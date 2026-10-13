/**
 * Where something happened, in words: a street named after the nearest
 * landmark ("Mill Lane", "Chapel Street"), so a fire or a theft can be told
 * as news. The same building always gives its streets the same name.
 */
import type { KindId } from "./content.ts"
import { ringOf } from "./appeal.ts"

const streetOf: Readonly<Record<KindId, string>> = {
  townhall: "市政厅", warehouse: "仓库", granary: "粮仓", lumberjack: "伐木", forester: "森林", quarry: "采石场",
  mine: "矿场", fishery: "渔人", smokehouse: "熏鱼坊", sawmill: "锯木厂", smithy: "铁匠铺", farm: "农场", mill: "磨坊",
  bakery: "面包", sheep: "牧羊", weaver: "纺织坊", market: "市场", chapel: "教堂", firewatch: "消防", healer: "医馆",
  hospital: "医院", watchhouse: "治安", builder: "维修"
}
const suffixes = ["巷", "街", "坊", "路", "里", "步道"] as const

export interface Landmark {
  readonly kind: KindId
  readonly x: number
  readonly y: number
  readonly size: number
}

/** The street a cell is on: named after the nearest landmark within eight cells, or the edge of town. */
export const placeName = (landmarks: ReadonlyArray<Landmark>, cell: { readonly x: number; readonly y: number }): string => {
  let best: Landmark | null = null
  let distance = 9
  for (const l of landmarks) {
    const d = ringOf(l, cell.x, cell.y)
    if (d < distance) {
      best = l
      distance = d
    }
  }
  if (!best) return "城镇边缘"
  const suffix = suffixes[(Math.imul(best.x * 73 + best.y * 31 + 7, 2654435761) >>> 0) % suffixes.length]!
  return `${streetOf[best.kind]}${best.kind === "townhall" ? "广场" : suffix}`
}

/** Counts in news use Chinese measure words, without English plural suffixes. */
export const counted = (n: number, one: string, _many = one) => `${n} ${one}`
