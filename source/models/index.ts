import { createModels } from '@jihe/use-model'
import user from '@/models/user'

const hooks = { user }

export const { Provider, useModel } = createModels(hooks)
