<template>
  <van-button class="mobile-button" :disabled="control.props.defaultState === 'readonly'">{{ control.props.content }}</van-button>
</template>

<script setup lang="ts">
import Property from '../property'

const props = defineProps<{
  control: typeof Property.Designer
}>()
</script>
