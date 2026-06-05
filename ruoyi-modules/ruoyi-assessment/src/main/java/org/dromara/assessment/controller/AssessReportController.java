package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessReportBo;
import org.dromara.assessment.domain.vo.AssessReportVo;
import org.dromara.assessment.service.IAssessReportService;
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
 * 测评报告管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/report")
public class AssessReportController extends BaseController {

    private final IAssessReportService reportService;

    /**
     * 查询测评报告分页列表
     */
    @SaCheckPermission("assessment:report:list")
    @GetMapping("/list")
    public TableDataInfo<AssessReportVo> list(AssessReportBo bo, PageQuery pageQuery) {
        return reportService.queryPageList(bo, pageQuery);
    }

    /**
     * 获取测评报告详情
     */
    @SaCheckPermission("assessment:report:query")
    @GetMapping("/{reportId}")
    public R<AssessReportVo> getInfo(@NotNull @PathVariable Long reportId) {
        return R.ok(reportService.queryById(reportId));
    }

    /**
     * 人工复核报告
     */
    @SaCheckPermission("assessment:report:review")
    @Log(title = "测评报告", businessType = BusinessType.UPDATE)
    @PutMapping("/review/{reportId}")
    public R<Void> review(@NotNull @PathVariable Long reportId,
                          @NotBlank @RequestParam String reviewComment) {
        return toAjax(reportService.review(reportId, reviewComment));
    }

    /**
     * 删除测评报告
     */
    @SaCheckPermission("assessment:report:remove")
    @Log(title = "测评报告", businessType = BusinessType.DELETE)
    @DeleteMapping("/{reportIds}")
    public R<Void> remove(@NotNull @PathVariable List<Long> reportIds) {
        return toAjax(reportService.deleteByIds(reportIds));
    }
}
