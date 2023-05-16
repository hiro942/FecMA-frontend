export const ipv6TaskFilter = (tasks: FLearningModels.Task[]): FLearningModels.Task[] => {
  tasks = tasks.filter((task) => task.taskName.includes('$ipv6$'))
  tasks.map((task) => (task.taskName = task.taskName.replace('$ipv6$', '')))
  return tasks
}

export const normalTaskFilter = (tasks: FLearningModels.Task[]): FLearningModels.Task[] => {
  tasks = tasks.filter((task) => !task.taskName.includes('$ipv6$'))
  tasks.map((task) => (task.taskName = task.taskName.replace('$ipv6$', '')))
  return tasks
}
