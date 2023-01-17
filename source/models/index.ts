import { createModels } from '@jihe/use-model'
import iterate from '@/models/project/iterate'

const hooks = {
  iterate,
}

export const { Provider, useModel } = createModels(hooks)
