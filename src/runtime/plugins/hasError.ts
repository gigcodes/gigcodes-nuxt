import { Ref, ref } from 'vue'

const errors: Ref = ref({})
const checkError = (field: string): string | boolean => {
  if (errors.value[field]) {
    return errors.value[field][0]
  } else {
    return false
  }
}

export default {
  errors,
  checkError
}
