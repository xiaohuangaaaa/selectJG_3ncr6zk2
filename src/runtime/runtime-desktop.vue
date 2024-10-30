<template>
  <rok-form-item ref="formItemRef" :control="instance" :name="name">
    <!-- asdadasdadas -->
    <div v-if="instance.pageStatus === 2">
      <div :style="isSubTable ? { 'margin-top': '3px', padding: '0 4px' } : ''">
        <!--  -->
        <ok-department-select
          .value="value"
          .update="isUpdateValue"
          .disabled="instance.props.defaultState === 'readonly'"
          .multiple="Dx==='1'"
          .getRootDept="getRootDept"
          .remoteMethod="remoteMethod"
          .getSubDept="getSubDept"
          placeholder="请输入单位名称"
          mode="tree"
        ></ok-department-select>
      </div>
    </div>
    <div v-else class="pchx" style="display: flex; align-items: center">
      <!-- aaaaaa -->
      <template v-if="!isSubTable">
        <div
          class="pchx-item"
          style="
            padding: 6px 16px;
            background: #f0f4ff;
            margin-right: 10px;
            border-radius: 4px;
            margin-bottom: 6px;
            display: inline-block;
            line-height: 20px;
          "
          v-for="(item, index) in bmList"
          :key="index"
        >
          {{ item.department_name }}
        </div>
      </template>
      <div v-else id="tag-more-popover">
        <div
          style="
            padding: 3px;
            background: rgb(239, 240, 241);
            margin-right: 10px;
            border-radius: 4px;
            display: inline-block;
            line-height: 20px;
            max-width: 100px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-top: 6px;
          "
        >
          <a-tooltip :title="bmList[0] && bmList[0]?.department_name">
            <span class="item-name">{{
              bmList[0] && bmList[0]?.department_name
            }}</span>
          </a-tooltip>
        </div>

        <a-popover overlay-class-name="tag-more-popover">
          <template #content>
            <ul class="popover-tag-content">
              <li
                v-for="(item, index) in bmList.slice(1)"
                :key="index"
                class="popover-tag-item"
              >
                <a-tooltip :title="item?.department_name">
                  <span class="popover-tag-name">{{
                    item?.department_name
                  }}</span>
                </a-tooltip>
              </li>
            </ul>
          </template>
          <div
            v-if="bmList.length > 1"
            style="
              padding: 3px;
              background: rgb(239, 240, 241);
              margin-right: 10px;
              border-radius: 4px;
              display: inline-block;
              line-height: 20px;
              max-width: 100px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-top: 6px;
            "
          >
            {{ `+${bmList.length - 1}` }}
          </div>
        </a-popover>
      </div>
      <!-- <div v-if="bmList.length===0" style="font-weight: bold;">--</div> -->
    </div>
  </rok-form-item>
</template>

<script setup lang="ts">
import { computed, ref, inject, Ref, unref, watch, onMounted } from 'vue'
import Property from '../property'
import {
  useBaseForm,
  useFormEvents,
} from '@byteluck-fe/custom-control-sdk/runtime'

const props = defineProps<{
  instance: typeof Property.Runtime
  rowIndex?: number
  name: string | string[]
  value: string[]
}>()

const {
  props: instanceProps,
  isDisabled,
  placeholder,
  isEditable,
  formItemRef,
  updateValue,
} = useBaseForm(
  props.instance,
  props.rowIndex,
  computed(() => props.value)
)

const { onFocus, onBlur, onInput } = useFormEvents(props)

//是否明细子表
let isSubTable = computed(() => {
  const rowIndex: any = props.rowIndex
  return rowIndex !== undefined
})

let bmList: any = ref([])
let corpId = ref('')
let corpName = ref('')
let isdisabled = ref(false) //
const orgDeptInstance = computed(() => props.instance.props.cs)
const mr = computed(() => props.instance.props.mr) //默认选择树的顶级机构，'1','2','3'
const Dx = computed(() => props.instance.props.dx) //树，是否多选
const defaultValue = computed(() => props.instance.props.dv) //默认值，'1'当前用户机构，'2'，没有默认值
console.log(defaultValue.value, '+++')
const context = inject<Ref<any>>('context')
const utils = unref(context)?.getAction().actionUtils
const ctx = unref(context)
const http = unref(context)?.getAction().actionUtils.getHttp('/')
const userInfo = utils.getUserInfo() //当前租户信息

