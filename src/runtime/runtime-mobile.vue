<template>
  <rok-form-item ref="formItemRef" :control="instance" :name="name">
    <div
      v-if="
        instance.pageStatus === 2 && instance.props.defaultState !== 'readonly'
      "
    >
      <van-field
        v-model="groupPerson"
        class="rok-department-content"
        @click="onOpenSearch"
        .disabled="instance.props.defaultState === 'readonly'"
        :rules="[{ required: true, message: '请选择部门' }]"
      >
        <template #input>
          <div
            class="input-box"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            "
          >
            <div>
              <ul
                v-if="selectedList.length"
                style="
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  margin-bottom: -6px;
                  margin-right: -6px;
                "
              >
                <li
                  class="display-value-warp department-item"
                  style="
                    padding-right: 0;
                    font-size: 14px;
                    line-height: 20px;
                    color: #646a73;
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    background: #f2f4f7;
                    border-radius: 31px;
                    margin-bottom: 6px;
                    margin-right: 6px;
                    line-height: 1;
                  "
                  :class="{ editable: editable }"
                  v-for="departmentInfo of selectedList"
                  :key="departmentInfo.employee_id"
                  @click="handleTagClick"
                >
                  <span class="display-value">
                    {{ departmentInfo.display_value }}
                  </span>
                  <i
                    @click.stop="
                      (e) => {
                        handleDeleteItem(e, departmentInfo.department_id)
                      }
                    "
                    class="dept-close-icon pro-app-page page-closed"
                    style="font-size: 12px; margin-left: 6px"
                  ></i>
                </li>
              </ul>
              <span v-else class="placeholder"> 请输入单位名称 </span>
            </div>
            <van-icon name="arrow" class="icont-arrow van-cell__right-icon" />
          </div>
        </template>
      </van-field>
      <van-popup
        v-model:show="showPersonSearch"
        position="right"
        teleport="body"
        :style="{ height: '100vh', width: '100vw' }"
        :lock-scroll="false"
        closeable
      >
        <mok-department
          .multiple="Dx==='1'"
          .display-level="displayLevel"
          .is-show-tree="true"
          .selected="selectedList"
          @close="onCloseSearch"
          @update="handleUpdate"
          .remoteMethod="remoteMethod"
          .get-sub-dept="getSubDept"
          .get-root-dept="getRootDept"
          .main-org-id="mainOrgId"
          .department-type="INTERNAL"
        />
      </van-popup>
    </div>
    <div v-else>
      <div style="margin: 8px 16px">
        <ul
          v-if="bmList.length"
          class="selected-department-list"
          style="
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: -6px;
            margin-right: -6px;
          "
        >
          <li
            class="display-value-warp department-item"
            :class="{ editable: editable }"
            style="
              padding-right: 0;
              font-size: 14px;
              line-height: 20px;
              color: #646a73;
              display: flex;
              align-items: center;
              padding: 8px 12px;
              background: #f2f4f7;
              border-radius: 31px;
              margin-bottom: 6px;
              margin-right: 6px;
              line-height: 1;
            "
            v-for="departmentInfo of bmList"
            :key="departmentInfo.employee_id"
            @click="handleTagClick"
          >
            <span class="display-value">
              {{ departmentInfo.display_value }}
            </span>
          </li>
        </ul>
        <span v-else class="placeholder"> -- </span>
      </div>
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
const { updateValue } = useBaseForm(
  props.instance,
  props.rowIndex,
  computed(() => props.value)
)

//是否明细子表
let isSubTable = computed(() => {
  const rowIndex: any = props.rowIndex
  return rowIndex !== undefined
})

let bmList: any = ref([])
let corpId = ref('')
let corpName = ref('')
let selectedList = ref([])
let isdisabled = ref(false)
let showPersonSearch = ref(false)
const orgDeptInstance = computed(() => props.instance.props.cs)

const mr = computed(() => props.instance.props.mr)
const Dx = computed(() => props.instance.props.dx)
const defaultValue = computed(() => props.instance.props.dv) //默认值，'1'当前用户机构，'2'，没有默认值
let groupPerson: any = ref('')
const context = inject<Ref<any>>('context')
const utils = unref(context)?.getAction().actionUtils
const ctx = unref(context)
const http = unref(context)?.getAction().actionUtils.getHttp('/')
const userInfo = utils.getUserInfo()

let isSchool = false
let schoolResList:any = []

