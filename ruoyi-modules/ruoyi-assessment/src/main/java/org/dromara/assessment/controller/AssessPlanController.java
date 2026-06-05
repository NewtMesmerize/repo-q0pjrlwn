package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessPlanBo;
import org.dromara.assessment.domain.vo.AssessPlanVo;
import org.dromara.assessment.service.IAssessPlanService;
import org.dromara.common.core.domain.R;
import org.dromara.common.log.annotation.Log;
import org.dromara.common.log.enums.BusinessType;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 测评计划管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/plan")
public class AssessPlanController extends BaseController {

    private final IAssessPlanService planService;

    /**
     * 查询测评计划分页列表
     */
    @SaCheckPermission("assessment:plan:list")
    @GetMapping("/list")
    public TableDataInfo<AssessPlanVo> list(AssessPlanBo bo, PageQuery pageQuery) {
        return planService.queryPageList(bo, pageQuery);
    }

    /**
     * 获取测评计划详情
     */
    @SaCheckPermission("assessment:plan:query")
    @GetMapping("/{planId}")
    public R<AssessPlanVo> getInfo(@NotNull @PathVariable Long planId) {
        return R.ok(planService.queryById(planId));
    }

    /**
     * 新增测评计划
     */
    @SaCheckPermission("assessment:plan:add")
    @Log(title = "测评计划", businessType = BusinessType.INSERT)
    @PostMapping
    public R<Void> add(@Validated @RequestBody AssessPlanBo bo) {
        return toAjax(planService.insertByBo(bo));
    }

    /**
     * 修改测评计划
     */
    @SaCheckPermission("assessment:plan:edit")
    @Log(title = "测评计划", businessType = BusinessType.UPDATE)
    @PutMapping
    public R<Void> edit(@Validated @RequestBody AssessPlanBo bo) {
        return toAjax(planService.updateByBo(bo));
    }

    /**
     * 删除测评计划
     */
    @SaCheckPermission("assessment:plan:remove")
    @Log(title = "测评计划", businessType = BusinessType.DELETE)
    @DeleteMapping("/{planIds}")
    public R<Void> remove(@NotNull @PathVariable List<Long> planIds) {
        return toAjax(planService.deleteByIds(planIds));
    }

    /**
     * 发布测评计划
     */
    @SaCheckPermission("assessment:plan:edit")
    @Log(title = "测评计划", businessType = BusinessType.UPDATE)
    @PutMapping("/publish/{planId}")
    public R<Void> publish(@NotNull @PathVariable Long planId) {
        return toAjax(planService.publish(planId));
    }

    /**
     * 结束测评计划
     */
    @SaCheckPermission("assessment:plan:edit")
    @Log(title = "测评计划", businessType = BusinessType.UPDATE)
    @PutMapping("/finish/{planId}")
    public R<Void> finish(@NotNull @PathVariable Long planId) {
        return toAjax(planService.finish(planId));
    }
}
