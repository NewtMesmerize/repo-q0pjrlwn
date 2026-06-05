<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="受测者ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入受测者ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option label="进行中" value="0" />
          <el-option label="已完成" value="1" />
          <el-option label="已暂停" value="2" />
          <el-option label="已超时" value="3" />
          <el-option label="异常" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常标记" prop="abnormalFlag">
        <el-select v-model="queryParams.abnormalFlag" placeholder="请选择" clearable>
          <el-option label="正常" value="0" />
          <el-option label="乱答" value="1" />
          <el-option label="白卷" value="2" />
          <el-option label="速答" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['assessment:record:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录ID" align="center" prop="recordId" width="80" />
      <el-table-column label="量表名称" align="center" prop="scaleName" :show-overflow-tooltip="true" />
      <el-table-column label="计划名称" align="center" prop="planName" :show-overflow-tooltip="true" />
      <el-table-column label="受测者" align="center" prop="userName" width="100" />
      <el-table-column label="作答次数" align="center" prop="attemptNo" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="primary">进行中</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="success">已完成</el-tag>
          <el-tag v-else-if="scope.row.status === '2'" type="warning">已暂停</el-tag>
          <el-tag v-else-if="scope.row.status === '3'" type="info">已超时</el-tag>
          <el-tag v-else-if="scope.row.status === '4'" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center" width="100">
        <template #default="scope">
          {{ scope.row.progress }}/{{ scope.row.totalQuestions }}
        </template>
      </el-table-column>
      <el-table-column label="用时(秒)" align="center" prop="durationSeconds" width="80" />
      <el-table-column label="异常标记" align="center" prop="abnormalFlag" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.abnormalFlag === '0'" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.abnormalFlag === '1'" type="danger">乱答</el-tag>
          <el-tag v-else-if="scope.row.abnormalFlag === '2'" type="danger">白卷</el-tag>
          <el-tag v-else-if="scope.row.abnormalFlag === '3'" type="warning">速答</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="160" />
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['assessment:record:query']">详情</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['assessment:record:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script setup name="Record">
import { ref, reactive, onMounted } from 'vue';
import { listRecord, getRecord, delRecord } from '@/api/assessment/record';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const showSearch = ref(true);
const recordList = ref([]);
const total = ref(0);
const multiple = ref(true);
const ids = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userId: undefined,
  status: undefined,
  abnormalFlag: undefined
});

function getList() {
  loading.value = true;
  listRecord(queryParams).then(response => {
    recordList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.userId = undefined;
  queryParams.status = undefined;
  queryParams.abnormalFlag = undefined;
  handleQuery();
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId);
  multiple.value = !selection.length;
}

function handleView(row) {
  // 跳转详情页或打开弹窗
}

function handleDelete(row) {
  const recordIds = row.recordId || ids.value;
  ElMessageBox.confirm('是否确认删除选中的测评记录?', '系统提示', { type: 'warning' }).then(() => {
    return delRecord(recordIds);
  }).then(() => {
    getList();
    ElMessage.success('删除成功');
  });
}

onMounted(() => {
  getList();
});
</script>
