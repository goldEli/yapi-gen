import { createModels } from '@jihe/use-model'
import user from '@/models/user'
import staff from '@/models/staff'

const hooks = { user, staff }

export const { Provider, useModel } = createModels(hooks)
