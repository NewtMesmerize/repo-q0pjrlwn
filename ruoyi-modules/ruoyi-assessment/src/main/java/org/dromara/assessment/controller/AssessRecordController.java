package org.dromara.assessment.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessRecordBo;
import org.dromara.assessment.domain.vo.AssessRecordVo;
import org.dromara.assessment.service.IAssessRecordService;
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
 * 测评记录管理
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/assessment/record")
public class AssessRecordController extends BaseController {

    private final IAssessRecordService recordService;

    /**
     * 查询测评记录分页列表
     */
    @SaCheckPermission("assessment:record:list")
    @GetMapping("/list")
    public TableDataInfo<AssessRecordVo> list(AssessRecordBo bo, PageQuery pageQuery) {
        return recordService.queryPageList(bo, pageQuery);
    }

    /**
     * 获取测评记录详情
     */
    @SaCheckPermission("assessment:record:query")
    @GetMapping("/{recordId}")
    public R<AssessRecordVo> getInfo(@NotNull @PathVariable Long recordId) {
        return R.ok(recordService.queryById(recordId));
    }

    /**
     * 删除测评记录
     */
    @SaCheckPermission("assessment:record:remove")
    @Log(title = "测评记录", businessType = BusinessType.DELETE)
    @DeleteMapping("/{recordIds}")
    public R<Void> remove(@NotNull @PathVariable List<Long> recordIds) {
        return toAjax(recordService.deleteByIds(recordIds));
    }
}
