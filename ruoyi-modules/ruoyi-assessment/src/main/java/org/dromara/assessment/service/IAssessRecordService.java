package org.dromara.assessment.service;

import org.dromara.assessment.domain.bo.AssessRecordBo;
import org.dromara.assessment.domain.vo.AssessRecordVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.List;

/**
 * 测评记录 服务接口
 */
public interface IAssessRecordService {

    TableDataInfo<AssessRecordVo> queryPageList(AssessRecordBo bo, PageQuery pageQuery);

    AssessRecordVo queryById(Long recordId);

    Boolean deleteByIds(List<Long> recordIds);
}
