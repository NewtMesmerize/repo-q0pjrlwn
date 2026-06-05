<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="受测者ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入受测者ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select v-model="queryParams.riskLevel" placeholder="请选择" clearable>
          <el-option label="正常" value="0" />
          <el-option label="轻度" value="1" />
          <el-option label="中度" value="2" />
          <el-option label="重度" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="复核状态" prop="reviewStatus">
        <el-select v-model="queryParams.reviewStatus" placeholder="请选择" clearable>
          <el-option label="待复核" value="0" />
          <el-option label="已复核" value="1" />
          <el-option label="无需复核" value="2" />
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
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['assessment:report:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="报告ID" align="center" prop="reportId" width="80" />
      <el-table-column label="量表名称" align="center" prop="scaleName" :show-overflow-tooltip="true" />
      <el-table-column label="受测者" align="center" prop="userName" width="100" />
      <el-table-column label="原始总分" align="center" prop="totalRawScore" width="90" />
      <el-table-column label="标准总分" align="center" prop="totalStdScore" width="90" />
      <el-table-column label="风险等级" align="center" prop="riskLevel" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.riskLevel === '0'" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.riskLevel === '1'" type="warning">轻度</el-tag>
          <el-tag v-else-if="scope.row.riskLevel === '2'" type="danger">中度</el-tag>
          <el-tag v-else-if="scope.row.riskLevel === '3'" type="danger">重度</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" align="center" prop="reviewStatus" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.reviewStatus === '0'" type="info">待复核</el-tag>
          <el-tag v-else-if="scope.row.reviewStatus === '1'" type="success">已复核</el-tag>
          <el-tag v-else-if="scope.row.reviewStatus === '2'">无需复核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleView(scope.row)" v-hasPermi="['assessment:report:query']">详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleReview(scope.row)" v-if="scope.row.reviewStatus === '0'" v-hasPermi="['assessment:report:review']">复核</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['assessment:report:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 复核对话框 -->
    <el-dialog title="报告复核" v-model="reviewOpen" width="500px" append-to-body>
      <el-form ref="reviewRef" :model="reviewForm" :rules="reviewRules" label-width="80px">
        <el-form-item label="复核意见" prop="reviewComment">
          <el-input v-model="reviewForm.reviewComment" type="textarea" :rows="4" placeholder="请输入复核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitReview">确 定</el-button>
        <el-button @click="reviewOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Report">
import { ref, reactive, onMounted } from 'vue';
import { listReport, getReport, reviewReport, delReport } from '@/api/assessment/report';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const showSearch = ref(true);
const reportList = ref([]);
const total = ref(0);
const multiple = ref(true);
const ids = ref([]);
const reviewOpen = ref(false);
const reviewForm = reactive({ reportId: undefined, reviewComment: '' });
const reviewRules = {
  reviewComment: [{ required: true, message: '复核意见不能为空', trigger: 'blur' }]
};

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userId: undefined,
  riskLevel: undefined,
  reviewStatus: undefined
});

function getList() {
  loading.value = true;
  listReport(queryParams).then(response => {
    reportList.value = response.rows;
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
  queryParams.reviewStatus = undefined;
  handleQuery();
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.reportId);
  multiple.value = !selection.length;
}

function handleView(row) {
  // 跳转报告详情页
}

function handleReview(row) {
  reviewForm.reportId = row.reportId;
  reviewForm.reviewComment = '';
  reviewOpen.value = true;
}

function submitReview() {
  reviewReport(reviewForm.reportId, reviewForm.reviewComment).then(() => {
    ElMessage.success('复核成功');
    reviewOpen.value = false;
    getList();
  });
}

function handleDelete(row) {
  const reportIds = row.reportId || ids.value;
  ElMessageBox.confirm('是否确认删除选中的报告?', '系统提示', { type: 'warning' }).then(() => {
    return delReport(reportIds);
  }).then(() => {
    getList();
    ElMessage.success('删除成功');
  });
}

onMounted(() => {
  getList();
});
</script>
