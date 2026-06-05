package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessQuestionBo;
import org.dromara.assessment.domain.entity.AssessQuestion;
import org.dromara.assessment.domain.entity.AssessQuestionOption;
import org.dromara.assessment.domain.vo.AssessQuestionOptionVo;
import org.dromara.assessment.domain.vo.AssessQuestionVo;
import org.dromara.assessment.mapper.AssessQuestionMapper;
import org.dromara.assessment.mapper.AssessQuestionOptionMapper;
import org.dromara.assessment.service.IAssessQuestionService;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 量表题目 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessQuestionServiceImpl implements IAssessQuestionService {

    private final AssessQuestionMapper baseMapper;
    private final AssessQuestionOptionMapper optionMapper;

    @Override
    public TableDataInfo<AssessQuestionVo> queryPageList(AssessQuestionBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessQuestion> lqw = buildQueryWrapper(bo);
        Page<AssessQuestionVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public List<AssessQuestionVo> queryListByScaleId(Long scaleId) {
        LambdaQueryWrapper<AssessQuestion> lqw = Wrappers.lambdaQuery();
        lqw.eq(AssessQuestion::getScaleId, scaleId);
        lqw.orderByAsc(AssessQuestion::getSortOrder);
        List<AssessQuestionVo> questions = baseMapper.selectVoList(lqw);

        if (!questions.isEmpty()) {
            List<Long> questionIds = questions.stream()
                    .map(AssessQuestionVo::getQuestionId)
                    .collect(Collectors.toList());

            LambdaQueryWrapper<AssessQuestionOption> optionLqw = Wrappers.lambdaQuery();
            optionLqw.in(AssessQuestionOption::getQuestionId, questionIds);
            optionLqw.orderByAsc(AssessQuestionOption::getSortOrder);
            List<AssessQuestionOptionVo> options = optionMapper.selectVoList(optionLqw);

            Map<Long, List<AssessQuestionOptionVo>> optionMap = options.stream()
                    .collect(Collectors.groupingBy(AssessQuestionOptionVo::getQuestionId));

            questions.forEach(q -> q.setOptions(optionMap.get(q.getQuestionId())));
        }
        return questions;
    }

    @Override
    public AssessQuestionVo queryById(Long questionId) {
        AssessQuestionVo vo = baseMapper.selectVoById(questionId);
        if (vo != null) {
            LambdaQueryWrapper<AssessQuestionOption> lqw = Wrappers.lambdaQuery();
            lqw.eq(AssessQuestionOption::getQuestionId, questionId);
            lqw.orderByAsc(AssessQuestionOption::getSortOrder);
            vo.setOptions(optionMapper.selectVoList(lqw));
        }
        return vo;
    }

    @Override
    public Boolean insertByBo(AssessQuestionBo bo) {
        AssessQuestion entity = MapstructUtils.convert(bo, AssessQuestion.class);
        return baseMapper.insert(entity) > 0;
    }

    @Override
    public Boolean updateByBo(AssessQuestionBo bo) {
        AssessQuestion entity = MapstructUtils.convert(bo, AssessQuestion.class);
        return baseMapper.updateById(entity) > 0;
    }

    @Override
    public Boolean deleteByIds(List<Long> questionIds) {
        // 同时删除选项
        LambdaQueryWrapper<AssessQuestionOption> optionLqw = Wrappers.lambdaQuery();
        optionLqw.in(AssessQuestionOption::getQuestionId, questionIds);
        optionMapper.delete(optionLqw);
        return baseMapper.deleteByIds(questionIds) > 0;
    }

    private LambdaQueryWrapper<AssessQuestion> buildQueryWrapper(AssessQuestionBo bo) {
        LambdaQueryWrapper<AssessQuestion> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getScaleId() != null, AssessQuestion::getScaleId, bo.getScaleId());
        lqw.eq(bo.getDimensionId() != null, AssessQuestion::getDimensionId, bo.getDimensionId());
        lqw.eq(StringUtils.isNotBlank(bo.getQuestionType()),
                AssessQuestion::getQuestionType, bo.getQuestionType());
        lqw.like(StringUtils.isNotBlank(bo.getContent()),
                AssessQuestion::getContent, bo.getContent());
        lqw.orderByAsc(AssessQuestion::getSortOrder);
        return lqw;
    }
}
