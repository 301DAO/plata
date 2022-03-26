export type Datum = { date: string; close: number }

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export type Margin = {
  top: number
  right: number
  bottom: number
  left: number
}

export type Performer = { name: string; change: number | string }

export interface NetworthCardProps {
  title: string
  balance: number | string
  url: string
  monthlyChange: number | string
  topPerformer?: Performer
  worstPerformer?: Performer
}
