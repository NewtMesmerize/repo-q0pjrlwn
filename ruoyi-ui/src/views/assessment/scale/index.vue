<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
      <el-form-item label="量表名称" prop="scaleName">
        <el-input v-model="queryParams.scaleName" placeholder="请输入量表名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="量表编码" prop="scaleCode">
        <el-input v-model="queryParams.scaleCode" placeholder="请输入量表编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-tree-select
          v-model="queryParams.categoryId"
          :data="categoryOptions"
          :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }"
          placeholder="请选择分类"
          clearable
          check-strictly
        />
      </el-form-item>
      <el-form-item label="类型" prop="scaleType">
        <el-select v-model="queryParams.scaleType" placeholder="请选择类型" clearable>
          <el-option label="免费" value="0" />
          <el-option label="付费" value="1" />
          <el-option label="团体定向" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['assessment:scale:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['assessment:scale:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['assessment:scale:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['assessment:scale:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="scaleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="量表ID" align="center" prop="scaleId" width="80" />
      <el-table-column label="量表名称" align="center" prop="scaleName" :show-overflow-tooltip="true" />
      <el-table-column label="量表编码" align="center" prop="scaleCode" width="120" />
      <el-table-column label="类型" align="center" prop="scaleType" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.scaleType === '0'" type="success">免费</el-tag>
          <el-tag v-else-if="scope.row.scaleType === '1'" type="warning">付费</el-tag>
          <el-tag v-else-if="scope.row.scaleType === '2'" type="info">团体定向</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="适用人群" align="center" prop="targetPopulation" :show-overflow-tooltip="true" />
      <el-table-column label="题目数" align="center" prop="questionCount" width="80" />
      <el-table-column label="时长(分)" align="center" prop="durationMinutes" width="80" />
      <el-table-column label="版本" align="center" prop="version" width="60" />
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['assessment:scale:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['assessment:scale:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/修改对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="scaleRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="量表名称" prop="scaleName">
              <el-input v-model="form.scaleName" placeholder="请输入量表名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量表编码" prop="scaleCode">
              <el-input v-model="form.scaleCode" placeholder="请输入量表编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属分类" prop="categoryId">
              <el-tree-select
                v-model="form.categoryId"
                :data="categoryOptions"
                :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }"
                placeholder="请选择分类"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="scaleType">
              <el-select v-model="form.scaleType" placeholder="请选择">
                <el-option label="免费" value="0" />
                <el-option label="付费" value="1" />
                <el-option label="团体定向" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="适用人群" prop="targetPopulation">
              <el-input v-model="form.targetPopulation" placeholder="请输入适用人群" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测评时长" prop="durationMinutes">
              <el-input-number v-model="form.durationMinutes" :min="0" placeholder="分钟" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price" v-if="form.scaleType === '1'">
              <el-input-number v-model="form.price" :min="0" :precision="2" placeholder="价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="量表简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入量表简介" />
        </el-form-item>
        <el-form-item label="信效度说明" prop="validityInfo">
          <el-input v-model="form.validityInfo" type="textarea" :rows="2" placeholder="请输入信效度说明" />
        </el-form-item>
        <el-form-item label="常模来源" prop="normSource">
          <el-input v-model="form.normSource" placeholder="请输入常模来源" />
        </el-form-item>
        <el-form-item label="版权信息" prop="copyrightInfo">
          <el-input v-model="form.copyrightInfo" placeholder="请输入版权备案信息" />
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

<script setup name="Scale">
import { ref, reactive, onMounted } from 'vue';
import { listScale, getScale, addScale, updateScale, delScale } from '@/api/assessment/scale';
import { listCategoryTree } from '@/api/assessment/category';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(true);
const showSearch = ref(true);
const scaleList = ref([]);
const categoryOptions = ref([]);
const open = ref(false);
const title = ref('');
const total = ref(0);
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  scaleName: undefined,
  scaleCode: undefined,
  categoryId: undefined,
  scaleType: undefined,
  status: undefined
});

const form = ref({});
const rules = {
  scaleName: [{ required: true, message: '量表名称不能为空', trigger: 'blur' }],
  scaleCode: [{ required: true, message: '量表编码不能为空', trigger: 'blur' }],
  categoryId: [{ required: true, message: '所属分类不能为空', trigger: 'change' }]
};

/** 查询量表列表 */
function getList() {
  loading.value = true;
  listScale(queryParams).then(response => {
    scaleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 获取分类树 */
function getCategoryTree() {
  listCategoryTree().then(response => {
    categoryOptions.value = response.data;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.scaleName = undefined;
  queryParams.scaleCode = undefined;
  queryParams.categoryId = undefined;
  queryParams.scaleType = undefined;
  queryParams.status = undefined;
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.scaleId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '新增量表';
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const scaleId = row.scaleId || ids.value[0];
  getScale(scaleId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = '修改量表';
  });
}

/** 提交按钮 */
function submitForm() {
  if (form.value.scaleId != null) {
    updateScale(form.value).then(() => {
      ElMessage.success('修改成功');
      open.value = false;
      getList();
    });
  } else {
    addScale(form.value).then(() => {
      ElMessage.success('新增成功');
      open.value = false;
      getList();
    });
  }
}

/** 删除按钮操作 */
function handleDelete(row) {
  const scaleIds = row.scaleId || ids.value;
  ElMessageBox.confirm('是否确认删除选中的量表数据?', '系统提示', { type: 'warning' }).then(() => {
    return delScale(scaleIds);
  }).then(() => {
    getList();
    ElMessage.success('删除成功');
  });
}

/** 导出按钮操作 */
function handleExport() {
  // 通过后端导出
}

/** 表单重置 */
function reset() {
  form.value = {
    scaleId: undefined,
    categoryId: undefined,
    scaleName: undefined,
    scaleCode: undefined,
    scaleType: '0',
    price: 0,
    description: undefined,
    validityInfo: undefined,
    normSource: undefined,
    targetPopulation: undefined,
    durationMinutes: 0,
    copyrightInfo: undefined,
    status: '0',
    remark: undefined
  };
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

onMounted(() => {
  getList();
  getCategoryTree();
});
</script>
