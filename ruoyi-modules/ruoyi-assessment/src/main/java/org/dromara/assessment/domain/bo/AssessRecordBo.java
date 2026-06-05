package org.dromara.assessment.domain.bo;

import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessRecord;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.util.Date;

/**
 * 测评记录 业务对象
 */
@Data
@AutoMapper(target = AssessRecord.class, reverseConvertGenerate = false)
public class AssessRecordBo extends BaseEntity {

    private Long recordId;

    private Long planId;

    private Long scaleId;

    private Long userId;

    private Integer attemptNo;

    private String status;

    private Date startTime;

    private Date endTime;

    private Integer durationSeconds;

    private Integer progress;

    private Integer totalQuestions;

    private String ipAddress;

    private String deviceInfo;

    private String abnormalFlag;

    private Boolean consentAgreed;
}
