export default interface ITask {
  id: string
  title: string
  description: string
  completed_at?: Date
  created_at?: Date
  updated_at?: Date
}
