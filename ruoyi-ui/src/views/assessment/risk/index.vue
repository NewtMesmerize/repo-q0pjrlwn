<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="受测者ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入受测者ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select v-model="queryParams.riskLevel" placeholder="请选择" clearable>
          <el-option label="轻度" value="1" />
          <el-option label="中度" value="2" />
          <el-option label="重度" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="handleStatus">
        <el-select v-model="queryParams.handleStatus" placeholder="请选择" clearable>
          <el-option label="待处理" value="0" />
          <el-option label="已介入" value="1" />
          <el-option label="已关闭" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="alertList">
      <el-table-column label="预警ID" align="center" prop="alertId" width="80" />
      <el-table-column label="受测者" align="center" prop="userName" width="100" />
      <el-table-column label="风险等级" align="center" prop="riskLevel" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.riskLevel === '1'" type="warning">轻度</el-tag>
          <el-tag v-else-if="scope.row.riskLevel === '2'" type="danger">中度</el-tag>
          <el-tag v-else-if="scope.row.riskLevel === '3'" type="danger" effect="dark">重度</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="风险详情" align="center" prop="riskDetail" :show-overflow-tooltip="true" />
      <el-table-column label="处理状态" align="center" prop="handleStatus" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.handleStatus === '0'" type="danger">待处理</el-tag>
          <el-tag v-else-if="scope.row.handleStatus === '1'" type="warning">已介入</el-tag>
          <el-tag v-else-if="scope.row.handleStatus === '2'" type="success">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" prop="handlerName" width="100" />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="160" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['assessment:risk:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleProcess(scope.row)" v-if="scope.row.handleStatus === '0'" v-hasPermi="['assessment:risk:handle']">介入</el-button>
          <el-button link type="primary" icon="CircleClose" @click="handleClose(scope.row)" v-if="scope.row.handleStatus !== '2'" v-hasPermi="['assessment:risk:handle']">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 介入处理对话框 -->
    <el-dialog title="心理师介入处理" v-model="processOpen" width="500px" append-to-body>
      <el-form ref="processRef" :model="processForm" :rules="processRules" label-width="80px">
        <el-form-item label="处理人ID" prop="handlerId">
          <el-input-number v-model="processForm.handlerId" :min="1" placeholder="心理师ID" />
        </el-form-item>
        <el-form-item label="处理结果" prop="handleResult">
          <el-input v-model="processForm.handleResult" type="textarea" :rows="4" placeholder="请输入处理结果" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitProcess">确 定</el-button>
        <el-button @click="processOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="RiskAlert">
import { ref, reactive, onMounted } from 'vue';
import { listRiskAlert, getRiskAlert, handleRiskAlert, closeRiskAlert } from '@/api/assessment/risk';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const showSearch = ref(true);
const alertList = ref([]);
const total = ref(0);
const processOpen = ref(false);
const processForm = reactive({ alertId: undefined, handlerId: undefined, handleResult: '' });
const processRules = {
  handlerId: [{ required: true, message: '处理人不能为空', trigger: 'change' }],
  handleResult: [{ required: true, message: '处理结果不能为空', trigger: 'blur' }]
};

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userId: undefined,
  riskLevel: undefined,
  handleStatus: undefined
});

function getList() {
  loading.value = true;
  listRiskAlert(queryParams).then(response => {
    alertList.value = response.rows;
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
  queryParams.riskLevel = undefined;
  queryParams.handleStatus = undefined;
  handleQuery();
}

function handleView(row) {
  // 跳转详情页
}

function handleProcess(row) {
  processForm.alertId = row.alertId;
  processForm.handlerId = undefined;
  processForm.handleResult = '';
  processOpen.value = true;
}

function submitProcess() {
  handleRiskAlert(processForm.alertId, processForm.handlerId, processForm.handleResult).then(() => {
    ElMessage.success('处理成功');
    processOpen.value = false;
    getList();
  });
}

function handleClose(row) {
  ElMessageBox.confirm('是否确认关闭该预警?', '系统提示', { type: 'warning' }).then(() => {
    return closeRiskAlert(row.alertId);
  }).then(() => {
    getList();
    ElMessage.success('已关闭');
  });
}

onMounted(() => {
  getList();
});
</script>
