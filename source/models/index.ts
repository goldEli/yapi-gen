import { createModels } from '@jihe/use-model'
import demand from '@/models/project/demand'
import iterate from '@/models/project/iterate'
import project from '@/models/project/index'
import mine from '@/models/mine'

const hooks = {
  demand,
  iterate,
  project,
  mine,
}

export const { Provider, useModel } = createModels(hooks)
