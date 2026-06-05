package org.dromara.assessment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.dromara.assessment.domain.bo.AssessRecordBo;
import org.dromara.assessment.domain.entity.AssessRecord;
import org.dromara.assessment.domain.vo.AssessRecordVo;
import org.dromara.assessment.mapper.AssessRecordMapper;
import org.dromara.assessment.service.IAssessRecordService;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 测评记录 服务实现
 */
@RequiredArgsConstructor
@Service
public class AssessRecordServiceImpl implements IAssessRecordService {

    private final AssessRecordMapper baseMapper;

    @Override
    public TableDataInfo<AssessRecordVo> queryPageList(AssessRecordBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<AssessRecord> lqw = buildQueryWrapper(bo);
        Page<AssessRecordVo> page = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(page);
    }

    @Override
    public AssessRecordVo queryById(Long recordId) {
        return baseMapper.selectVoById(recordId);
    }

    @Override
    public Boolean deleteByIds(List<Long> recordIds) {
        return baseMapper.deleteByIds(recordIds) > 0;
    }

    private LambdaQueryWrapper<AssessRecord> buildQueryWrapper(AssessRecordBo bo) {
        LambdaQueryWrapper<AssessRecord> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getPlanId() != null, AssessRecord::getPlanId, bo.getPlanId());
        lqw.eq(bo.getScaleId() != null, AssessRecord::getScaleId, bo.getScaleId());
        lqw.eq(bo.getUserId() != null, AssessRecord::getUserId, bo.getUserId());
        lqw.eq(StringUtils.isNotBlank(bo.getStatus()), AssessRecord::getStatus, bo.getStatus());
        lqw.eq(StringUtils.isNotBlank(bo.getAbnormalFlag()),
                AssessRecord::getAbnormalFlag, bo.getAbnormalFlag());
        lqw.orderByDesc(AssessRecord::getCreateTime);
        return lqw;
    }
}
