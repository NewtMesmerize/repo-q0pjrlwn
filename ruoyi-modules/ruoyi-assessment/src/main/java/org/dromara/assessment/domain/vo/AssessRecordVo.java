package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessRecord;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 测评记录 视图对象
 */
@Data
@AutoMapper(target = AssessRecord.class)
public class AssessRecordVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "记录ID")
    private Long recordId;

    private Long planId;

    /** 计划名称 */
    private String planName;

    private Long scaleId;

    /** 量表名称 */
    private String scaleName;

    @ExcelProperty(value = "受测者ID")
    private Long userId;

    /** 受测者姓名 */
    private String userName;

    @ExcelProperty(value = "作答次数")
    private Integer attemptNo;

    @ExcelProperty(value = "状态")
    private String status;

    @ExcelProperty(value = "开始时间")
    private Date startTime;

    @ExcelProperty(value = "结束时间")
    private Date endTime;

    @ExcelProperty(value = "用时(秒)")
    private Integer durationSeconds;

    private Integer progress;

    private Integer totalQuestions;

    private String ipAddress;

    private String deviceInfo;

    @ExcelProperty(value = "异常标记")
    private String abnormalFlag;

    private Boolean consentAgreed;

    private Date consentTime;

    private Date createTime;
}
