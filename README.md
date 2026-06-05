# 家校社医大融合在线平台 - 在线测评模块

基于 **RuoYi-Vue-Plus** 框架开发的在线心理测评系统模块。

## 模块概览

本模块实现了完整的在线心理测评功能链路，包括量表管理、测评发布、作答交互、报告生成和风险预警。

### 功能架构

| 功能模块 | 说明 |
|---------|------|
| 量表分类管理 | 人格、情绪情感、压力应激、临床筛查、职业心理、亲子关系 |
| 量表管理 | 量表录入、信效度维护、常模数据库、版权备案、版本迭代 |
| 题目管理 | 李克特量表、情景选择题、投射测试、开放式问答、趣味题 |
| 测评计划 | 个人开放、校园普查、定向测评，含知情同意书与隐私承诺 |
| 测评记录 | 断点续答、计时提醒、异常识别（乱答/白卷/速答） |
| 测评报告 | 原始分/标准分/常模对照/维度得分，支持人工复核 |
| 风险预警 | 高风险自动预警、心理师介入处理 |

## 技术栈

- **后端**: Spring Boot + MyBatis-Plus + Sa-Token
- **前端**: Vue 3 + Element Plus + TypeScript
- **数据库**: MySQL 8.0+
- **框架**: RuoYi-Vue-Plus

## 项目结构

```
├── sql/                                    # 数据库脚本
│   ├── assessment.sql                      # 业务表结构（15张表）
│   └── assessment_menu.sql                 # 菜单与权限配置
├── ruoyi-modules/ruoyi-assessment/         # 后端模块
│   └── src/main/java/org/dromara/assessment/
│       ├── controller/                     # REST API 控制器
│       ├── domain/
│       │   ├── entity/                     # 数据库实体类
│       │   ├── bo/                         # 业务对象 (请求入参)
│       │   └── vo/                         # 视图对象 (响应出参)
│       ├── mapper/                         # MyBatis-Plus Mapper
│       └── service/                        # 业务逻辑层
│           └── impl/
└── ruoyi-ui/src/                           # 前端模块
    ├── api/assessment/                     # API 接口封装
    └── views/assessment/                   # 管理页面
        ├── scale/                          # 量表管理
        ├── plan/                           # 测评计划
        ├── record/                         # 测评记录
        ├── report/                         # 测评报告
        └── risk/                           # 风险预警
```

## 数据库表设计

| 表名 | 说明 |
|------|------|
| assess_scale_category | 量表分类表 |
| assess_scale | 量表主表 |
| assess_dimension | 量表维度表 |
| assess_question | 量表题目表 |
| assess_question_option | 题目选项表 |
| assess_scoring_rule | 计分规则表 |
| assess_norm | 常模数据表 |
| assess_risk_threshold | 风险预警阈值表 |
| assess_plan | 测评计划表 |
| assess_record | 测评记录表 |
| assess_answer | 作答记录表 |
| assess_report | 测评报告表 |
| assess_report_dimension | 报告维度得分表 |
| assess_risk_alert | 风险预警记录表 |
| assess_scale_version | 量表版本历史表 |

## 部署说明

1. 执行 `sql/assessment.sql` 创建业务表
2. 执行 `sql/assessment_menu.sql` 初始化菜单权限
3. 将 `ruoyi-modules/ruoyi-assessment` 模块加入主项目 POM
4. 前端文件放置到 RuoYi-Vue-Plus 前端对应目录

## API 接口列表

| 路径 | 方法 | 说明 |
|------|------|------|
| /assessment/category/tree | GET | 查询分类树 |
| /assessment/scale/list | GET | 量表分页列表 |
| /assessment/scale/export | POST | 导出量表 |
| /assessment/question/list | GET | 题目分页列表 |
| /assessment/question/scale/{scaleId} | GET | 量表下所有题目(含选项) |
| /assessment/plan/list | GET | 测评计划列表 |
| /assessment/plan/publish/{planId} | PUT | 发布计划 |
| /assessment/plan/finish/{planId} | PUT | 结束计划 |
| /assessment/record/list | GET | 测评记录列表 |
| /assessment/report/list | GET | 报告列表 |
| /assessment/report/review/{reportId} | PUT | 人工复核 |
| /assessment/risk/list | GET | 预警列表 |
| /assessment/risk/handle/{alertId} | PUT | 预警介入处理 |
| /assessment/risk/close/{alertId} | PUT | 关闭预警 |
