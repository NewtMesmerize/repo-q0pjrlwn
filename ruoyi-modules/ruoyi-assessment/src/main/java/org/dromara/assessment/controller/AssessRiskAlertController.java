package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessRiskAlertBo;
import org.dromara.assessment.domain.vo.AssessRiskAlertVo;
import org.dromara.assessment.service.IAssessRiskAlertService;
import org.dromara.common.core.domain.R;
import org.dromara.common.log.annotation.Log;
import org.dromara.common.log.enums.BusinessType;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 风险预警管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/risk")
public class AssessRiskAlertController extends BaseController {

    private final IAssessRiskAlertService riskAlertService;

    /**
     * 查询风险预警分页列表
     */
    @SaCheckPermission("assessment:risk:list")
    @GetMapping("/list")
    public TableDataInfo<AssessRiskAlertVo> list(AssessRiskAlertBo bo, PageQuery pageQuery) {
        return riskAlertService.queryPageList(bo, pageQuery);
    }

    /**
     * 获取预警详情
     */
    @SaCheckPermission("assessment:risk:query")
    @GetMapping("/{alertId}")
    public R<AssessRiskAlertVo> getInfo(@NotNull @PathVariable Long alertId) {
        return R.ok(riskAlertService.queryById(alertId));
    }

    /**
     * 处理预警（心理师介入）
     */
    @SaCheckPermission("assessment:risk:handle")
    @Log(title = "风险预警", businessType = BusinessType.UPDATE)
    @PutMapping("/handle/{alertId}")
    public R<Void> handle(@NotNull @PathVariable Long alertId,
                          @NotNull @RequestParam Long handlerId,
                          @NotBlank @RequestParam String handleResult) {
        return toAjax(riskAlertService.handle(alertId, handlerId, handleResult));
    }

    /**
     * 关闭预警
     */
    @SaCheckPermission("assessment:risk:handle")
    @Log(title = "风险预警", businessType = BusinessType.UPDATE)
    @PutMapping("/close/{alertId}")
    public R<Void> close(@NotNull @PathVariable Long alertId) {
        return toAjax(riskAlertService.close(alertId));
    }
}
