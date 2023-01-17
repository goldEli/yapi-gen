import { createModels } from '@jihe/use-model'
import demand from '@/models/project/demand'
import iterate from '@/models/project/iterate'

const hooks = {
  demand,
  iterate,
}

export const { Provider, useModel } = createModels(hooks)
