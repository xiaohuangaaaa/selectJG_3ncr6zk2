<template>
  <a-radio-group v-model:value="control.props.mr" @change="onChange">
    <a-radio :style="radioStyle" value="1">当前用户所在机构</a-radio>
    <a-radio :style="radioStyle" value="2">当前租户</a-radio>
    <a-radio :style="radioStyle" value="0">自定义机构 </a-radio>
  </a-radio-group>
  <div v-if="control.props.mr === '0'">
    <div style="font-weight: bold;margin-top:10px">机构唯一标识符</div>
    <a-input
      style="margin-top:5px"
      v-model:value="control.props.cs"
      @change="onChange2"
      placeholder="请输入机构唯一标识"
    ></a-input>
  </div>
</template>

<script setup lang="ts">
import { Ref, inject, unref, onMounted, reactive } from 'vue'

const props = defineProps<{
  control: any
}>()
const driven = inject<Ref<any>>('driven')

const onChange = (event: any) => {
  console.log((event.target as HTMLInputElement).value)
  unref(driven)?.setInstance(
    props.control,
    'mr',
    (event.target as HTMLInputElement).value
  )
}

const onChange2 = (event: any) => {
  console.log((event.target as HTMLInputElement).value)
  unref(driven)?.setInstance(
    props.control,
    'cs',
    (event.target as HTMLInputElement).value
  )
}

const radioStyle = reactive({
  display: 'block',
  height: '30px',
  lineHeight: '30px',
})

onMounted(() => {
  console.log(props.control)
})
</script>
<style scoped></style>
