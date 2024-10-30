<template>
  <a-radio-group v-model:value="control.props.dx" @change="onChange">
    <a-radio :style="radioStyle" value="1">是</a-radio>
    <a-radio :style="radioStyle" value="2">否</a-radio>
  </a-radio-group>
</template>

<script setup lang="ts">
import { Ref, inject, unref,onMounted } from 'vue'

const props = defineProps<{
  control: any
}>()
const driven = inject<Ref<any>>('driven')

const onChange = (event: InputEvent) => {
  unref(driven)?.setInstance(
    props.control,
    'dx',
    (event.target as HTMLInputElement).value
  )
}
onMounted(()=>{
  console.log(props.control)
})
</script>
<style scoped></style>
