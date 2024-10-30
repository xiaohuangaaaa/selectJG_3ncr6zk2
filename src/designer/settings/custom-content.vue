<template>
  <a-input
    v-model:value="control.props.caption"
    @change="onChange"
    placeholder="请输入控件标题"
  ></a-input>
</template>

<script setup lang="ts">
import { Ref, inject, unref } from 'vue'

const props = defineProps<{
  control: any
}>()
const driven = inject<Ref<any>>('driven')

const onChange = (event: InputEvent) => {
  unref(driven)?.setInstance(
    props.control,
    'caption',
    (event.target as HTMLInputElement).value
  )
}
</script>
<style scoped></style>
