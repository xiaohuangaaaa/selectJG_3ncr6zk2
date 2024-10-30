<template>
  <a-radio-group v-model:value="control.props.dv" @change="onChange">
    <a-radio :style="radioStyle" value="2">不需要默认值</a-radio>
    <a-radio :style="radioStyle" value="1">当前用户所在机构</a-radio>
  </a-radio-group>
</template>

<script setup lang="ts">
import { Ref, inject, unref, reactive } from 'vue'

const props = defineProps<{
  control: any
}>()
const driven = inject<Ref<any>>('driven')
let userInfo: any = JSON.parse(localStorage.tenantDetail).data
const context = inject<Ref<any>>('context')
const utils = unref(context)?.getAction().actionUtils
const onChange = async (event: InputEvent) => {
  console.log(userInfo,'12121')

  unref(driven)?.setInstance(
    props.control,
    'dv',
    (event.target as HTMLInputElement).value
  )

  // if ((event.target as HTMLInputElement).value === '1') {
  //   let params = {
  //     dept_id: userInfo.department_id,
  //     tenant_id: userInfo.tenant_id,
  //     user_id: userInfo.external_user ? '' : userInfo.employee_id,
  //   }
  //   const res = await utils
  //     .getHttp()
  //     .post(
  //       location.origin + '/caih-edu/api/v1/public/user/getUserInfo',
  //       params
  //     )
  //   if (res.data?.corpid) {
  //     if (res.data.corpid.toString() === userInfo.tenant_id) {
  //       res.data.corpid = '1'
  //     }
  //     let deptinfo = await getDeptList([res.data.corpid])
  //     // console.log(deptinfo)
  //     // updateValue([deptinfo[0].department_id])
  //     unref(driven)?.setInstance(props.control, 'defaultValue', [deptinfo[0].department_id])
  //   }
    
  // }
}
// const getDeptList = async (corpids: any) => {
//   if (corpids.length === 0) {
//     return []
//   }
//   let jgparms = {
//     dept_ids: corpids,
//     display_level: 1,
//     org_type: 'INTERNAL',
//   }
//   const jgres = await utils
//     .getHttp()
//     .post(location.origin + '/apps/api/v1/private/dept/selectDeptList', jgparms)
//   return jgres.data
// }
const radioStyle = reactive({
  display: 'block',
  height: '30px',
  lineHeight: '30px',
})
</script>
<style scoped></style>
