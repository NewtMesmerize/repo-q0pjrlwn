-- ==========================================
-- 在线测评模块 数据库表结构
-- 基于 RuoYi-Vue-Plus 框架规范
-- ==========================================

-- ----------------------------
-- 1. 量表分类表
-- ----------------------------
DROP TABLE IF EXISTS assess_scale_category;
CREATE TABLE assess_scale_category (
    category_id   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    parent_id     BIGINT       DEFAULT 0               COMMENT '父分类ID',
    category_name VARCHAR(100) NOT NULL                 COMMENT '分类名称',
    category_code VARCHAR(64)  NOT NULL                 COMMENT '分类编码',
    sort_order    INT          DEFAULT 0                COMMENT '显示顺序',
    status        CHAR(1)      DEFAULT '0'              COMMENT '状态（0正常 1停用）',
    icon          VARCHAR(255) DEFAULT NULL             COMMENT '分类图标',
    remark        VARCHAR(500) DEFAULT NULL             COMMENT '备注',
    create_dept   BIGINT       DEFAULT NULL             COMMENT '创建部门',
    create_by     BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time   DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by     BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time   DATETIME     DEFAULT NULL             COMMENT '更新时间',
    del_flag      CHAR(1)      DEFAULT '0'              COMMENT '删除标志（0存在 1删除）',
    PRIMARY KEY (category_id)
) ENGINE=InnoDB COMMENT='量表分类表';

-- 预置分类数据
INSERT INTO assess_scale_category (category_id, category_name, category_code, sort_order) VALUES
(1, '人格',     'personality',      1),
(2, '情绪情感', 'emotion',          2),
(3, '压力应激', 'stress',           3),
(4, '临床筛查', 'clinical',         4),
(5, '职业心理', 'occupational',     5),
(6, '亲子关系', 'parent_child',     6);

-- ----------------------------
-- 2. 量表主表
-- ----------------------------
DROP TABLE IF EXISTS assess_scale;
CREATE TABLE assess_scale (
    scale_id          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '量表ID',
    category_id       BIGINT        NOT NULL                COMMENT '所属分类ID',
    scale_name        VARCHAR(200)  NOT NULL                COMMENT '量表名称',
    scale_code        VARCHAR(64)   NOT NULL                COMMENT '量表编码',
    scale_type        CHAR(1)       DEFAULT '0'             COMMENT '类型（0免费 1付费 2团体定向）',
    price             DECIMAL(10,2) DEFAULT 0.00            COMMENT '价格（付费时）',
    description       TEXT          DEFAULT NULL             COMMENT '量表简介',
    validity_info     TEXT          DEFAULT NULL             COMMENT '信效度说明',
    norm_source       VARCHAR(500)  DEFAULT NULL             COMMENT '常模来源',
    target_population VARCHAR(200)  DEFAULT NULL             COMMENT '适用人群',
    duration_minutes  INT           DEFAULT 0                COMMENT '测评时长(分钟)',
    question_count    INT           DEFAULT 0                COMMENT '题目数量',
    copyright_info    VARCHAR(500)  DEFAULT NULL             COMMENT '版权备案信息',
    version           VARCHAR(20)   DEFAULT '1.0'            COMMENT '量表版本',
    trial_enabled     TINYINT(1)    DEFAULT 0                COMMENT '是否开启试测体验',
    trial_count       INT           DEFAULT 5                COMMENT '试测体验题目数',
    cover_image       VARCHAR(500)  DEFAULT NULL             COMMENT '封面图片',
    status            CHAR(1)       DEFAULT '0'              COMMENT '状态（0正常 1停用）',
    remark            VARCHAR(500)  DEFAULT NULL             COMMENT '备注',
    create_dept       BIGINT        DEFAULT NULL             COMMENT '创建部门',
    create_by         BIGINT        DEFAULT NULL             COMMENT '创建者',
    create_time       DATETIME      DEFAULT NULL             COMMENT '创建时间',
    update_by         BIGINT        DEFAULT NULL             COMMENT '更新者',
    update_time       DATETIME      DEFAULT NULL             COMMENT '更新时间',
    del_flag          CHAR(1)       DEFAULT '0'              COMMENT '删除标志',
    PRIMARY KEY (scale_id),
    UNIQUE KEY uk_scale_code (scale_code)
) ENGINE=InnoDB COMMENT='量表主表';