onMounted(async () => {
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
      .post(location.origin + '/caih-edu/api/v1/public/user/getUserInfo', params)
    if (res.data?.corpid) {
      if (res.data.corpid.toString() === userInfo.tenant_id) {
        res.data.corpid = '1'
      }
      let deptinfo = await getDeptList([res.data.corpid])
      // console.log(deptinfo)
      updateValue([deptinfo[0].department_id])
    }
  } else {
    updateValue([])
  }
})

watch(
  () => props.value,
  async (newVal) => {
    console.log(newVal, '1111111111')
    if (!corpId.value) {
      getRootDept()
    }
    getDeptList(newVal).then((res) => {
      bmList.value = res
      props.instance.props.valDetails = res
      selectedList.value = res
    })
    updateValue(newVal)
  },
  {
    immediate: true,
  }
)

const getType = async (corpid:any) => {
  let orgParams = {
    corp_id: corpid,
    tenant_id: userInfo.tenant_id,
    user_id: userInfo.external_user ? '' : userInfo.employee_id,
  }
  const res = await utils
    .getHttp()
    .post(
      location.origin + '/caih-edu/api/v1/public/corp/org/orgInfo',
      orgParams
    )
  if (res?.data?.type === 'SCHOOL') {
    isSchool = true
  }else{
    isSchool = false
  }
}

const onOpenSearch = () => {
  showPersonSearch.value = true
}

const onCloseSearch = () => {
  showPersonSearch.value = false
}

const handleUpdate = ({ detail }: any) => {
  const [list] = detail
  const infoMap: any = {}
  // 收集信息
  list.forEach((v: any) => {
    // debugger
    infoMap[v.department_id] = v
  })
  // 更新显示
  const ids = list.map((v: any) => v.department_id).filter((v: any) => v)
  updateValue(ids) //用于更新数据
  selectedList.value = ids.map((v: any) => infoMap[v]).filter((v: any) => v)
  //更新绑定
  groupPerson.value = ids
    .map((v: any) => infoMap[v])
    .filter((v: any) => v)
    .map((v: any) => v.id)
    .join(',')
}

const handleDeleteItem = (e: any, id: any) => {
  selectedList.value = selectedList.value.filter(
    (v: any) => v && v.department_id !== id
  )
  let ids = selectedList.value.map((v: any) => v.id)
  updateValue(ids) //用于更新数据
}

const getRootDept = async () => {
  let deptinfo: any = []

  //获取机构id
  let params = {
      dept_id: userInfo.department_id,
      tenant_id: userInfo.tenant_id,
      user_id: userInfo.external_user ? '' : userInfo.employee_id,
    }
    const res = await utils
      .getHttp()
      .post(location.origin + '/caih-edu/api/v1/public/user/getUserInfo', params)
  //
  if (mr.value === '0') {
    if (orgDeptInstance.value) {
      deptinfo = await utils.getDisplay(
        ctx?.getInstance(orgDeptInstance.value),
        ctx?.getState(orgDeptInstance.value)
      )
      await getType(res.data?.corpid.toString())
    } else {
      utils.toast('请选择顶级机构。')
      return new Promise((resolve, reject) => {
        resolve({ data: [], code: '000000' })
      })
    }
  }

  if (mr.value === '1') {
    if (res.data?.corpid) {
      await getType(res.data?.corpid.toString())
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

  if(isSchool){
    schoolResList = deptinfo
  }

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
  console.log(isSchool,'是否是学校')

  return new Promise(async (resolve, reject) => {
    if(isSchool){
      return resolve({ data: schoolResList , code: '000000' })
    }
    parent_dept_id =
      parent_dept_id === '1' || parent_dept_id === '广西壮族自治区教育厅'
        ? corpId.value === '1'
          ? userInfo.tenant_id
          : corpId.value
        : parent_dept_id
    var subDeptIdList: any = []
    // 获取下级机构
    subDeptIdList = await getCorpSubsidiaryList(parent_dept_id)
    console.log(subDeptIdList, 'subDeptIdList')
    if (subDeptIdList.length === 0) {
      resolve({ data: [], code: '000000' })
    } else {
      let subDept: any = []
      console.log(orgDeptInstance.value, '111111111111111')
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
  console.log(userInfo.external_user, '---------------------')
  // 检查缓存中是否已有该部门的结果
  if (cache.hasOwnProperty(corpId)) {
    return cache[corpId]
  }
  const params = {
    tenant_id: userInfo.tenant_id,
    user_id: userInfo.external_user ? '' : userInfo.employee_id,
    corp_id: corpId==='1'?userInfo.tenant_id:corpId,
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
  console.log(userInfo, '1111111111111111111111')
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

