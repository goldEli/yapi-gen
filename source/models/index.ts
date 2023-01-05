import { createModels } from '@jihe/use-model'
import demand from '@/models/project/demand'
import iterate from '@/models/project/iterate'
import project from '@/models/project/index'

const hooks = {
  demand,
  iterate,
  project,
}

export const { Provider, useModel } = createModels(hooks)
