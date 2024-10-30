import {
  defineInstance,
  createFormBaseFields,
} from '@byteluck-fe/custom-control-sdk/main'

export default defineInstance({
  // 定义组件的属性
  fields: [
    ...createFormBaseFields({
      placeholder: '请选择',
    }),
    // {
    //   key: 'maxLength',
    //   type: 'number',
    //   component: 'input-number',
    //   defaultValue: 200,
    //   props: {
    //     min: 0,
    //   },
    //   effect: {
    //     dataBind(driven: any, payload: any) {
    //       if (payload.fieldItem) {
    //         return {
    //           max: payload.fieldItem.length,
    //         }
    //       }
    //       return {
    //         max: 200,
    //       }
    //     },
    //     minLength(driven: any, payload: any) {
    //       return {
    //         min: payload.control.props.minLength,
    //       }
    //     },
    //   },
    // },
    // {
    //   key: 'minLength',
    //   type: 'number',
    //   component: 'input-number',
    //   defaultValue: 0,
    //   props: {
    //     min: 0,
    //   },
    //   effect: {
    //     maxLength(driven: any, payload: any) {
    //       return {
    //         max: payload.control.props.maxLength,
    //       }
    //     },
    //   },
    // },
    {
      key: 'dv',
      type: 'string',
      component: 'Dv',
      defaultValue: '2',
      // validator(props: any, value: string) {
      //   if (props.minLength <= value.length && value.length <= props.maxLength) {
      //     return true
      //   }
      //   return '默认值必须在限制范围内'
      // },
    },
    {
      key: 'customCaption',
      component: 'CustomContent',
    },
    {
      key: 'cs',
      type: 'string',
      defaultValue: '',
      // component: 'Cs',
    },
    {
      key: 'mr',
      type: 'string',
      defaultValue: '1',
      component: 'Mr',
    },
    {
      key: 'dx',
      type: 'string',
      defaultValue: '1',
      component: 'Dx',
    },
    {
      key: 'valDetails',
      type: 'array',
      defaultValue: [],
      // component: 'Dx',
    },
  ],
  groups: [
    {
      title: '绑定数据项名称',
      required: true,
      items: ['dataBind'],
    },
    {
      title: '标题',
      required: true,
      // 使用内置的caption设置
      // items: ['caption', 'isHideCaption'],
      // 使用自定义的caption设置
      items: ['customCaption', 'isHideCaption'],
    },
    {
      title: '是否多选',
      // required: true,
      items: ['dx'],
    },
    {
      title: '顶级机构',
      // required: true,
      items: ['mr'],
    },
    {
      title: '默认值',
      // required: true,
      items: ['dv'],
    },
    {
      title: '默认',
      required: true,
      items: ['defaultValue'],
    },
    {
      title: '标题布局',
      items: ['labelPosition'],
    },
    {
      title: '默认状态',
      items: ['defaultState'],
    },
    {
      title: '设置',
      items: ['required', 'isHide'],
    },
    {
      title: '高级设置',
      items: ['superSetting'],
    },
  ],
  runtimeValidator(props: any, value: unknown, i18n: string) {
    const i18nObj = {
      'zh-CN': '必填',
      'en-US': 'required',
      'ja-JP': '必須',
    }
    if (props.required && !value) {
      return i18nObj[i18n as keyof typeof i18nObj] ?? i18nObj['zh-CN']
    }
  },
  events: ['change'],
  customEvents: [],
  // slots: ['default'],
})
