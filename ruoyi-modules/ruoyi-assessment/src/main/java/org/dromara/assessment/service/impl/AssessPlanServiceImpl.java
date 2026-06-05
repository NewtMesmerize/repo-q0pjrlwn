package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessPlanBo;
import org.dromara.assessment.domain.entity.AssessPlan;
import org.dromara.assessment.domain.vo.AssessPlanVo;
import org.dromara.assessment.mapper.AssessPlanMapper;
import org.dromara.assessment.service.IAssessPlanService;
import org.dromara.common.core.exception.ServiceException;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 测评计划 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessPlanServiceImpl implements IAssessPlanService {

    private final AssessPlanMapper baseMapper;

    @Override
    public TableDataInfo<AssessPlanVo> queryPageList(AssessPlanBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessPlan> lqw = buildQueryWrapper(bo);
        Page<AssessPlanVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public AssessPlanVo queryById(Long planId) {
        return baseMapper.selectVoById(planId);
    }

    @Override
    public Boolean insertByBo(AssessPlanBo bo) {
        AssessPlan entity = MapstructUtils.convert(bo, AssessPlan.class);
        entity.setStatus("0"); // 草稿
        return baseMapper.insert(entity) > 0;
    }

    @Override
    public Boolean updateByBo(AssessPlanBo bo) {
        AssessPlan entity = MapstructUtils.convert(bo, AssessPlan.class);
        return baseMapper.updateById(entity) > 0;
    }

    @Override
    public Boolean deleteByIds(List<Long> planIds) {
        return baseMapper.deleteByIds(planIds) > 0;
    }

    @Override
    public Boolean publish(Long planId) {
        AssessPlan plan = baseMapper.selectById(planId);
        if (plan == null) {
            throw new ServiceException("测评计划不存在");
        }
        if (!"0".equals(plan.getStatus())) {
            throw new ServiceException("只有草稿状态的计划才能发布");
        }
        plan.setStatus("1");
        return baseMapper.updateById(plan) > 0;
    }

    @Override
    public Boolean finish(Long planId) {
        AssessPlan plan = baseMapper.selectById(planId);
        if (plan == null) {
            throw new ServiceException("测评计划不存在");
        }
        if (!"1".equals(plan.getStatus())) {
            throw new ServiceException("只有已发布的计划才能结束");
        }
        plan.setStatus("2");
        return baseMapper.updateById(plan) > 0;
    }

    private LambdaQueryWrapper<AssessPlan> buildQueryWrapper(AssessPlanBo bo) {
        LambdaQueryWrapper<AssessPlan> lqw = Wrappers.lambdaQuery();
        lqw.like(StringUtils.isNotBlank(bo.getPlanName()), AssessPlan::getPlanName, bo.getPlanName());
        lqw.eq(bo.getScaleId() != null, AssessPlan::getScaleId, bo.getScaleId());
        lqw.eq(StringUtils.isNotBlank(bo.getPlanType()), AssessPlan::getPlanType, bo.getPlanType());
        lqw.eq(StringUtils.isNotBlank(bo.getStatus()), AssessPlan::getStatus, bo.getStatus());
        lqw.orderByDesc(AssessPlan::getCreateTime);
        return lqw;
    }
}
