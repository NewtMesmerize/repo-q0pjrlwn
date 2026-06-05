package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessPlan;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 测评计划 视图对象
 */
@Data
@AutoMapper(target = AssessPlan.class)
public class AssessPlanVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "计划ID")
    private Long planId;

    @ExcelProperty(value = "计划名称")
    private String planName;

    private Long scaleId;

    /** 量表名称（关联查询） */
    private String scaleName;

    @ExcelProperty(value = "发布类型")
    private String planType;

    @ExcelProperty(value = "开始时间")
    private Date startTime;

    @ExcelProperty(value = "结束时间")
    private Date endTime;

    private Integer maxAttempts;

    private Integer ageMin;

    private Integer ageMax;

    private String targetScope;

    private String consentText;

    private String privacyText;

    private String instructions;

    private String reportTemplate;

    @ExcelProperty(value = "状态")
    private String status;

    private String remark;

    private Date createTime;
}
