package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessQuestionBo;
import org.dromara.assessment.domain.vo.AssessQuestionVo;
import org.dromara.assessment.service.IAssessQuestionService;
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
 * 量表题目管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/question")
public class AssessQuestionController extends BaseController {

    private final IAssessQuestionService questionService;

    /**
     * 查询题目分页列表
     */
    @SaCheckPermission("assessment:question:list")
    @GetMapping("/list")
    public TableDataInfo<AssessQuestionVo> list(AssessQuestionBo bo, PageQuery pageQuery) {
        return questionService.queryPageList(bo, pageQuery);
    }

    /**
     * 查询量表下所有题目（含选项）
     */
    @SaCheckPermission("assessment:question:list")
    @GetMapping("/scale/{scaleId}")
    public R<List<AssessQuestionVo>> listByScale(@NotNull @PathVariable Long scaleId) {
        return R.ok(questionService.queryListByScaleId(scaleId));
    }

    /**
     * 获取题目详情
     */
    @SaCheckPermission("assessment:question:query")
    @GetMapping("/{questionId}")
    public R<AssessQuestionVo> getInfo(@NotNull @PathVariable Long questionId) {
        return R.ok(questionService.queryById(questionId));
    }

    /**
     * 新增题目
     */
    @SaCheckPermission("assessment:question:add")
    @Log(title = "量表题目", businessType = BusinessType.INSERT)
    @PostMapping
    public R<Void> add(@Validated @RequestBody AssessQuestionBo bo) {
        return toAjax(questionService.insertByBo(bo));
    }

    /**
     * 修改题目
     */
    @SaCheckPermission("assessment:question:edit")
    @Log(title = "量表题目", businessType = BusinessType.UPDATE)
    @PutMapping
    public R<Void> edit(@Validated @RequestBody AssessQuestionBo bo) {
        return toAjax(questionService.updateByBo(bo));
    }

    /**
     * 删除题目
     */
    @SaCheckPermission("assessment:question:remove")
    @Log(title = "量表题目", businessType = BusinessType.DELETE)
    @DeleteMapping("/{questionIds}")
    public R<Void> remove(@NotNull @PathVariable List<Long> questionIds) {
        return toAjax(questionService.deleteByIds(questionIds));
    }
}
