package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessScaleCategoryBo;
import org.dromara.assessment.domain.vo.AssessScaleCategoryVo;
import org.dromara.assessment.service.IAssessScaleCategoryService;
import org.dromara.common.core.domain.R;
import org.dromara.common.log.annotation.Log;
import org.dromara.common.log.enums.BusinessType;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 量表分类管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/category")
public class AssessScaleCategoryController extends BaseController {

    private final IAssessScaleCategoryService categoryService;

    /**
     * 查询分类树形列表
     */
    @SaCheckPermission("assessment:category:list")
    @GetMapping("/tree")
    public R<List<AssessScaleCategoryVo>> tree(AssessScaleCategoryBo bo) {
        return R.ok(categoryService.queryTree(bo));
    }

    /**
     * 获取分类详情
     */
    @SaCheckPermission("assessment:category:query")
    @GetMapping("/{categoryId}")
    public R<AssessScaleCategoryVo> getInfo(@NotNull @PathVariable Long categoryId) {
        return R.ok(categoryService.queryById(categoryId));
    }

    /**
     * 新增分类
     */
    @SaCheckPermission("assessment:category:add")
    @Log(title = "量表分类", businessType = BusinessType.INSERT)
    @PostMapping
    public R<Void> add(@Validated @RequestBody AssessScaleCategoryBo bo) {
        return toAjax(categoryService.insertByBo(bo));
    }

    /**
     * 修改分类
     */
    @SaCheckPermission("assessment:category:edit")
    @Log(title = "量表分类", businessType = BusinessType.UPDATE)
    @PutMapping
    public R<Void> edit(@Validated @RequestBody AssessScaleCategoryBo bo) {
        return toAjax(categoryService.updateByBo(bo));
    }

    /**
     * 删除分类
     */
    @SaCheckPermission("assessment:category:remove")
    @Log(title = "量表分类", businessType = BusinessType.DELETE)
    @DeleteMapping("/{categoryId}")
    public R<Void> remove(@NotNull @PathVariable Long categoryId) {
        return toAjax(categoryService.deleteById(categoryId));
    }
}
