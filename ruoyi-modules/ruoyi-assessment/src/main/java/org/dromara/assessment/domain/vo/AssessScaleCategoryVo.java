package org.dromara.assessment.domain.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;
import org.dromara.assessment.domain.entity.AssessScaleCategory;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 量表分类 视图对象
 */
@Data
@AutoMapper(target = AssessScaleCategory.class)
public class AssessScaleCategoryVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "分类ID")
    private Long categoryId;

    @ExcelProperty(value = "父分类ID")
    private Long parentId;

    @ExcelProperty(value = "分类名称")
    private String categoryName;

    @ExcelProperty(value = "分类编码")
    private String categoryCode;

    @ExcelProperty(value = "显示顺序")
    private Integer sortOrder;

    @ExcelProperty(value = "状态")
    private String status;

    private String icon;

    private String remark;

    private Date createTime;

    /** 子分类列表 */
    private List<AssessScaleCategoryVo> children;
}
