import { createModels } from '@jihe/use-model'
import user from '@/models/user'
import setting from '@/models/setting'

const hooks = { user, setting }

export const { Provider, useModel } = createModels(hooks)
