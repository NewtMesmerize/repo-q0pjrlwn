package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessRiskAlertBo;
import org.dromara.assessment.domain.entity.AssessRiskAlert;
import org.dromara.assessment.domain.vo.AssessRiskAlertVo;
import org.dromara.assessment.mapper.AssessRiskAlertMapper;
import org.dromara.assessment.service.IAssessRiskAlertService;
import org.dromara.common.core.exception.ServiceException;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * 风险预警 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessRiskAlertServiceImpl implements IAssessRiskAlertService {

    private final AssessRiskAlertMapper baseMapper;

    @Override
    public TableDataInfo<AssessRiskAlertVo> queryPageList(AssessRiskAlertBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessRiskAlert> lqw = buildQueryWrapper(bo);
        Page<AssessRiskAlertVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public AssessRiskAlertVo queryById(Long alertId) {
        return baseMapper.selectVoById(alertId);
    }

    @Override
    public Boolean handle(Long alertId, Long handlerId, String handleResult) {
        AssessRiskAlert alert = baseMapper.selectById(alertId);
        if (alert == null) {
            throw new ServiceException("预警记录不存在");
        }
        if (!"0".equals(alert.getHandleStatus())) {
            throw new ServiceException("该预警已处理");
        }
        alert.setHandleStatus("1");
        alert.setHandlerId(handlerId);
        alert.setHandleTime(new Date());
        alert.setHandleResult(handleResult);
        return baseMapper.updateById(alert) > 0;
    }

    @Override
    public Boolean close(Long alertId) {
        AssessRiskAlert alert = baseMapper.selectById(alertId);
        if (alert == null) {
            throw new ServiceException("预警记录不存在");
        }
        alert.setHandleStatus("2");
        return baseMapper.updateById(alert) > 0;
    }

    private LambdaQueryWrapper<AssessRiskAlert> buildQueryWrapper(AssessRiskAlertBo bo) {
        LambdaQueryWrapper<AssessRiskAlert> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getUserId() != null, AssessRiskAlert::getUserId, bo.getUserId());
        lqw.eq(StringUtils.isNotBlank(bo.getRiskLevel()),
                AssessRiskAlert::getRiskLevel, bo.getRiskLevel());
        lqw.eq(StringUtils.isNotBlank(bo.getHandleStatus()),
                AssessRiskAlert::getHandleStatus, bo.getHandleStatus());
        lqw.orderByDesc(AssessRiskAlert::getCreateTime);
        return lqw;
    }
}
