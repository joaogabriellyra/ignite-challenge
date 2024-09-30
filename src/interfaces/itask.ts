export default interface ITask {
  id: string
  title: string
  description: string
  completed_at?: string
  created_at?: string
  updated_at?: string
}

export interface ITaskCSV {
  title: string
  description: string
}
