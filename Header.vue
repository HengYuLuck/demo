<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { getNumTime } from '../../../composables/useFormatDate'
import type { TreeData, formDataOptionsFormat } from '@/types'
import { globalOrgCode, hasManualChangeTier } from '@/composables/useTierDataItems'
import { querySafetyDaysInfo } from '@/api/groupStatistics'
import { queryOrgList } from '@/api/organizationManage'
import { findTreeNode, getParentNode } from '@/utils/findTreeNode'
import { currentModelId } from '@/composables/useBaseSharedValue'

const props = defineProps({
  customUwbCode: {
    type: String,
    default: '',
  },
})
const { toggle } = useFullscreen()

const pageTitle = computed(() => {
  // 唐山数据看板，展示数据看板标题
  if (window?.g?.companyName === 'tangshan' && currentPageComp.value === 1)
    return window.g.dataDashboardTitle
  else
    return window.g.companyGlobalTitle
})

// 安全生产天数
const safeProductDays = ref<number>(0)
const getCardListDataFuntion = async () => {
  const res = await querySafetyDaysInfo({ code: globalOrgCode.value })
  if (res?.data?.code === 200) {
    const resData = res.data.data
    safeProductDays.value = resData.safeProductionDay ?? 0
  }
}

// 组织树
const showTree = ref(false)
const selectedTreeValue = ref(globalOrgCode.value || '')
const treeData = ref<TreeData[]>([])
const dataFormat = ref<formDataOptionsFormat>(
  { label: 'name', value: 'code' },
)

function getCurrOrgName() {
  const currentNode = findTreeNode(treeData.value[0], 'code', globalOrgCode.value)
  if (currentNode) {
    currentOrgName.value = currentNode.name
    // 设置当前所选组织在组织结构中所处的层级
    globalTierVal.value = currentNode.form
  }
}

// 设置3D地图的 modelId
function getCurrModelId() {
  const currentNode = findTreeNode(treeData.value[0], 'code', selectedTreeValue.value)
  if (currentNode) {
    currentModelId.value = currentNode.model_id
    currentModelId.value && sessionStorage.setItem('currGlobalModelId', currentModelId.value)
  }
}

// 全量组织树
async function getOrgTree() {
  const res = await queryOrgList({ type: 'bigScreen' })
  if (res?.data?.code === 200) {
    treeData.value = res.data.data
    globalTreeData.value = treeData.value.slice()
    // 若session中存了currGlobalOrgCode, 刷新页面后直接赋值, 否则取接口数据第一个
    if (sessionStorage.getItem('currGlobalOrgCode'))
      globalOrgCode.value = sessionStorage.getItem('currGlobalOrgCode')!

    else
      globalOrgCode.value = globalOrgCode.value || res.data.data[0].code

    getCurrOrgName()
    getCardListDataFuntion()
    selectedTreeValue.value = globalOrgCode.value
  }
}

function confirm() {
  globalOrgCode.value = selectedTreeValue.value
  showTree.value = false
  hasManualChangeTier.value = false // 2D驾驶舱，从左上角组织树触发下钻
  sessionStorage.setItem('currGlobalOrgCode', globalOrgCode.value) // 把globalOrgCode存到session里
  getCurrOrgName()
  getCardListDataFuntion()
  getCurrModelId()
}

// 点击返回上一层组织
function backPrevOrg() {
  const prevTable = getParentNode(treeData.value, globalOrgCode.value)
  if (prevTable === null)
    return

  // const prevOrgCode = sessionStorage.getItem('prevOrgCode')
  if (prevTable.code) {
    globalOrgCode.value = prevTable.code
    selectedTreeValue.value = globalOrgCode.value
    showTree.value = false
    hasManualChangeTier.value = false // 2D驾驶舱，从左上角组织树触发下钻
    sessionStorage.setItem('currGlobalOrgCode', globalOrgCode.value) // 把globalOrgCode存到session里
    getCurrOrgName()
    getCardListDataFuntion()
    getCurrModelId()
  }
}

// changke -> 有四色图的场景ID
const hasFourColorMapOrg = ref(['003', '004', '005', '006', '007', '008'])
// 是否禁用确认按钮
const disableBtn = ref(false)
// 监听从3D地图 htconfig.js 传来的orgcode
window.addEventListener('message', async (e) => {
  // if (e?.data?.originPoint && e?.data?.targetPoint && e?.data?.originPoint?.modelId !== 'scene002') {
  if (e?.data?.originPoint && e?.data?.targetPoint) {
    globalOrgCode.value = e.data.targetPoint.orgId || ''
    selectedTreeValue.value = globalOrgCode.value
    sessionStorage.setItem('currGlobalOrgCode', globalOrgCode.value) // 把globalOrgCode存到session里
    e?.data?.targetPoint?.modelId && sessionStorage.setItem('currGlobalModelId', e?.data?.targetPoint?.modelId)
    getCurrOrgName()
    getCardListDataFuntion()
  }

  // 查询选中的组织是否有绑定model_id或视角信息
  if (e?.data?.modelInfo !== undefined && currentCompanyName.value === 'changke') {
    const currModelInfo = await e.data.modelInfo
    if (currModelInfo)
      hasFourColorMap.value = hasFourColorMapOrg.value.includes(currModelInfo.split('_')[1])
    else
      hasFourColorMap.value = false

    disableBtn.value = currModelInfo === null
    sessionStorage.setItem('hasFourColorMap', String(hasFourColorMap.value))
  }
})

