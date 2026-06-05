package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessScale;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 量表 视图对象
 */
@Data
@AutoMapper(target = AssessScale.class)
public class AssessScaleVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "量表ID")
    private Long scaleId;

    @ExcelProperty(value = "所属分类")
    private Long categoryId;

    /** 分类名称（关联查询） */
    private String categoryName;

    @ExcelProperty(value = "量表名称")
    private String scaleName;

    @ExcelProperty(value = "量表编码")
    private String scaleCode;

    @ExcelProperty(value = "类型")
    private String scaleType;

    @ExcelProperty(value = "价格")
    private BigDecimal price;

    private String description;

    private String validityInfo;

    private String normSource;

    @ExcelProperty(value = "适用人群")
    private String targetPopulation;

    @ExcelProperty(value = "测评时长(分钟)")
    private Integer durationMinutes;

    @ExcelProperty(value = "题目数量")
    private Integer questionCount;

    private String copyrightInfo;

    private String version;

    private Boolean trialEnabled;

    private Integer trialCount;

    private String coverImage;

    @ExcelProperty(value = "状态")
    private String status;

    private String remark;

    private Date createTime;
}
