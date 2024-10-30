<template>
  <dok-form-item :control="control">
    <a-input
    @change="onChange"
    placeholder="机构选择组件"
  ></a-input>
  </dok-form-item>
</template>

<script setup lang="ts">
import Property from '../property'

const props = defineProps<{
  control: typeof Property.Designer
}>()
</script>
