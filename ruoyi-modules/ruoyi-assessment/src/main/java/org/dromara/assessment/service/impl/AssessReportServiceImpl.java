package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessReportBo;
import org.dromara.assessment.domain.entity.AssessReport;
import org.dromara.assessment.domain.vo.AssessReportVo;
import org.dromara.assessment.mapper.AssessReportMapper;
import org.dromara.assessment.service.IAssessReportService;
import org.dromara.common.core.exception.ServiceException;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.satoken.utils.LoginHelper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 测评报告 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessReportServiceImpl implements IAssessReportService {

    private final AssessReportMapper baseMapper;

    @Override
    public TableDataInfo<AssessReportVo> queryPageList(AssessReportBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessReport> lqw = buildQueryWrapper(bo);
        Page<AssessReportVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public AssessReportVo queryById(Long reportId) {
        return baseMapper.selectVoById(reportId);
    }

    @Override
    public Boolean review(Long reportId, String reviewComment) {
        AssessReport report = baseMapper.selectById(reportId);
        if (report == null) {
            throw new ServiceException("报告不存在");
        }
        report.setReviewStatus("1");
        report.setReviewerId(LoginHelper.getUserId());
        report.setReviewTime(new Date());
        report.setReviewComment(reviewComment);
        return baseMapper.updateById(report) > 0;
    }

    @Override
    public Boolean deleteByIds(List<Long> reportIds) {
        return baseMapper.deleteByIds(reportIds) > 0;
    }

    private LambdaQueryWrapper<AssessReport> buildQueryWrapper(AssessReportBo bo) {
        LambdaQueryWrapper<AssessReport> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getRecordId() != null, AssessReport::getRecordId, bo.getRecordId());
        lqw.eq(bo.getScaleId() != null, AssessReport::getScaleId, bo.getScaleId());
        lqw.eq(bo.getUserId() != null, AssessReport::getUserId, bo.getUserId());
        lqw.eq(StringUtils.isNotBlank(bo.getRiskLevel()), AssessReport::getRiskLevel, bo.getRiskLevel());
        lqw.eq(StringUtils.isNotBlank(bo.getReviewStatus()),
                AssessReport::getReviewStatus, bo.getReviewStatus());
        lqw.eq(StringUtils.isNotBlank(bo.getStatus()), AssessReport::getStatus, bo.getStatus());
        lqw.orderByDesc(AssessReport::getCreateTime);
        return lqw;
    }
}
