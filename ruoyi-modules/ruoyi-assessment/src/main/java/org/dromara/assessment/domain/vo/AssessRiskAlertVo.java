package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessRiskAlert;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 风险预警 视图对象
 */
@Data
@AutoMapper(target = AssessRiskAlert.class)
public class AssessRiskAlertVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "预警ID")
    private Long alertId;

    private Long reportId;

    private Long recordId;

    @ExcelProperty(value = "受测者ID")
    private Long userId;

    /** 受测者姓名 */
    private String userName;

    @ExcelProperty(value = "风险等级")
    private String riskLevel;

    private String riskDetail;

    @ExcelProperty(value = "处理状态")
    private String handleStatus;

    private Long handlerId;

    /** 处理人姓名 */
    private String handlerName;

    private Date handleTime;

    private String handleResult;

    private Date createTime;
}