onMounted(async () => {
  // console.log(props.value)
  console.log(isSubTable.value,'1111111')
  if (isSubTable.value) {
    const list = await getDeptList(props.value)
    bmList.value = list
    props.instance.props.valDetails = list
    return
  }
  if (defaultValue.value === '1') {
    let params = {
      dept_id: userInfo.department_id,
      tenant_id: userInfo.tenant_id,
      user_id: userInfo.external_user ? '' : userInfo.employee_id,
    }
    const res = await utils
      .getHttp()
      .post(
        location.origin + '/caih-edu/api/v1/public/user/getUserInfo',
        params
      )
    if (res.data?.corpid) {
      if (res.data.corpid.toString() === userInfo.tenant_id) {
        res.data.corpid = '1'
      }
      let deptinfo = await getDeptList([res.data.corpid])
      // console.log(deptinfo)
      updateValue([deptinfo[0].department_id])
    }
  } else {
    console.log('默认值', defaultValue.value)
    updateValue([])
  }
})

watch(
  () => props.value,
  async (newVal) => {
    if (!corpId.value) {
      getRootDept()
    }

    const list = await getDeptList(newVal)
    bmList.value = list
    props.instance.props.valDetails = list
    console.log(newVal, 'qwqwqwqwqwqwqw')
    updateValue(newVal)
    console.log(bmList.value, '=====')
  }
)

const getRootDept = async () => {
  let deptinfo: any = []
  if (mr.value === '0') {
    if (orgDeptInstance.value) {
      deptinfo = await utils.getDisplay(
        ctx?.getInstance(orgDeptInstance.value),
        ctx?.getState(orgDeptInstance.value)
      )
    } else {
      utils.toast('请选择顶级机构。')
      return new Promise((resolve, reject) => {
        resolve({ data: deptinfo, code: '000000' })
      })
    }
  }

  if (mr.value === '1') {
    let params = {
      dept_id: userInfo.department_id,
      tenant_id: userInfo.tenant_id,
      user_id: userInfo.external_user ? '' : userInfo.employee_id,
    }
    const res = await utils
      .getHttp()
      .post(
        location.origin + '/caih-edu/api/v1/public/user/getUserInfo',
        params
      )
    if (res.data?.corpid) {
      if (res.data.corpid.toString() === userInfo.tenant_id) {
        res.data.corpid = '1'
      }
      deptinfo = await getDeptList([res.data.corpid])
    }
  }

  if (mr.value === '2') {
    let corpid = '1'
    deptinfo = await getDeptList([corpid])
  }

  corpId.value = deptinfo[0].department_id
  corpName.value = deptinfo[0].department_name
  deptinfo[0].has_child = false

  deptinfo[0].org_id = deptinfo[0].department_id
  deptinfo[0].org_name = deptinfo[0].department_name

  return new Promise((resolve, reject) => {
    resolve({ data: deptinfo, code: '000000' })
  })
}

const remoteMethod = async (deptName: any) => {
  console.log('查询部门名称=', deptName)
  return new Promise(async (resolve) => {
    const corpArr = await getOfficeByPage(corpId.value, deptName)
    let subDept: any = []
    if (corpArr.length === 0) {
      return resolve({ data: [], code: '000000' })
    }
    if (orgDeptInstance.value) {
      subDept = await utils.getDisplay(
        ctx.getInstance(orgDeptInstance.value),
        corpArr
      )
    } else {
      subDept = await getDeptList(corpArr)
    }
    console.log('sub_dept:', subDept)
    resolve({ data: subDept, code: '000000' })
  })
}

