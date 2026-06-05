-- ==========================================
-- 在线测评模块 菜单与权限配置
-- 适用于 RuoYi-Vue-Plus 系统菜单表
-- ==========================================

-- 一级菜单: 在线测评
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time, remark)
VALUES ('在线测评', 0, 10, 'assessment', NULL, 'M', '0', '0', '', 'education', 1, NOW(), '在线测评模块');

-- 获取一级菜单ID (假设为 @parentId)
SET @parentId = LAST_INSERT_ID();

-- 二级菜单: 量表分类管理
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('量表分类', @parentId, 1, 'category', 'assessment/category/index', 'C', '0', '0', 'assessment:category:list', 'tree', 1, NOW());
SET @categoryMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('分类查询', @categoryMenuId, 1, 'F', 'assessment:category:query', 1, NOW()),
('分类新增', @categoryMenuId, 2, 'F', 'assessment:category:add', 1, NOW()),
('分类修改', @categoryMenuId, 3, 'F', 'assessment:category:edit', 1, NOW()),
('分类删除', @categoryMenuId, 4, 'F', 'assessment:category:remove', 1, NOW());

-- 二级菜单: 量表管理
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('量表管理', @parentId, 2, 'scale', 'assessment/scale/index', 'C', '0', '0', 'assessment:scale:list', 'documentation', 1, NOW());
SET @scaleMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('量表查询', @scaleMenuId, 1, 'F', 'assessment:scale:query', 1, NOW()),
('量表新增', @scaleMenuId, 2, 'F', 'assessment:scale:add', 1, NOW()),
('量表修改', @scaleMenuId, 3, 'F', 'assessment:scale:edit', 1, NOW()),
('量表删除', @scaleMenuId, 4, 'F', 'assessment:scale:remove', 1, NOW()),
('量表导出', @scaleMenuId, 5, 'F', 'assessment:scale:export', 1, NOW());

-- 二级菜单: 题目管理
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('题目管理', @parentId, 3, 'question', 'assessment/question/index', 'C', '0', '0', 'assessment:question:list', 'edit', 1, NOW());
SET @questionMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('题目查询', @questionMenuId, 1, 'F', 'assessment:question:query', 1, NOW()),
('题目新增', @questionMenuId, 2, 'F', 'assessment:question:add', 1, NOW()),
('题目修改', @questionMenuId, 3, 'F', 'assessment:question:edit', 1, NOW()),
('题目删除', @questionMenuId, 4, 'F', 'assessment:question:remove', 1, NOW());

-- 二级菜单: 测评计划
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('测评计划', @parentId, 4, 'plan', 'assessment/plan/index', 'C', '0', '0', 'assessment:plan:list', 'date', 1, NOW());
SET @planMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('计划查询', @planMenuId, 1, 'F', 'assessment:plan:query', 1, NOW()),
('计划新增', @planMenuId, 2, 'F', 'assessment:plan:add', 1, NOW()),
('计划修改', @planMenuId, 3, 'F', 'assessment:plan:edit', 1, NOW()),
('计划删除', @planMenuId, 4, 'F', 'assessment:plan:remove', 1, NOW());

-- 二级菜单: 测评记录
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('测评记录', @parentId, 5, 'record', 'assessment/record/index', 'C', '0', '0', 'assessment:record:list', 'list', 1, NOW());
SET @recordMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('记录查询', @recordMenuId, 1, 'F', 'assessment:record:query', 1, NOW()),
('记录删除', @recordMenuId, 2, 'F', 'assessment:record:remove', 1, NOW());

-- 二级菜单: 测评报告
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('测评报告', @parentId, 6, 'report', 'assessment/report/index', 'C', '0', '0', 'assessment:report:list', 'chart', 1, NOW());
SET @reportMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('报告查询', @reportMenuId, 1, 'F', 'assessment:report:query', 1, NOW()),
('报告复核', @reportMenuId, 2, 'F', 'assessment:report:review', 1, NOW()),
('报告删除', @reportMenuId, 3, 'F', 'assessment:report:remove', 1, NOW());

-- 二级菜单: 风险预警
INSERT INTO sys_menu (menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, create_by, create_time)
VALUES ('风险预警', @parentId, 7, 'risk', 'assessment/risk/index', 'C', '0', '0', 'assessment:risk:list', 'warning', 1, NOW());
SET @riskMenuId = LAST_INSERT_ID();

INSERT INTO sys_menu (menu_name, parent_id, order_num, menu_type, perms, create_by, create_time) VALUES
('预警查询', @riskMenuId, 1, 'F', 'assessment:risk:query', 1, NOW()),
('预警处理', @riskMenuId, 2, 'F', 'assessment:risk:handle', 1, NOW());
