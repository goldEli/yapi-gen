import { createModels } from '@jihe/use-model'
import user from '@/models/user'
import setting from '@/models/setting'
import staff from '@/models/staff'
import demand from '@/models/project/demand'
import iterate from '@/models/project/iterate'
import project from '@/models/project/index'
import cos from '@/models/cos'
import mine from '@/models/mine'
import member from '@/models/member'

const hooks = {
  user,
  setting,
  staff,
  demand,
  iterate,
  project,
  cos,
  mine,
  member,
}

export const { Provider, useModel } = createModels(hooks)
