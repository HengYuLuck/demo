<script setup lang="ts">
import { ref } from 'vue'
import DarkTable from './DarkTable.vue'
import { controlStatisticsTableData } from './constants'
import TrendChartCard from '@/components/TrendChartCard.vue'
import type { formDataOptionsFormat } from '@/types'
import { changeCurrentBtn } from '@/composables/useBaseSharedValue'

const searchOrgCode = ref('')
const selectedTreeValue = ref(searchOrgCode.value || '')
const treeData = ref<any[]>([])
const dataFormat = ref<formDataOptionsFormat>(
  { label: 'name', value: 'code' },
)

const sceneType = ref<number[]>([])
const sceneTypeItems = ref<Pick<formDataOptionsFormat, 'label' | 'value'>[]>([
  { label: '最近六个月', value: 1 },
  { label: '机器视觉', value: 2 },
  { label: '无', value: 3 },
])

const trendSeries = ref([])
const trendXAxis = ref([])
</script>

<template>
  <div>
    <div class="tw-main-heading tw-text-lg">
      智控场景统计
      <span class="hover:tw-cursor-pointer tw-pr-2" @click="changeCurrentBtn('5')">>></span>
    </div>
    <div class="tw-flex tw-py-4 tw-justify-center">
      <div class="tw-flex tw-mr-[30px]">
        <img src="" alt="" class="tw-h-[50px] tw-w-[50px] tw-bg-cyan-200">
        <div class="tw-flex tw-flex-col tw-ml-2">
          <span class="tw-text-[#32DCFB] tw-text-lg">222</span>
          <span class="tw-text-white tw-text-sm">已建场景数</span>
        </div>
      </div>
      <div class="tw-flex tw-mr-[30px]">
        <img src="" alt="" class="tw-h-[50px] tw-w-[50px] tw-bg-cyan-200">
        <div class="tw-flex tw-flex-col tw-ml-2">
          <span class="tw-text-[#01D3A9] tw-text-lg">333</span>
          <span class="tw-text-white tw-text-sm">场景复制总数</span>
        </div>
      </div>
    </div>
    <div class="tw-w-full second-level-title tw-text-white tw-text-sm tw-leading-[44px] tw-pl-7">
      <!-- tw-subheading -->
      <span class="gradient-text-blue">扩建场景top3</span>
    </div>
    <DarkTable
      :ui-table-data="controlStatisticsTableData"
      table-height="300"
      selected-key="serisNo"
      class="tw-mt-4"
      :show-pagenation="false"
    />
    <div class="tw-main-heading tw-text-lg">
      报警数量分析
      <!--      <div class="tw-w-[200px] tw-h-[18px] risk-level-select tw-mr-3 search-select"> -->
      <!--        <v-select -->
      <!--          v-model="sceneType" -->
      <!--          color="#ffffff" -->
      <!--          placeholder="请选择日期" -->
      <!--          variant="outlined" -->
      <!--          density="compact" -->
      <!--          hide-details -->
      <!--          :items="sceneTypeItems" -->
      <!--          item-title="label" -->
      <!--          item-value="value" -->
      <!--          theme="dark" -->
      <!--          multiple -->
      <!--          active -->
      <!--          clearable -->
      <!--        > -->
      <!--          <template #prepend-item> -->
      <!--            <v-card -->
      <!--              flat -->
      <!--              width="100%" -->
      <!--              :style="{ color: '#fff', backgroundColor: '#132458', position: 'absolute', top: '0px', bottom: '0px', display: 'inlineBlock' }" -->
      <!--            /> -->
      <!--          </template> -->
      <!--          <template #selection="{ item, index }"> -->
      <!--            <v-chip v-if="index < 1"> -->
      <!--              <span>{{ item.title }}</span> -->
      <!--            </v-chip> -->
      <!--            <span v-if="index === 1" class="text-grey text-caption align-self-center"> -->
      <!--              (+{{ index }}) -->
      <!--            </span> -->
      <!--          </template> -->
      <!--        </v-select> -->
      <!--      </div> -->
      <span class="hover:tw-cursor-pointer tw-pr-2" @click="changeCurrentBtn('2')">
        <!--        <ui-tree -->
        <!--          v-model="selectedTreeValue" :data="treeData" :data-format="dataFormat" :max-level="10" -->
        <!--          auto-expand-selected class="treeItem tw-text-gray-200 tw-text-xl" -->
        <!--        /> -->
        >></span>
    </div>
    <div class="tw-w-full tw-h-[280px]">
      <div v-if="trendSeries.length > 0">
        1212
        <TrendChartCard
          :series="trendSeries"
          :x-data="trendXAxis"
        />
      </div>
      <div v-else class="tw-block tw-h-full tw-w-full tw-p-4">
        <div class="tw-container tw-h-full">
          <div
            class="tw-h-full tw-rounded-lg  tw-flex tw-justify-center tw-items-center"
          >
            <h3
              class="tw-title-font tw-text-xl tw-font-base tw-text-white"
            >
              暂无数据
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-select :deep(.v-field__input){
  height: 10px;
}
</style>
