import { createModels } from '@jihe/use-model'
import user from '@/models/user'
import demand from '@/models/project/demand'
import iterate from '@/models/project/iterate'
import project from '@/models/project/index'
import mine from '@/models/mine'

const hooks = {
  user,
  demand,
  iterate,
  project,
  mine,
}

export const { Provider, useModel } = createModels(hooks)
