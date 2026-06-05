package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessScaleBo;
import org.dromara.assessment.domain.vo.AssessScaleVo;
import org.dromara.assessment.service.IAssessScaleService;
import org.dromara.common.core.domain.R;
import org.dromara.common.excel.utils.ExcelUtil;
import org.dromara.common.log.annotation.Log;
import org.dromara.common.log.enums.BusinessType;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 量表管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/scale")
public class AssessScaleController extends BaseController {

    private final IAssessScaleService scaleService;

    /**
     * 查询量表分页列表
     */
    @SaCheckPermission("assessment:scale:list")
    @GetMapping("/list")
    public TableDataInfo<AssessScaleVo> list(AssessScaleBo bo, PageQuery pageQuery) {
        return scaleService.queryPageList(bo, pageQuery);
    }

    /**
     * 导出量表列表
     */
    @SaCheckPermission("assessment:scale:export")
    @Log(title = "量表管理", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(AssessScaleBo bo, HttpServletResponse response) {
        List<AssessScaleVo> list = scaleService.queryList(bo);
        ExcelUtil.exportExcel(list, "量表数据", AssessScaleVo.class, response);
    }

    /**
     * 获取量表详情
     */
    @SaCheckPermission("assessment:scale:query")
    @GetMapping("/{scaleId}")
    public R<AssessScaleVo> getInfo(@NotNull @PathVariable Long scaleId) {
        return R.ok(scaleService.queryById(scaleId));
    }

    /**
     * 新增量表
     */
    @SaCheckPermission("assessment:scale:add")
    @Log(title = "量表管理", businessType = BusinessType.INSERT)
    @PostMapping
    public R<Void> add(@Validated @RequestBody AssessScaleBo bo) {
        return toAjax(scaleService.insertByBo(bo));
    }

    /**
     * 修改量表
     */
    @SaCheckPermission("assessment:scale:edit")
    @Log(title = "量表管理", businessType = BusinessType.UPDATE)
    @PutMapping
    public R<Void> edit(@Validated @RequestBody AssessScaleBo bo) {
        return toAjax(scaleService.updateByBo(bo));
    }

    /**
     * 删除量表
     */
    @SaCheckPermission("assessment:scale:remove")
    @Log(title = "量表管理", businessType = BusinessType.DELETE)
    @DeleteMapping("/{scaleIds}")
    public R<Void> remove(@NotNull @PathVariable List<Long> scaleIds) {
        return toAjax(scaleService.deleteByIds(scaleIds));
    }
}
