package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessScaleCategoryBo;
import org.dromara.assessment.domain.entity.AssessScaleCategory;
import org.dromara.assessment.domain.vo.AssessScaleCategoryVo;
import org.dromara.assessment.mapper.AssessScaleCategoryMapper;
import org.dromara.assessment.service.IAssessScaleCategoryService;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.core.utils.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 量表分类 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessScaleCategoryServiceImpl implements IAssessScaleCategoryService {

    private final AssessScaleCategoryMapper baseMapper;

    @Override
    public List<AssessScaleCategoryVo> queryTree(AssessScaleCategoryBo bo) {
        LambdaQueryWrapper<AssessScaleCategory> lqw = buildQueryWrapper(bo);
        lqw.orderByAsc(AssessScaleCategory::getSortOrder);
        List<AssessScaleCategoryVo> list = baseMapper.selectVoList(lqw);
        return buildTree(list, 0L);
    }

    @Override
    public AssessScaleCategoryVo queryById(Long categoryId) {
        return baseMapper.selectVoById(categoryId);
    }

    @Override
    public Boolean insertByBo(AssessScaleCategoryBo bo) {
        AssessScaleCategory entity = MapstructUtils.convert(bo, AssessScaleCategory.class);
        return baseMapper.insert(entity) > 0;
    }

    @Override
    public Boolean updateByBo(AssessScaleCategoryBo bo) {
        AssessScaleCategory entity = MapstructUtils.convert(bo, AssessScaleCategory.class);
        return baseMapper.updateById(entity) > 0;
    }

    @Override
    public Boolean deleteById(Long categoryId) {
        return baseMapper.deleteById(categoryId) > 0;
    }

    private LambdaQueryWrapper<AssessScaleCategory> buildQueryWrapper(AssessScaleCategoryBo bo) {
        LambdaQueryWrapper<AssessScaleCategory> lqw = Wrappers.lambdaQuery();
        lqw.like(StringUtils.isNotBlank(bo.getCategoryName()),
                AssessScaleCategory::getCategoryName, bo.getCategoryName());
        lqw.eq(StringUtils.isNotBlank(bo.getStatus()),
                AssessScaleCategory::getStatus, bo.getStatus());
        return lqw;
    }

    private List<AssessScaleCategoryVo> buildTree(List<AssessScaleCategoryVo> list, Long parentId) {
        return list.stream()
                .filter(item -> parentId.equals(item.getParentId()))
                .peek(item -> item.setChildren(buildTree(list, item.getCategoryId())))
                .collect(Collectors.toList());
    }
}
