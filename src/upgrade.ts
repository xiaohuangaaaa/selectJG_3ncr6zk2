import { compare } from 'compare-versions'
/**
 * 控件配置升级函数
 * @param schema 页面中的schema
 * @param newVersion 插件中心读取的控件最新版本号
 * @param oldVersion 页面中读取的控件的版本号，数字。如：0.1.3、1.0.4
 * @param payload displayBoList?: any[]; dataCode?: string; behaviors?: any[]; control_events?: Record<string, any>; events?: Record<'did_mount' | 'will_submit' | 'did_submit',Array<Record<string, any>>>
 * @returns schemaJSON
 */
export function upgrade(schema: any, newVersion: string, oldVersion: string, payload?: any) {
  let newSchema = schema
//   if (compare(newVersion, '1.5.0', '<=') && compare(oldVersion, '1.0.0', '>=')) {
//     newSchema = schema
//   }

//   if (compare(oldVersion, '1.0.0', '<')) {
//     newSchema = schema
//   }
  return newSchema
}