onMounted(async () => {
  await getOrgTree()
})

watch(() => selectedTreeValue.value, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal && currentCompanyName.value === 'changke') {
    // @ts-expect-error required
    const iframeWindow = await document.getElementById('3DIframe')?.contentWindow
    iframeWindow && iframeWindow.htconfig.Project.isFindMatchModelId(newVal)
  }
})

watch(() => props.customUwbCode, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    selectedTreeValue.value = newVal
    confirm()
  }
}, { immediate: true })

// 若从2D驾驶舱，点击前往下钻时触发
watch(() => hasManualChangeTier.value, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    selectedTreeValue.value = globalOrgCode.value
    sessionStorage.setItem('currGlobalOrgCode', globalOrgCode.value) // 把globalOrgCode存到session里
    getCurrOrgName()
    getCardListDataFuntion()
    hasManualChangeTier.value = false
  }
}, { immediate: true })
</script>

<template>
  <div class="pt-2 ml-2 d-flex bg-header">
    <p v-if="currentCompanyName === 'jituan'" class="tw-text-base tw-pt-4 tw-ml-6 tw-p-2 tw-pl-[52px]  tw-w-[564px] tw-text-[#32DCFB] jituan-title">
      {{ currentOrgName }}
    </p>
    <div v-else class="tw-pl-3 tw-w-[564px]">
      <div class="tw-flex">
        <v-btn
          variant="outlined" color="#18A0DB" class="tw-min-w-32 tw-mt-2"
          append-icon="mdi-chevron-down" @click="showTree = !showTree"
        >
          <span class="tw-text-gray-200 tw-text-xl">
            {{ currentOrgName }}
          </span>
        </v-btn>
        <img
          v-tooltip="'返回上级目录'"
          aria-describedby="prevIcon"
          src="/imgs/realtimeMonitor/prev_org.png"
          class="tw-w-12 tw-scale-50 hover:tw-cursor-pointer"
          alt=""
          @click="backPrevOrg"
        >
      </div>
      <div v-if="showTree" class="bg-video tw-z-10 tw-absolute tw-px-2 tw-py-4 tw-mt-4 tw-backdrop-blur">
        <div class="tw-w-72 tw-h-96 tw-overflow-auto chart-container">
          <div
            v-if="!treeData.length"
            class="tw-absolute tw-left-[50%] tw-top-[50%] tw-translate-x-[-50%] tw-translate-y-[-50%] tw-text-gray-200"
          >
            暂无数据
          </div>
          <ui-tree
            v-else v-model="selectedTreeValue" :data="treeData" :data-format="dataFormat" :max-level="10"
            auto-expand-selected class="treeItem tw-text-gray-200 tw-text-xl"
          />
        </div>
        <div v-if="!disableBtn">
          <v-divider class="my-3" />
          <div class="text-center">
            <v-btn color="#18A0DB" class="tw-bg-[#18A0DB]/50 bg-play tw-transition" @click.prevent="confirm">
              <span :class="disableBtn ? 'tw-text-gray-400' : ''" class="tw-text-gray-100 hover:tw-scale-110">确认</span>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-w-[800px] text-center">
      <span class="mr-2 font-weight-bold tw-text-3xl text-header">{{ pageTitle }}</span>
    </div>
    <div style="width: 564px" class="pr-4 mt-4 text-right font-weight-bold">
      <span class="tw-text-[#E4F0FF] tw-pr-14">
        {{ getNumTime(0, 'hour', true) }}
      </span>
      <span class="pl-3 py-2 mr-2 tw-rounded tw-border-2 tw-border-[#8ABEE2] tw-bg-[#0E3866] position-relative">
        <div class="tw-w-1/4 position-absolute -tw-left-8 -tw-top-1">
          <v-img class="tw-scale-[120%]" src="/imgs/realtimeMonitor/icon_safe.png" />
        </div>
        <span class="px-3 tw-text-gray-100">安全生产天数</span>
        <span class="tw-text-[#F5DF00] px-3" style="border-left: 1px solid #fff">{{ safeProductDays }}</span>
      </span>
      <v-img
        class="tw-inline-block tw-w-5 tw-align-middle hover:tw-cursor-pointer"
        src="/imgs/realtimeMonitor/full-screen.png" @click="toggle"
      />
    </div>
  </div>
</template>

<style scoped>
:global(.base-color) {
  color: var(--border-color)
}

:global(.right-text) {
  color: #CDE7DE;
}

.bg-header {
  width: 100%;
  height: 5em;
  background: url('/imgs/realtimeMonitor/top.png') no-repeat;
  background-size: 100% 90%;
}

.text-header {
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to bottom,
      #EAF1F6,
      #E7F6FF,
      #C9E9FD,
      #9AD6FF,
      #9AD6FA,
      #9AD6DF,
      #33619A)
}
.jituan-title {
  background: url('/imgs/group_bigscreen/icon.png') no-repeat;
}
</style>