const getSubDept = async (parent_dept_id: any) => {
  console.log(parent_dept_id, 'parent_dept_id')
  return new Promise(async (resolve, reject) => {
    parent_dept_id =
      parent_dept_id === '1' || parent_dept_id === '广西壮族自治区教育厅'
        ? corpId.value === '1'
          ? userInfo.tenant_id
          : corpId.value
        : parent_dept_id
    var subDeptIdList: any = []
    console.log(parent_dept_id, 'parent_dept_id')
    // 获取下级机构
    subDeptIdList = await getCorpSubsidiaryList(parent_dept_id)
    if (subDeptIdList.length === 0) {
      resolve({ data: [], code: '000000' })
    } else {
      let subDept: any = []
      if (orgDeptInstance.value) {
        subDept = await utils.getDisplay(
          ctx.getInstance(orgDeptInstance.value),
          subDeptIdList.map((item: any) => item.dept)
        )
      } else {
        subDept = await getDeptList(subDeptIdList.map((item: any) => item.dept))
      }
      subDept.forEach((item: any) => {
        const matchingSubDept = subDeptIdList.find(
          (subDeptItem: any) => subDeptItem.dept === item.department_id
        )
        if (matchingSubDept && matchingSubDept.type === 4) {
          item.has_child = false
        }
      })
      resolve({ data: subDept, code: '000000' })
    }
  })
}

const isUpdateValue = (ids: any) => {
  // if(ids.length===1 && ids[0]===''){
  console.log(ids, '我爱的会断送的话11111')
  //     return
  //   }
  let arr = ids.filter((v: any) => v)
  updateValue(arr)
}

const getDeptList = async (corpids: any) => {
  if (corpids.length === 0) {
    return []
  }
  let jgparms = {
    dept_ids: corpids,
    display_level: 1,
    org_type: 'INTERNAL',
  }
  const jgres = await utils
    .getHttp()
    .post(location.origin + '/apps/api/v1/private/dept/selectDeptList', jgparms)
  return jgres.data
}
// 获取下级机构
// 缓存对象，用于存储已获取的部门下级机构列表
const cache: any = {}
async function getCorpSubsidiaryList(corpId: any) {
  // 检查缓存中是否已有该部门的结果
  if (cache.hasOwnProperty(corpId)) {
    return cache[corpId]
  }
  const params = {
    tenant_id: userInfo.tenant_id,
    user_id: userInfo.external_user ? '' : userInfo.employee_id,
    corp_id: corpId,
  }
  const res = await http.post(
    location.origin + '/caih-edu/api/v1/public/corp/corpSubsidiaryList',
    params
  )
  if (res.code === '000000') {
    const corpArr = res.data
      .filter((item: any) => item.parentCorpid === corpId) // 过滤出满足条件的对象
      .map((item: any) => ({ dept: item.corpid, type: item.type })) // 返回包含 corpid 和 type 的对象
    // 将结果存入缓存
    cache[corpId] = corpArr
    return corpArr
  } else {
    utils.toast('系统错误，请联系管理员处理。')
    return []
  }
}

const getOfficeByPage = async (corpId: any, corpName: any) => {
  const params = {
    tenant_id: userInfo.tenant_id,
    user_id: userInfo.external_user ? '' : userInfo.employee_id,
    corp_id: corpId === '1' ? userInfo.tenant_id : corpId,
    name: corpName,
    is_name_fuzzy: true,
  }
  const officeRes = await http.post(
    location.origin + '/caih-edu/api/v1/public/corp/org/getOfficeByPage',
    params
  )
  const schoolRes = await http.post(
    location.origin + '/caih-edu/api/v1/public/corp/org/getSchoolByPage',
    params
  )
  // 提取corpId并合并到一个数组中
  const corpIds = [...extractCorpIds(officeRes), ...extractCorpIds(schoolRes)]
  return corpIds
}

const extractCorpIds = (response: any) => {
  // 确保response对象存在且包含.data和.dataList属性
  if (response && response.data && response.data.dataList) {
    return response.data.dataList.map((item: any) => item.corpid)
  }
  return []
}
</script>
