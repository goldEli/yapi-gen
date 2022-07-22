import { createModels } from '@jihe/use-model'
import user from '@/models/user'
import setting from '@/models/setting'
import staff from '@/models/staff'

const hooks = { user, setting, staff }

export const { Provider, useModel } = createModels(hooks)
