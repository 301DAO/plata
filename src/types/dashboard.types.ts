export type Performer = { name: string; change: number }
export interface NetworthCardProps {
  title: string
  balance: number | string
  url: string
  monthlyChange: number
  topPerformer?: Performer
  worstPerformer?: Performer
}
