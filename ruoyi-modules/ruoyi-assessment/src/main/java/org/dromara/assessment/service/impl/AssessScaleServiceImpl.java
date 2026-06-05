package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessScaleBo;
import org.dromara.assessment.domain.entity.AssessScale;
import org.dromara.assessment.domain.vo.AssessScaleVo;
import org.dromara.assessment.mapper.AssessScaleMapper;
import org.dromara.assessment.service.IAssessScaleService;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 量表 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessScaleServiceImpl implements IAssessScaleService {

    private final AssessScaleMapper baseMapper;

    @Override
    public TableDataInfo<AssessScaleVo> queryPageList(AssessScaleBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessScale> lqw = buildQueryWrapper(bo);
        Page<AssessScaleVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public List<AssessScaleVo> queryList(AssessScaleBo bo) {
        LambdaQueryWrapper<AssessScale> lqw = buildQueryWrapper(bo);
        return baseMapper.selectVoList(lqw);
    }

    @Override
    public AssessScaleVo queryById(Long scaleId) {
        return baseMapper.selectVoById(scaleId);
    }

    @Override
    public Boolean insertByBo(AssessScaleBo bo) {
        AssessScale entity = MapstructUtils.convert(bo, AssessScale.class);
        return baseMapper.insert(entity) > 0;
    }

    @Override
    public Boolean updateByBo(AssessScaleBo bo) {
        AssessScale entity = MapstructUtils.convert(bo, AssessScale.class);
        return baseMapper.updateById(entity) > 0;
    }

    @Override
    public Boolean deleteByIds(List<Long> scaleIds) {
        return baseMapper.deleteByIds(scaleIds) > 0;
    }

    private LambdaQueryWrapper<AssessScale> buildQueryWrapper(AssessScaleBo bo) {
        LambdaQueryWrapper<AssessScale> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getCategoryId() != null, AssessScale::getCategoryId, bo.getCategoryId());
        lqw.like(StringUtils.isNotBlank(bo.getScaleName()), AssessScale::getScaleName, bo.getScaleName());
        lqw.eq(StringUtils.isNotBlank(bo.getScaleCode()), AssessScale::getScaleCode, bo.getScaleCode());
        lqw.eq(StringUtils.isNotBlank(bo.getScaleType()), AssessScale::getScaleType, bo.getScaleType());
        lqw.eq(StringUtils.isNotBlank(bo.getStatus()), AssessScale::getStatus, bo.getStatus());
        lqw.orderByDesc(AssessScale::getCreateTime);
        return lqw;
    }
}