-- ----------------------------
-- 3. 量表维度表
-- ----------------------------
DROP TABLE IF EXISTS assess_dimension;
CREATE TABLE assess_dimension (
    dimension_id   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '维度ID',
    scale_id       BIGINT       NOT NULL                COMMENT '所属量表ID',
    dimension_name VARCHAR(100) NOT NULL                 COMMENT '维度名称',
    dimension_code VARCHAR(64)  NOT NULL                 COMMENT '维度编码',
    description    VARCHAR(500) DEFAULT NULL             COMMENT '维度描述',
    sort_order     INT          DEFAULT 0                COMMENT '显示顺序',
    create_by      BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time    DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by      BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time    DATETIME     DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (dimension_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='量表维度表';

-- ----------------------------
-- 4. 量表题目表
-- ----------------------------
DROP TABLE IF EXISTS assess_question;
CREATE TABLE assess_question (
    question_id   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '题目ID',
    scale_id      BIGINT       NOT NULL                COMMENT '所属量表ID',
    dimension_id  BIGINT       DEFAULT NULL             COMMENT '所属维度ID',
    question_type CHAR(1)      DEFAULT '0'              COMMENT '题型（0李克特 1情景选择 2投射测试 3开放问答 4趣味题）',
    sort_order    INT          DEFAULT 0                COMMENT '题目序号',
    content       TEXT         NOT NULL                 COMMENT '题目内容',
    image_url     VARCHAR(500) DEFAULT NULL             COMMENT '题目图片(投射测试用)',
    is_reverse    TINYINT(1)   DEFAULT 0                COMMENT '是否反向计分',
    required      TINYINT(1)   DEFAULT 1                COMMENT '是否必答',
    remark        VARCHAR(500) DEFAULT NULL             COMMENT '备注',
    create_by     BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time   DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by     BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time   DATETIME     DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (question_id),
    KEY idx_scale_id (scale_id),
    KEY idx_dimension_id (dimension_id)
) ENGINE=InnoDB COMMENT='量表题目表';

-- ----------------------------
-- 5. 题目选项表
-- ----------------------------
DROP TABLE IF EXISTS assess_question_option;
CREATE TABLE assess_question_option (
    option_id   BIGINT       NOT NULL AUTO_INCREMENT COMMENT '选项ID',
    question_id BIGINT       NOT NULL                COMMENT '所属题目ID',
    label       VARCHAR(10)  NOT NULL                 COMMENT '选项标签(A/B/C...)',
    content     VARCHAR(500) NOT NULL                 COMMENT '选项内容',
    score       DECIMAL(5,2) DEFAULT 0                COMMENT '选项分值',
    sort_order  INT          DEFAULT 0                COMMENT '显示顺序',
    create_by   BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by   BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time DATETIME     DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (option_id),
    KEY idx_question_id (question_id)
) ENGINE=InnoDB COMMENT='题目选项表';

-- ----------------------------
-- 6. 计分规则表
-- ----------------------------
DROP TABLE IF EXISTS assess_scoring_rule;
CREATE TABLE assess_scoring_rule (
    rule_id       BIGINT       NOT NULL AUTO_INCREMENT COMMENT '规则ID',
    scale_id      BIGINT       NOT NULL                COMMENT '所属量表ID',
    dimension_id  BIGINT       DEFAULT NULL             COMMENT '所属维度ID（NULL表示总分规则）',
    rule_name     VARCHAR(100) NOT NULL                 COMMENT '规则名称',
    rule_type     CHAR(1)      DEFAULT '0'              COMMENT '规则类型（0直接求和 1加权求和 2公式计算）',
    formula       VARCHAR(500) DEFAULT NULL             COMMENT '计分公式',
    score_min     DECIMAL(10,2) DEFAULT NULL            COMMENT '最低分',
    score_max     DECIMAL(10,2) DEFAULT NULL            COMMENT '最高分',
    remark        VARCHAR(500) DEFAULT NULL             COMMENT '备注',
    create_by     BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time   DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by     BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time   DATETIME     DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (rule_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='计分规则表';

-- ----------------------------
-- 7. 常模数据表
-- ----------------------------
DROP TABLE IF EXISTS assess_norm;
CREATE TABLE assess_norm (
    norm_id       BIGINT        NOT NULL AUTO_INCREMENT COMMENT '常模ID',
    scale_id      BIGINT        NOT NULL                COMMENT '所属量表ID',
    dimension_id  BIGINT        DEFAULT NULL             COMMENT '所属维度ID',
    norm_name     VARCHAR(100)  NOT NULL                 COMMENT '常模名称',
    population    VARCHAR(200)  DEFAULT NULL             COMMENT '适用人群',
    age_min       INT           DEFAULT NULL             COMMENT '最小年龄',
    age_max       INT           DEFAULT NULL             COMMENT '最大年龄',
    gender        CHAR(1)       DEFAULT '0'              COMMENT '性别（0不限 1男 2女）',
    mean_score    DECIMAL(10,2) DEFAULT NULL             COMMENT '均值',
    std_deviation DECIMAL(10,2) DEFAULT NULL             COMMENT '标准差',
    sample_size   INT           DEFAULT NULL             COMMENT '样本量',
    source        VARCHAR(500)  DEFAULT NULL             COMMENT '数据来源',
    remark        VARCHAR(500)  DEFAULT NULL             COMMENT '备注',
    create_by     BIGINT        DEFAULT NULL             COMMENT '创建者',
    create_time   DATETIME      DEFAULT NULL             COMMENT '创建时间',
    update_by     BIGINT        DEFAULT NULL             COMMENT '更新者',
    update_time   DATETIME      DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (norm_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='常模数据表';

-- ----------------------------
-- 8. 风险预警阈值表
-- ----------------------------
DROP TABLE IF EXISTS assess_risk_threshold;
CREATE TABLE assess_risk_threshold (
    threshold_id  BIGINT        NOT NULL AUTO_INCREMENT COMMENT '阈值ID',
    scale_id      BIGINT        NOT NULL                COMMENT '所属量表ID',
    dimension_id  BIGINT        DEFAULT NULL             COMMENT '所属维度ID',
    risk_level    CHAR(1)       DEFAULT '0'              COMMENT '风险等级（0正常 1轻度 2中度 3重度）',
    level_label   VARCHAR(50)   NOT NULL                 COMMENT '等级标签',
    score_min     DECIMAL(10,2) NOT NULL                 COMMENT '分值下限',
    score_max     DECIMAL(10,2) NOT NULL                 COMMENT '分值上限',
    description   VARCHAR(500)  DEFAULT NULL             COMMENT '等级描述',
    suggestion    TEXT          DEFAULT NULL              COMMENT '建议话术',
    auto_alert    TINYINT(1)    DEFAULT 0                COMMENT '是否自动预警',
    create_by     BIGINT        DEFAULT NULL             COMMENT '创建者',
    create_time   DATETIME      DEFAULT NULL             COMMENT '创建时间',
    update_by     BIGINT        DEFAULT NULL             COMMENT '更新者',
    update_time   DATETIME      DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (threshold_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='风险预警阈值表';

-- ----------------------------
-- 9. 测评计划表
-- ----------------------------
DROP TABLE IF EXISTS assess_plan;
CREATE TABLE assess_plan (
    plan_id         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '计划ID',
    plan_name       VARCHAR(200) NOT NULL                 COMMENT '计划名称',
    scale_id        BIGINT       NOT NULL                 COMMENT '关联量表ID',
    plan_type       CHAR(1)      DEFAULT '0'              COMMENT '发布类型（0个人开放 1校园普查 2定向测评）',
    start_time      DATETIME     DEFAULT NULL             COMMENT '开始时间',
    end_time        DATETIME     DEFAULT NULL             COMMENT '结束时间',
    max_attempts    INT          DEFAULT 1                 COMMENT '最大作答次数',
    age_min         INT          DEFAULT NULL              COMMENT '年龄限制-最小',
    age_max         INT          DEFAULT NULL              COMMENT '年龄限制-最大',
    target_scope    VARCHAR(500) DEFAULT NULL              COMMENT '参与范围描述',
    consent_text    TEXT         DEFAULT NULL              COMMENT '知情同意书内容',
    privacy_text    TEXT         DEFAULT NULL              COMMENT '隐私保密承诺',
    instructions    TEXT         DEFAULT NULL              COMMENT '测评须知',
    report_template CHAR(1)      DEFAULT '0'              COMMENT '报告模板（0标准 1简版 2专业版）',
    status          CHAR(1)      DEFAULT '0'              COMMENT '状态（0草稿 1发布 2已结束 3已归档）',
    remark          VARCHAR(500) DEFAULT NULL              COMMENT '备注',
    create_dept     BIGINT       DEFAULT NULL              COMMENT '创建部门',
    create_by       BIGINT       DEFAULT NULL              COMMENT '创建者',
    create_time     DATETIME     DEFAULT NULL              COMMENT '创建时间',
    update_by       BIGINT       DEFAULT NULL              COMMENT '更新者',
    update_time     DATETIME     DEFAULT NULL              COMMENT '更新时间',
    del_flag        CHAR(1)      DEFAULT '0'               COMMENT '删除标志',
    PRIMARY KEY (plan_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='测评计划表';

-- ----------------------------
-- 10. 测评记录表
-- ----------------------------
DROP TABLE IF EXISTS assess_record;
CREATE TABLE assess_record (
    record_id       BIGINT       NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    plan_id         BIGINT       DEFAULT NULL             COMMENT '所属计划ID',
    scale_id        BIGINT       NOT NULL                 COMMENT '量表ID',
    user_id         BIGINT       NOT NULL                 COMMENT '受测者ID',
    attempt_no      INT          DEFAULT 1                COMMENT '作答次数',
    status          CHAR(1)      DEFAULT '0'              COMMENT '状态（0进行中 1已完成 2已暂停 3已超时 4异常）',
    start_time      DATETIME     DEFAULT NULL             COMMENT '开始时间',
    end_time        DATETIME     DEFAULT NULL             COMMENT '结束时间',
    duration_seconds INT         DEFAULT 0                COMMENT '实际用时(秒)',
    progress         INT         DEFAULT 0                COMMENT '答题进度(已答题数)',
    total_questions  INT         DEFAULT 0                COMMENT '总题数',
    ip_address      VARCHAR(128) DEFAULT NULL             COMMENT 'IP地址',
    device_info     VARCHAR(200) DEFAULT NULL             COMMENT '设备信息',
    abnormal_flag   CHAR(1)      DEFAULT '0'              COMMENT '异常标记（0正常 1乱答 2白卷 3速答）',
    consent_agreed  TINYINT(1)   DEFAULT 0                COMMENT '是否同意知情同意书',
    consent_time    DATETIME     DEFAULT NULL             COMMENT '同意时间',
    create_by       BIGINT       DEFAULT NULL             COMMENT '创建者',
    create_time     DATETIME     DEFAULT NULL             COMMENT '创建时间',
    update_by       BIGINT       DEFAULT NULL             COMMENT '更新者',
    update_time     DATETIME     DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (record_id),
    KEY idx_user_id (user_id),
    KEY idx_plan_id (plan_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='测评记录表';

-- ----------------------------
-- 11. 作答记录表
-- ----------------------------
DROP TABLE IF EXISTS assess_answer;
CREATE TABLE assess_answer (
    answer_id     BIGINT        NOT NULL AUTO_INCREMENT COMMENT '答案ID',
    record_id     BIGINT        NOT NULL                COMMENT '测评记录ID',
    question_id   BIGINT        NOT NULL                COMMENT '题目ID',
    option_id     BIGINT        DEFAULT NULL             COMMENT '选中选项ID',
    answer_text   TEXT          DEFAULT NULL             COMMENT '开放式问答内容',
    score         DECIMAL(5,2)  DEFAULT NULL             COMMENT '得分',
    answer_time   DATETIME      DEFAULT NULL             COMMENT '作答时间',
    time_spent    INT           DEFAULT 0                COMMENT '答题耗时(秒)',
    create_time   DATETIME      DEFAULT NULL             COMMENT '创建时间',
    update_time   DATETIME      DEFAULT NULL             COMMENT '更新时间',
    PRIMARY KEY (answer_id),
    KEY idx_record_id (record_id),
    KEY idx_question_id (question_id)
) ENGINE=InnoDB COMMENT='作答记录表';

-- ----------------------------
-- 12. 测评报告表
-- ----------------------------
DROP TABLE IF EXISTS assess_report;
CREATE TABLE assess_report (
    report_id       BIGINT        NOT NULL AUTO_INCREMENT COMMENT '报告ID',
    record_id       BIGINT        NOT NULL                COMMENT '测评记录ID',
    scale_id        BIGINT        NOT NULL                COMMENT '量表ID',
    user_id         BIGINT        NOT NULL                COMMENT '受测者ID',
    report_type     CHAR(1)       DEFAULT '0'              COMMENT '报告类型（0自动 1人工复核）',
    total_raw_score DECIMAL(10,2) DEFAULT NULL             COMMENT '原始总分',
    total_std_score DECIMAL(10,2) DEFAULT NULL             COMMENT '标准总分',
    risk_level      CHAR(1)       DEFAULT '0'              COMMENT '风险等级（0正常 1轻度 2中度 3重度）',
    symptom_flag    VARCHAR(500)  DEFAULT NULL              COMMENT '症状筛查标记',
    trait_analysis  TEXT          DEFAULT NULL              COMMENT '特质解读',
    suggestion      TEXT          DEFAULT NULL              COMMENT '建议',
    review_status   CHAR(1)       DEFAULT '0'              COMMENT '复核状态（0待复核 1已复核 2无需复核）',
    reviewer_id     BIGINT        DEFAULT NULL              COMMENT '复核人ID',
    review_time     DATETIME      DEFAULT NULL              COMMENT '复核时间',
    review_comment  TEXT          DEFAULT NULL              COMMENT '复核意见',
    encrypt_key     VARCHAR(64)   DEFAULT NULL              COMMENT '报告加密密钥',
    pdf_url         VARCHAR(500)  DEFAULT NULL              COMMENT 'PDF报告地址',
    status          CHAR(1)       DEFAULT '0'               COMMENT '状态（0生成中 1已生成 2生成失败）',
    create_by       BIGINT        DEFAULT NULL              COMMENT '创建者',
    create_time     DATETIME      DEFAULT NULL              COMMENT '创建时间',
    update_by       BIGINT        DEFAULT NULL              COMMENT '更新者',
    update_time     DATETIME      DEFAULT NULL              COMMENT '更新时间',
    del_flag        CHAR(1)       DEFAULT '0'               COMMENT '删除标志',
    PRIMARY KEY (report_id),
    KEY idx_record_id (record_id),
    KEY idx_user_id (user_id)
) ENGINE=InnoDB COMMENT='测评报告表';

-- ----------------------------
-- 13. 报告维度得分表
-- ----------------------------
DROP TABLE IF EXISTS assess_report_dimension;
CREATE TABLE assess_report_dimension (
    id            BIGINT        NOT NULL AUTO_INCREMENT COMMENT 'ID',
    report_id     BIGINT        NOT NULL                COMMENT '报告ID',
    dimension_id  BIGINT        NOT NULL                COMMENT '维度ID',
    raw_score     DECIMAL(10,2) DEFAULT NULL             COMMENT '原始分',
    std_score     DECIMAL(10,2) DEFAULT NULL             COMMENT '标准分',
    norm_compare  VARCHAR(200)  DEFAULT NULL             COMMENT '常模对照结果',
    risk_level    CHAR(1)       DEFAULT '0'              COMMENT '风险等级',
    interpretation TEXT         DEFAULT NULL              COMMENT '维度解读',
    create_time   DATETIME      DEFAULT NULL              COMMENT '创建时间',
    PRIMARY KEY (id),
    KEY idx_report_id (report_id)
) ENGINE=InnoDB COMMENT='报告维度得分表';

-- ----------------------------
-- 14. 风险预警记录表
-- ----------------------------
DROP TABLE IF EXISTS assess_risk_alert;
CREATE TABLE assess_risk_alert (
    alert_id      BIGINT       NOT NULL AUTO_INCREMENT COMMENT '预警ID',
    report_id     BIGINT       NOT NULL                COMMENT '报告ID',
    record_id     BIGINT       NOT NULL                COMMENT '测评记录ID',
    user_id       BIGINT       NOT NULL                COMMENT '受测者ID',
    risk_level    CHAR(1)      NOT NULL                 COMMENT '风险等级（1轻度 2中度 3重度）',
    risk_detail   TEXT         DEFAULT NULL              COMMENT '风险详情',
    handle_status CHAR(1)      DEFAULT '0'              COMMENT '处理状态（0待处理 1已介入 2已关闭）',
    handler_id    BIGINT       DEFAULT NULL              COMMENT '处理人ID（心理师）',
    handle_time   DATETIME     DEFAULT NULL              COMMENT '处理时间',
    handle_result TEXT         DEFAULT NULL              COMMENT '处理结果',
    create_by     BIGINT       DEFAULT NULL              COMMENT '创建者',
    create_time   DATETIME     DEFAULT NULL              COMMENT '创建时间',
    update_by     BIGINT       DEFAULT NULL              COMMENT '更新者',
    update_time   DATETIME     DEFAULT NULL              COMMENT '更新时间',
    PRIMARY KEY (alert_id),
    KEY idx_user_id (user_id),
    KEY idx_report_id (report_id),
    KEY idx_handle_status (handle_status)
) ENGINE=InnoDB COMMENT='风险预警记录表';

-- ----------------------------
-- 15. 量表版本历史表
-- ----------------------------
DROP TABLE IF EXISTS assess_scale_version;
CREATE TABLE assess_scale_version (
    version_id    BIGINT       NOT NULL AUTO_INCREMENT COMMENT '版本ID',
    scale_id      BIGINT       NOT NULL                COMMENT '量表ID',
    version       VARCHAR(20)  NOT NULL                 COMMENT '版本号',
    change_log    TEXT         DEFAULT NULL              COMMENT '变更说明',
    snapshot_data LONGTEXT     DEFAULT NULL              COMMENT '版本快照(JSON)',
    create_by     BIGINT       DEFAULT NULL              COMMENT '创建者',
    create_time   DATETIME     DEFAULT NULL              COMMENT '创建时间',
    PRIMARY KEY (version_id),
    KEY idx_scale_id (scale_id)
) ENGINE=InnoDB COMMENT='量表版本历史表';
