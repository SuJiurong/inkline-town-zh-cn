import type { Category, Crew } from "./content.ts"
import type { Status as StatusValue } from "./schema.ts"

// Display names only: simulation IDs and saved component keys remain unchanged.
export const categoryTitles: Readonly<Record<Category, string>> = {
  storage: "储存", gathering: "采集", crafts: "制造", food: "食品", services: "服务"
}
export const crewTitles: Readonly<Record<Crew, string>> = { settlers: "移民", citizens: "市民" }
export const statusTitles: Readonly<Record<StatusValue, string>> = {
  building: "施工中", idle: "空闲", working: "工作中", unconnected: "未连接道路", unstaffed: "缺少工人",
  blocked: "库存已满", paused: "已暂停", starved: "缺少原料"
}
export const ruinTitles = { burnt: "烧毁", collapsed: "倒塌", derelict: "废弃" } as const
export const riskTitles = { fire: "火灾", health: "疾病", order: "治安" } as const
