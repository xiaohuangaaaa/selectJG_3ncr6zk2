# 百特搭自定义控件

## Start
```bash
npm run dev
# or
yarn dev
```
## Build
```bash
npm run build
# or
yarn build
```

## 开发需知
1. `component.json`定义了控件的id，name，type等，**id和name必须与自定义控件管控台一致**;
2. `src/property.ts`定义了控件的基本属性;
3. `src/runtime`是运行态的组件开发
4. `src/designer`是设计态的组件开发
5. `src/runtime/index.ts`and`src/designer/index.ts`不允许进行改动
