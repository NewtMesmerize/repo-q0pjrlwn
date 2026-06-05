<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="计划名称" prop="planName">
        <el-input v-model="queryParams.planName" placeholder="请输入计划名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="发布类型" prop="planType">
        <el-select v-model="queryParams.planType" placeholder="请选择" clearable>
          <el-option label="个人开放" value="0" />
          <el-option label="校园普查" value="1" />
          <el-option label="定向测评" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option label="草稿" value="0" />
          <el-option label="已发布" value="1" />
          <el-option label="已结束" value="2" />
          <el-option label="已归档" value="3" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['assessment:plan:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['assessment:plan:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划ID" align="center" prop="planId" width="80" />
      <el-table-column label="计划名称" align="center" prop="planName" :show-overflow-tooltip="true" />
      <el-table-column label="关联量表" align="center" prop="scaleName" :show-overflow-tooltip="true" />
      <el-table-column label="发布类型" align="center" prop="planType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.planType === '0'">个人开放</el-tag>
          <el-tag v-else-if="scope.row.planType === '1'" type="success">校园普查</el-tag>
          <el-tag v-else-if="scope.row.planType === '2'" type="warning">定向测评</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="160" />
      <el-table-column label="结束时间" align="center" prop="endTime" width="160" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="success">已发布</el-tag>
          <el-tag v-else-if="scope.row.status === '2'" type="warning">已结束</el-tag>
          <el-tag v-else-if="scope.row.status === '3'" type="danger">已归档</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="260">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['assessment:plan:edit']">修改</el-button>
          <el-button link type="primary" icon="Position" @click="handlePublish(scope.row)" v-if="scope.row.status === '0'" v-hasPermi="['assessment:plan:edit']">发布</el-button>
          <el-button link type="primary" icon="CircleClose" @click="handleFinish(scope.row)" v-if="scope.row.status === '1'" v-hasPermi="['assessment:plan:edit']">结束</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['assessment:plan:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/修改对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划名称" prop="planName">
              <el-input v-model="form.planName" placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联量表" prop="scaleId">
              <el-input-number v-model="form.scaleId" :min="1" placeholder="量表ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布类型" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择">
                <el-option label="个人开放" value="0" />
                <el-option label="校园普查" value="1" />
                <el-option label="定向测评" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告模板" prop="reportTemplate">
              <el-select v-model="form.reportTemplate" placeholder="请选择">
                <el-option label="标准" value="0" />
                <el-option label="简版" value="1" />
                <el-option label="专业版" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最大作答次数" prop="maxAttempts">
              <el-input-number v-model="form.maxAttempts" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小年龄" prop="ageMin">
              <el-input-number v-model="form.ageMin" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大年龄" prop="ageMax">
              <el-input-number v-model="form.ageMax" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="参与范围" prop="targetScope">
          <el-input v-model="form.targetScope" placeholder="请输入参与范围描述" />
        </el-form-item>
        <el-form-item label="知情同意书" prop="consentText">
          <el-input v-model="form.consentText" type="textarea" :rows="3" placeholder="请输入知情同意书内容" />
        </el-form-item>
        <el-form-item label="隐私承诺" prop="privacyText">
          <el-input v-model="form.privacyText" type="textarea" :rows="2" placeholder="请输入隐私保密承诺" />
        </el-form-item>
        <el-form-item label="测评须知" prop="instructions">
          <el-input v-model="form.instructions" type="textarea" :rows="2" placeholder="请输入测评须知" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Plan">
import { ref, reactive, onMounted } from 'vue';
import { listPlan, getPlan, addPlan, updatePlan, delPlan, publishPlan, finishPlan } from '@/api/assessment/plan';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const showSearch = ref(true);
const planList = ref([]);
const open = ref(false);
const title = ref('');
const total = ref(0);
const multiple = ref(true);
const ids = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  planName: undefined,
  planType: undefined,
  status: undefined
});

const form = ref({});
const rules = {
  planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
  scaleId: [{ required: true, message: '关联量表不能为空', trigger: 'change' }]
};

function getList() {
  loading.value = true;
  listPlan(queryParams).then(response => {
    planList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.planName = undefined;
  queryParams.planType = undefined;
  queryParams.status = undefined;
  handleQuery();
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.planId);
  multiple.value = !selection.length;
}

function handleAdd() {
  reset();
  open.value = true;
  title.value = '新增测评计划';
}

function handleUpdate(row) {
  reset();
  const planId = row.planId || ids.value[0];
  getPlan(planId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = '修改测评计划';
  });
}

function submitForm() {
  if (form.value.planId != null) {
    updatePlan(form.value).then(() => {
      ElMessage.success('修改成功');
      open.value = false;
      getList();
    });
  } else {
    addPlan(form.value).then(() => {
      ElMessage.success('新增成功');
      open.value = false;
      getList();
    });
  }
}

function handleDelete(row) {
  const planIds = row.planId || ids.value;
  ElMessageBox.confirm('是否确认删除选中的测评计划?', '系统提示', { type: 'warning' }).then(() => {
    return delPlan(planIds);
  }).then(() => {
    getList();
    ElMessage.success('删除成功');
  });
}

function handlePublish(row) {
  ElMessageBox.confirm(`是否确认发布计划 "${row.planName}"?`, '系统提示', { type: 'warning' }).then(() => {
    return publishPlan(row.planId);
  }).then(() => {
    getList();
    ElMessage.success('发布成功');
  });
}

function handleFinish(row) {
  ElMessageBox.confirm(`是否确认结束计划 "${row.planName}"?`, '系统提示', { type: 'warning' }).then(() => {
    return finishPlan(row.planId);
  }).then(() => {
    getList();
    ElMessage.success('操作成功');
  });
}

function reset() {
  form.value = {
    planId: undefined,
    planName: undefined,
    scaleId: undefined,
    planType: '0',
    startTime: undefined,
    endTime: undefined,
    maxAttempts: 1,
    ageMin: undefined,
    ageMax: undefined,
    targetScope: undefined,
    consentText: undefined,
    privacyText: undefined,
    instructions: undefined,
    reportTemplate: '0',
    remark: undefined
  };
}

function cancel() {
  open.value = false;
  reset();
}

onMounted(() => {
  getList();
});
</script>
